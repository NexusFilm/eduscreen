begin;

do $$ 
begin
  -- Drop existing policies if tables exist
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'widgets') then
    drop policy if exists "Users can view own widgets" on public.widgets;
    drop policy if exists "Users can create widgets" on public.widgets;
    drop policy if exists "Users can update own widgets" on public.widgets;
    drop policy if exists "Users can delete own widgets" on public.widgets;
  end if;

  if exists (select from pg_tables where schemaname = 'public' and tablename = 'media') then
    drop policy if exists "Users can view own media" on public.media;
    drop policy if exists "Users can upload media" on public.media;
    drop policy if exists "Users can delete own media" on public.media;
  end if;

  if exists (select from pg_tables where schemaname = 'public' and tablename = 'documents') then
    drop policy if exists "Users can view own documents" on public.documents;
    drop policy if exists "Users can create documents" on public.documents;
    drop policy if exists "Users can update own documents" on public.documents;
    drop policy if exists "Users can delete own documents" on public.documents;
  end if;

  if exists (select from pg_tables where schemaname = 'public' and tablename = 'classes') then
    drop policy if exists "Users can view own classes" on public.classes;
    drop policy if exists "Users can create classes" on public.classes;
    drop policy if exists "Users can update own classes" on public.classes;
    drop policy if exists "Users can delete own classes" on public.classes;
  end if;

  if exists (select from pg_tables where schemaname = 'public' and tablename = 'profiles') then
    drop policy if exists "Users can view own profile" on public.profiles;
    drop policy if exists "Users can update own profile" on public.profiles;
  end if;
end $$;

-- Drop existing tables in reverse order of dependencies
drop table if exists public.notes cascade;
drop table if exists public.class_documents cascade;
drop table if exists public.widgets cascade;
drop table if exists public.media cascade;
drop table if exists public.documents cascade;
drop table if exists public.classes cascade;
drop table if exists public.users cascade;
drop table if exists public.profiles cascade;

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create classes table
create table if not exists public.classes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  theme text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create documents table
create table if not exists public.documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content jsonb,
  class_id uuid references public.classes(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create media table
create table if not exists public.media (
  id uuid default uuid_generate_v4() primary key,
  storage_path text not null,
  original_name text not null,
  mime_type text,
  size bigint,
  document_id uuid references public.documents(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create widgets table
create table if not exists public.widgets (
  id uuid default uuid_generate_v4() primary key,
  type text not null,
  config jsonb,
  position jsonb,
  document_id uuid references public.documents(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.documents enable row level security;
alter table public.media enable row level security;
alter table public.widgets enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view own classes"
  on public.classes for select
  using (auth.uid() = user_id);

create policy "Users can create classes"
  on public.classes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own classes"
  on public.classes for update
  using (auth.uid() = user_id);

create policy "Users can delete own classes"
  on public.classes for delete
  using (auth.uid() = user_id);

create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can create documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update own documents"
  on public.documents for update
  using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

create policy "Users can view own media"
  on public.media for select
  using (auth.uid() = user_id);

create policy "Users can upload media"
  on public.media for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own media"
  on public.media for delete
  using (auth.uid() = user_id);

create policy "Users can view own widgets"
  on public.widgets for select
  using (auth.uid() = user_id);

create policy "Users can create widgets"
  on public.widgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own widgets"
  on public.widgets for update
  using (auth.uid() = user_id);

create policy "Users can delete own widgets"
  on public.widgets for delete
  using (auth.uid() = user_id);

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

commit; 