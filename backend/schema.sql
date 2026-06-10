-- SQL to initialize the digests table in Supabase.
-- Paste this in the Supabase SQL Editor.

create table if not exists digests (
  id bigint generated always as identity primary key,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  espresso jsonb not null,
  cold_brew jsonb not null,
  pastry jsonb not null
);

-- Optional: Enable Row Level Security (RLS) if exposing database directly.
-- For a hackathon, we can disable or set up public read access.
alter table digests enable row level security;

-- Policy for public reading
create policy "Allow public read access" on digests
  for select using (true);

-- Policy for backend inserts (using service role key or anon key, depending on setup)
create policy "Allow service insertion" on digests
  for insert with check (true);
