-- Insert test user
insert into auth.users (id, email)
values ('00000000-0000-0000-0000-000000000000', 'test@example.com');

insert into public.users (id, email, full_name)
values ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User');

-- Insert test class
insert into public.classes (id, name, theme, user_id)
values (
  '11111111-1111-1111-1111-111111111111',
  'Test Class',
  'default',
  '00000000-0000-0000-0000-000000000000'
);

-- Insert test widgets
insert into public.widgets (id, class_id, type, label, position, size, is_core)
values
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'timer', 'Timer', '{"x": 0, "y": 0}', 'medium', true),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'calculator', 'Calculator', '{"x": 200, "y": 0}', 'medium', true),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'notes', 'Notes', '{"x": 400, "y": 0}', 'medium', true);

-- Insert test notes
insert into public.notes (widget_id, content, color, position)
values
  ('44444444-4444-4444-4444-444444444444', 'Test note 1', 'yellow', 0),
  ('44444444-4444-4444-4444-444444444444', 'Test note 2', 'blue', 1);

-- Insert test document
insert into public.documents (id, user_id, title, content)
values (
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'Test Document',
  'This is a test document content'
);

-- Link document to class
insert into public.class_documents (class_id, document_id)
values (
  '11111111-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555555'
); 