create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  birthday date,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vaults (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  vault_type text not null,
  subject_name text,
  subject_birthdate date,
  description text,
  cover_image_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vault_members (
  id uuid primary key default gen_random_uuid(),
  vault_id uuid not null references public.vaults(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  unique (vault_id, user_id)
);

create table if not exists public.vault_entries (
  id uuid primary key default gen_random_uuid(),
  vault_id uuid not null references public.vaults(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content_text text,
  entry_type text not null,
  mood text,
  unlock_type text not null,
  unlock_at timestamptz,
  milestone_label text,
  prediction_text text,
  reality_text text,
  created_at timestamptz not null default timezone('utc', now()),
  is_deleted boolean not null default false,
  milestone_achieved_at timestamptz
);

create table if not exists public.entry_assets (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.vault_entries(id) on delete cascade,
  file_url text not null,
  file_type text not null
);

create table if not exists public.entry_tags (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.vault_entries(id) on delete cascade,
  tag text not null
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = nullif(excluded.full_name, '');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_vault_member(target_vault_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.vaults v
    left join public.vault_members vm on vm.vault_id = v.id
    where v.id = target_vault_id
      and (
        v.owner_user_id = auth.uid()
        or vm.user_id = auth.uid()
      )
  );
$$;

alter table public.profiles enable row level security;
alter table public.vaults enable row level security;
alter table public.vault_members enable row level security;
alter table public.vault_entries enable row level security;
alter table public.entry_assets enable row level security;
alter table public.entry_tags enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "vaults_select_member" on public.vaults;
create policy "vaults_select_member"
on public.vaults
for select
using (public.is_vault_member(id));

drop policy if exists "vaults_insert_owner" on public.vaults;
create policy "vaults_insert_owner"
on public.vaults
for insert
with check (auth.uid() = owner_user_id);

drop policy if exists "vaults_update_owner" on public.vaults;
create policy "vaults_update_owner"
on public.vaults
for update
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

drop policy if exists "vaults_delete_owner" on public.vaults;
create policy "vaults_delete_owner"
on public.vaults
for delete
using (auth.uid() = owner_user_id);

drop policy if exists "vault_members_select_member" on public.vault_members;
create policy "vault_members_select_member"
on public.vault_members
for select
using (public.is_vault_member(vault_id));

drop policy if exists "vault_members_manage_owner" on public.vault_members;
create policy "vault_members_manage_owner"
on public.vault_members
for all
using (
  exists (
    select 1
    from public.vaults v
    where v.id = vault_id
      and v.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.vaults v
    where v.id = vault_id
      and v.owner_user_id = auth.uid()
  )
);

drop policy if exists "vault_entries_select_member" on public.vault_entries;
create policy "vault_entries_select_member"
on public.vault_entries
for select
using (public.is_vault_member(vault_id));

drop policy if exists "vault_entries_insert_member" on public.vault_entries;
create policy "vault_entries_insert_member"
on public.vault_entries
for insert
with check (
  auth.uid() = user_id
  and public.is_vault_member(vault_id)
);

drop policy if exists "vault_entries_update_owner" on public.vault_entries;
create policy "vault_entries_update_owner"
on public.vault_entries
for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and public.is_vault_member(vault_id)
);

drop policy if exists "vault_entries_delete_owner" on public.vault_entries;
create policy "vault_entries_delete_owner"
on public.vault_entries
for delete
using (auth.uid() = user_id);

drop policy if exists "entry_assets_select_member" on public.entry_assets;
create policy "entry_assets_select_member"
on public.entry_assets
for select
using (
  exists (
    select 1
    from public.vault_entries ve
    where ve.id = entry_id
      and public.is_vault_member(ve.vault_id)
  )
);

drop policy if exists "entry_assets_manage_owner" on public.entry_assets;
create policy "entry_assets_manage_owner"
on public.entry_assets
for all
using (
  exists (
    select 1
    from public.vault_entries ve
    where ve.id = entry_id
      and ve.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.vault_entries ve
    where ve.id = entry_id
      and ve.user_id = auth.uid()
      and public.is_vault_member(ve.vault_id)
  )
);

drop policy if exists "entry_tags_select_member" on public.entry_tags;
create policy "entry_tags_select_member"
on public.entry_tags
for select
using (
  exists (
    select 1
    from public.vault_entries ve
    where ve.id = entry_id
      and public.is_vault_member(ve.vault_id)
  )
);

drop policy if exists "entry_tags_manage_owner" on public.entry_tags;
create policy "entry_tags_manage_owner"
on public.entry_tags
for all
using (
  exists (
    select 1
    from public.vault_entries ve
    where ve.id = entry_id
      and ve.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.vault_entries ve
    where ve.id = entry_id
      and ve.user_id = auth.uid()
      and public.is_vault_member(ve.vault_id)
  )
);

create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists vaults_owner_user_id_idx on public.vaults(owner_user_id);
create index if not exists vault_members_vault_id_idx on public.vault_members(vault_id);
create index if not exists vault_members_user_id_idx on public.vault_members(user_id);
create index if not exists vault_entries_vault_id_idx on public.vault_entries(vault_id);
create index if not exists vault_entries_user_id_idx on public.vault_entries(user_id);
create index if not exists vault_entries_unlock_at_idx on public.vault_entries(unlock_at);
create index if not exists entry_assets_entry_id_idx on public.entry_assets(entry_id);
create index if not exists entry_tags_entry_id_idx on public.entry_tags(entry_id);

