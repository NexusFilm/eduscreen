-- Create users table
create table public.users (
  id uuid references auth.users primary key,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create classes table
create table public.classes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  theme text not null,
  user_id uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create widgets table
create table public.widgets (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references public.classes(id) on delete cascade,
  type text not null,
  label text,
  position jsonb,
  size text,
  is_core boolean default false,
  settings jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create notes table
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  widget_id uuid references public.widgets(id) on delete cascade,
  content text,
  color text,
  position integer,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create documents table
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  title text not null,
  content text,
  file_url text,
  file_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create class_documents junction table
create table public.class_documents (
  class_id uuid references public.classes(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (class_id, document_id)
);

-- Create storage buckets
insert into storage.buckets (id, name)
values 
  ('documents', 'Documents'),
  ('avatars', 'User Avatars');

-- Set up storage policies
create policy "Documents are accessible by owner"
on storage.objects for select
using (auth.uid() = owner);

create policy "Documents can be inserted by owner"
on storage.objects for insert
with check (auth.uid() = owner);

create policy "Documents can be updated by owner"
on storage.objects for update
using (auth.uid() = owner);

create policy "Documents can be deleted by owner"
on storage.objects for delete
using (auth.uid() = owner);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.classes enable row level security;
alter table public.widgets enable row level security;
alter table public.notes enable row level security;
alter table public.documents enable row level security;
alter table public.class_documents enable row level security;

-- Create RLS policies
create policy "Users can view their own data"
on public.users for select
using (auth.uid() = id);

create policy "Classes are viewable by owner"
on public.classes for select
using (auth.uid() = user_id);

create policy "Classes can be created by authenticated users"
on public.classes for insert
with check (auth.uid() = user_id);

create policy "Classes can be updated by owner"
on public.classes for update
using (auth.uid() = user_id);

create policy "Classes can be deleted by owner"
on public.classes for delete
using (auth.uid() = user_id);

-- Widgets policies
create policy "Widgets are viewable by class owner"
on public.widgets for select
using (
  exists (
    select 1 from public.classes
    where classes.id = widgets.class_id
    and classes.user_id = auth.uid()
  )
);

create policy "Widgets can be created by class owner"
on public.widgets for insert
with check (
  exists (
    select 1 from public.classes
    where classes.id = class_id
    and classes.user_id = auth.uid()
  )
);

create policy "Widgets can be updated by class owner"
on public.widgets for update
using (
  exists (
    select 1 from public.classes
    where classes.id = widgets.class_id
    and classes.user_id = auth.uid()
  )
);

create policy "Widgets can be deleted by class owner"
on public.widgets for delete
using (
  exists (
    select 1 from public.classes
    where classes.id = widgets.class_id
    and classes.user_id = auth.uid()
  )
); 