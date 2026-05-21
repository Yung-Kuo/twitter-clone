-- Add profiles.created_at, backfilled from updated_at (same instant per row).
-- Apply: supabase db push, or run in Supabase SQL editor.

alter table public.profiles
  add column if not exists created_at timestamptz;

update public.profiles
set created_at = updated_at
where created_at is null;

comment on column public.profiles.created_at is 'Row creation time; initially copied from updated_at for existing rows';
