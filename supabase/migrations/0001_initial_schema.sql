create extension if not exists "pgcrypto";

create type public.app_role as enum ('learner', 'admin');
create type public.content_status as enum ('draft', 'published');
create type public.lesson_progress_status as enum ('not_started', 'in_progress', 'completed');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  role public.app_role not null default 'learner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  status public.content_status not null default 'draft',
  estimated_minutes integer not null default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  position integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, position)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  content_markdown text not null default '',
  position integer not null,
  estimated_minutes integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(module_id, slug),
  unique(module_id, position)
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  prompt text not null,
  explanation text,
  position integer not null,
  allows_multiple boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(lesson_id, position)
);

create table if not exists public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  content text not null,
  is_correct boolean not null default false,
  position integer not null,
  created_at timestamptz not null default now(),
  unique(question_id, position)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status public.lesson_progress_status not null default 'not_started',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  score integer not null default 0,
  total integer not null default 0,
  submitted_at timestamptz not null default now()
);

create table if not exists public.quiz_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  selected_option_id uuid references public.quiz_options(id) on delete set null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  points integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_status on public.courses(status);
create index if not exists idx_lessons_status on public.lessons(status);
create index if not exists idx_modules_course_position on public.modules(course_id, position);
create index if not exists idx_lessons_module_position on public.lessons(module_id, position);
create index if not exists idx_lesson_progress_user_lesson on public.lesson_progress(user_id, lesson_id);
create index if not exists idx_quiz_attempts_user_submitted on public.quiz_attempts(user_id, submitted_at desc);
create index if not exists idx_xp_events_user_created on public.xp_events(user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
