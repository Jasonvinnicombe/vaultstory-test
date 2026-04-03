alter table public.profiles
  add column if not exists is_admin boolean not null default false;

create table if not exists public.admin_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  invited_by_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists admin_invites_email_pending_idx
on public.admin_invites (email)
where status = 'pending';

alter table public.admin_invites enable row level security;

update public.profiles
set is_admin = true
where lower(email) = 'jasonvinnicombe2@gmail.com';
