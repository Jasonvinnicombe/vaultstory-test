alter table public.profiles
  add column if not exists downgrade_grace_until timestamptz;
