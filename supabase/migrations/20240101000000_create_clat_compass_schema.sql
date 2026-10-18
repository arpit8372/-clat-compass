-- ====================================================================
-- CLAT Compass: Complete Database Schema Migration
-- Production-ready PostgreSQL schema with Row Level Security (RLS)
-- ====================================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'student' check (role in ('admin', 'student')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Helper function to check if current user is an admin without recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile name"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (
    -- Students cannot elevate their own role to admin
    (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()))
    or public.is_admin()
  );

create policy "Admins can insert or delete profiles"
  on public.profiles for all
  using (public.is_admin());

-- Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. SUBJECTS TABLE
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique check (code in ('english', 'gk', 'legal', 'logical', 'quant')),
  description text,
  display_order int not null default 0
);

alter table public.subjects enable row level security;

create policy "Authenticated users can read subjects"
  on public.subjects for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage subjects"
  on public.subjects for all
  using (public.is_admin());


-- 3. TOPICS TABLE
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (subject_id, slug)
);

alter table public.topics enable row level security;

create policy "Authenticated users can read topics"
  on public.topics for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage topics"
  on public.topics for all
  using (public.is_admin());


-- 4. PASSAGES TABLE
create table if not exists public.passages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  source text,
  image_url text,
  word_count int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.passages enable row level security;

create policy "Authenticated users can read passages"
  on public.passages for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage passages"
  on public.passages for all
  using (public.is_admin());


-- 5. QUESTIONS TABLE
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  passage_id uuid references public.passages(id) on delete set null,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  question_text text not null,
  options jsonb not null, -- Array of { "id": "A", "text": "..." }
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text not null,
  marks_positive numeric not null default 1.0,
  marks_negative numeric not null default 0.25,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  is_pyq boolean not null default false,
  pyq_year int,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.questions enable row level security;

create policy "Authenticated users can read questions"
  on public.questions for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage questions"
  on public.questions for all
  using (public.is_admin());


-- 6. TESTS TABLE (Mocks, PYQs, Sectional Sets)
create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  type text not null default 'full_mock' check (type in ('full_mock', 'sectional', 'pyq', 'practice_set')),
  duration_minutes int not null default 120,
  total_marks numeric not null default 120,
  positive_mark numeric not null default 1.0,
  negative_mark numeric not null default 0.25,
  is_published boolean not null default true,
  pyq_year int,
  subject_id uuid references public.subjects(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tests enable row level security;

create policy "Authenticated users can read published tests"
  on public.tests for select
  using (auth.role() = 'authenticated' and (is_published = true or public.is_admin()));

create policy "Admins can manage tests"
  on public.tests for all
  using (public.is_admin());


-- 7. TEST_QUESTIONS (Junction linking test to questions)
create table if not exists public.test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  order_seq int not null default 1,
  section_name text,
  unique (test_id, question_id)
);

alter table public.test_questions enable row level security;

create policy "Authenticated users can read test questions"
  on public.test_questions for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage test questions"
  on public.test_questions for all
  using (public.is_admin());


-- 8. TEST_ATTEMPTS TABLE
create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  test_id uuid references public.tests(id) on delete set null,
  mode text not null check (mode in ('mock', 'practice', 'pyq', 'revision')),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  time_spent_seconds int not null default 0,
  score numeric not null default 0,
  total_questions int not null default 0,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  unattempted_count int not null default 0,
  accuracy numeric not null default 0,
  subject_breakdown jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.test_attempts enable row level security;

create policy "Users can read own test attempts"
  on public.test_attempts for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can create own test attempts"
  on public.test_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own test attempts"
  on public.test_attempts for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());


-- 9. ATTEMPT_RESPONSES TABLE
create table if not exists public.attempt_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option text check (selected_option in ('A', 'B', 'C', 'D') or selected_option is null),
  is_correct boolean,
  is_marked_for_review boolean not null default false,
  time_spent_seconds int not null default 0,
  visited boolean not null default true,
  answered_at timestamptz,
  unique (attempt_id, question_id)
);

alter table public.attempt_responses enable row level security;

create policy "Users can view attempt responses for own attempts"
  on public.attempt_responses for select
  using (
    exists (
      select 1 from public.test_attempts ta
      where ta.id = attempt_responses.attempt_id
        and (ta.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Users can insert attempt responses for own attempts"
  on public.attempt_responses for insert
  with check (
    exists (
      select 1 from public.test_attempts ta
      where ta.id = attempt_responses.attempt_id
        and ta.user_id = auth.uid()
    )
  );

create policy "Users can update attempt responses for own attempts"
  on public.attempt_responses for update
  using (
    exists (
      select 1 from public.test_attempts ta
      where ta.id = attempt_responses.attempt_id
        and ta.user_id = auth.uid()
    )
  );


-- 10. BOOKMARKS TABLE
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  notes text,
  tag text,
  created_at timestamptz not null default now(),
  unique (user_id, question_id)
);

alter table public.bookmarks enable row level security;

create policy "Users can manage own bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can view bookmarks"
  on public.bookmarks for select
  using (public.is_admin());


-- 11. STORAGE BUCKET FOR QUESTION/PASSAGE MEDIA
insert into storage.buckets (id, name, public)
values ('clat-media', 'clat-media', true)
on conflict (id) do nothing;

create policy "Media is viewable by authenticated users"
  on storage.objects for select
  using (bucket_id = 'clat-media' and auth.role() = 'authenticated');

create policy "Media is uploadable and manageable by admin only"
  on storage.objects for all
  using (bucket_id = 'clat-media' and public.is_admin());

-- Pre-seed Subjects
insert into public.subjects (name, code, description, display_order)
values
  ('English Language', 'english', 'Reading comprehension, inference, vocabulary in context, grammar', 1),
  ('Current Affairs & General Knowledge', 'gk', 'National and international affairs, legal developments, history, politics', 2),
  ('Legal Reasoning', 'legal', 'Legal principles, fact situations, application of legal doctrines', 3),
  ('Logical Reasoning', 'logical', 'Critical reasoning, arguments, assumptions, conclusions, syllogisms', 4),
  ('Quantitative Techniques', 'quant', 'Data interpretation, percentages, ratios, graphical analysis', 5)
on conflict (code) do nothing;
