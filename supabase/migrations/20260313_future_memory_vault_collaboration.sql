alter table public.profiles
  add column if not exists timezone text,
  add column if not exists notification_preferences jsonb default '{"emailReminders": true, "unlockDigest": true}'::jsonb;

create table if not exists public.vault_invites (
  id uuid primary key default gen_random_uuid(),
  vault_id uuid not null references public.vaults(id) on delete cascade,
  email text not null,
  role text not null default 'viewer',
  invited_by_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists vault_invites_unique_pending_idx
on public.vault_invites (vault_id, email)
where status = 'pending';

create or replace function public.has_vault_role(target_vault_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.vaults v
    left join public.vault_members vm on vm.vault_id = v.id and vm.user_id = auth.uid()
    where v.id = target_vault_id
      and (
        v.owner_user_id = auth.uid()
        or vm.role = any(allowed_roles)
      )
  );
$$;

alter table public.vault_invites enable row level security;

drop policy if exists "vault_invites_select_owner" on public.vault_invites;
create policy "vault_invites_select_owner"
on public.vault_invites
for select
using (public.has_vault_role(vault_id, array['owner']));

drop policy if exists "vault_invites_manage_owner" on public.vault_invites;
create policy "vault_invites_manage_owner"
on public.vault_invites
for all
using (public.has_vault_role(vault_id, array['owner']))
with check (public.has_vault_role(vault_id, array['owner']));

drop policy if exists "vault_entries_insert_member" on public.vault_entries;
create policy "vault_entries_insert_member"
on public.vault_entries
for insert
with check (
  auth.uid() = user_id
  and public.has_vault_role(vault_id, array['owner', 'editor'])
);

drop policy if exists "vault_entries_update_owner" on public.vault_entries;
create policy "vault_entries_update_owner"
on public.vault_entries
for update
using (public.has_vault_role(vault_id, array['owner', 'editor']))
with check (
  auth.uid() = user_id
  and public.has_vault_role(vault_id, array['owner', 'editor'])
);
