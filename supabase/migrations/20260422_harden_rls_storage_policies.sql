-- Harden Vault Story row level security and storage policies.
-- This migration mirrors the live Supabase hardening applied during the RLS audit.

-- Storage buckets should stay private. Media is read through owner-folder policies
-- and server-generated signed URLs for authorized vault members.
update storage.buckets
set public = false
where id in ('avatars', 'vault-covers', 'entry-assets');

drop policy if exists "avatars authenticated read" on storage.objects;
drop policy if exists "entry assets authenticated read" on storage.objects;
drop policy if exists "vault covers authenticated read" on storage.objects;

drop policy if exists "avatars owner read" on storage.objects;
create policy "avatars owner read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "entry assets owner read" on storage.objects;
create policy "entry assets owner read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'entry-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "vault covers owner read" on storage.objects;
create policy "vault covers owner read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'vault-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Remove older duplicate public table policies now covered by authenticated policies.
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

drop policy if exists "vaults_delete_owner" on public.vaults;
drop policy if exists "vaults_insert_owner" on public.vaults;
drop policy if exists "vaults_select_member" on public.vaults;
drop policy if exists "vaults_update_owner" on public.vaults;

drop policy if exists "vault_entries_delete_owner" on public.vault_entries;
drop policy if exists "vault_entries_insert_member" on public.vault_entries;
drop policy if exists "vault_entries_select_member" on public.vault_entries;
drop policy if exists "vault_entries_update_owner" on public.vault_entries;

drop policy if exists "entry_assets_manage_owner" on public.entry_assets;
drop policy if exists "entry_assets_select_member" on public.entry_assets;

drop policy if exists "entry_tags_manage_owner" on public.entry_tags;
drop policy if exists "entry_tags_select_member" on public.entry_tags;

drop policy if exists "vault_members_manage_owner" on public.vault_members;
drop policy if exists "vault_members_select_member" on public.vault_members;

-- Keep required delete permissions after removing broad ALL policies.
drop policy if exists "entry tags delete owner or editor" on public.entry_tags;
create policy "entry tags delete owner or editor"
on public.entry_tags
for delete
to authenticated
using (
  exists (
    select 1
    from vault_entries ve
    join vaults v on v.id = ve.vault_id
    left join vault_members vm on vm.vault_id = v.id
    where ve.id = entry_tags.entry_id
      and (
        v.owner_user_id = auth.uid()
        or (
          vm.user_id = auth.uid()
          and vm.role = any (array['owner'::text, 'editor'::text])
        )
      )
  )
);

drop policy if exists "vault members delete owners" on public.vault_members;
create policy "vault members delete owners"
on public.vault_members
for delete
to authenticated
using (
  can_manage_vault(vault_id, auth.uid())
);

-- Invite policies are authenticated-only; owners can manage invites for their vaults.
alter policy "vault_invites_manage_owner"
on public.vault_invites
to authenticated;

alter policy "vault_invites_select_owner"
on public.vault_invites
to authenticated;

-- Editors can update content, but ownership columns should not be client-editable.
revoke update (owner_user_id) on public.vaults from authenticated;
revoke update (user_id) on public.vault_entries from authenticated;
