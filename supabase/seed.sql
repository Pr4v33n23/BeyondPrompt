insert into public.courses (id, slug, title, description, status, estimated_minutes)
values
  (
    '3f0f00ca-a6e0-40bc-b8d9-a7299fcf3d12',
    'prompt-engineering-basics',
    'Prompt Engineering Basics',
    'Build practical prompt patterns for reliable AI outputs.',
    'published',
    90
  )
on conflict (slug) do nothing;

insert into public.modules (id, course_id, title, description, position)
values
  (
    '18c6c815-1d3b-4df6-89c3-4e03c8d66d3d',
    '3f0f00ca-a6e0-40bc-b8d9-a7299fcf3d12',
    'Foundations',
    'Core prompting concepts and constraints.',
    1
  )
on conflict (course_id, position) do nothing;

insert into public.lessons (id, module_id, slug, title, content_markdown, position, estimated_minutes, status)
values
  (
    '3d66d967-15b9-4af8-96d9-cadf9aee6ce1',
    '18c6c815-1d3b-4df6-89c3-4e03c8d66d3d',
    'what-makes-a-good-prompt',
    'What Makes a Good Prompt',
    '# What Makes a Good Prompt\n\nA strong prompt is specific, contextual, and constrained.',
    1,
    10,
    'published'
  )
on conflict (module_id, slug) do nothing;
