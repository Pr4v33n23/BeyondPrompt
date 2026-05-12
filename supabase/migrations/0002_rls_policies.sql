alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_attempt_answers enable row level security;
alter table public.xp_events enable row level security;

create policy "profiles_self_read"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_self_update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "published_courses_read"
  on public.courses for select
  to authenticated
  using (status = 'published');

create policy "published_modules_read"
  on public.modules for select
  to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = modules.course_id and c.status = 'published'
    )
  );

create policy "published_lessons_read"
  on public.lessons for select
  to authenticated
  using (
    status = 'published'
    and exists (
      select 1
      from public.modules m
      join public.courses c on c.id = m.course_id
      where m.id = lessons.module_id
        and c.status = 'published'
    )
  );

create policy "published_quiz_questions_read"
  on public.quiz_questions for select
  to authenticated
  using (
    exists (
      select 1
      from public.lessons l
      where l.id = quiz_questions.lesson_id and l.status = 'published'
    )
  );

create policy "published_quiz_options_read"
  on public.quiz_options for select
  to authenticated
  using (
    exists (
      select 1
      from public.quiz_questions qq
      join public.lessons l on l.id = qq.lesson_id
      where qq.id = quiz_options.question_id and l.status = 'published'
    )
  );

create policy "lesson_progress_own"
  on public.lesson_progress
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "quiz_attempts_own"
  on public.quiz_attempts
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "quiz_attempt_answers_own"
  on public.quiz_attempt_answers
  for all
  to authenticated
  using (
    exists (
      select 1 from public.quiz_attempts qa
      where qa.id = quiz_attempt_answers.attempt_id and qa.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.quiz_attempts qa
      where qa.id = quiz_attempt_answers.attempt_id and qa.user_id = auth.uid()
    )
  );

create policy "xp_events_own"
  on public.xp_events
  for select
  to authenticated
  using (auth.uid() = user_id);
