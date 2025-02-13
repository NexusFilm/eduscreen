-- Insert test user
insert into auth.users (id, email)
values ('00000000-0000-0000-0000-000000000000', 'test@example.com');

-- Update test profile with full name
update public.profiles 
set full_name = 'Test User'
where id = '00000000-0000-0000-0000-000000000000';

-- Insert test class
insert into public.classes (id, name, theme, user_id)
values (
  '11111111-1111-1111-1111-111111111111',
  'Test Class',
  'ocean',
  '00000000-0000-0000-0000-000000000000'
);

-- Insert test document
insert into public.documents (id, title, content, class_id, user_id)
values (
  '55555555-5555-5555-5555-555555555555',
  'Test Document',
  '{"content": "This is a test document content"}',
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000'
);

-- Insert test widgets
insert into public.widgets (id, type, config, position, document_id, user_id)
values
  (
    '22222222-2222-2222-2222-222222222222',
    'timer',
    '{"label": "Timer", "duration": 300}',
    '{"x": 0, "y": 0}',
    '55555555-5555-5555-5555-555555555555',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'calculator',
    '{"label": "Calculator"}',
    '{"x": 350, "y": 0}',
    '55555555-5555-5555-5555-555555555555',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'notes',
    '{"label": "Notes", "notes": [{"content": "Test note 1", "color": "yellow"}, {"content": "Test note 2", "color": "blue"}]}',
    '{"x": 700, "y": 0}',
    '55555555-5555-5555-5555-555555555555',
    '00000000-0000-0000-0000-000000000000'
  ); 