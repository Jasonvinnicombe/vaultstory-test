-- Vault Story RLS audit
-- Run this in the Supabase SQL editor. It is read-only and does not change data.

-- 1) Confirm row level security is enabled on every app table.
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;

-- 2) Show all public-table policies so each permission can be reviewed.
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 3) Highlight the tables Vault Story currently depends on most.
with expected(table_name) as (
  values
    ('profiles'),
    ('vaults'),
    ('vault_members'),
    ('vault_invites'),
    ('vault_entries'),
    ('entry_assets'),
    ('entry_tags'),
    ('admin_invites'),
    ('entry_unlock_notifications')
)
select
  e.table_name,
  coalesce(c.relrowsecurity, false) as rls_enabled,
  coalesce(c.relforcerowsecurity, false) as force_rls,
  count(p.policyname) as policy_count
from expected e
left join pg_namespace n on n.nspname = 'public'
left join pg_class c on c.relnamespace = n.oid and c.relname = e.table_name and c.relkind = 'r'
left join pg_policies p on p.schemaname = 'public' and p.tablename = e.table_name
group by e.table_name, c.relrowsecurity, c.relforcerowsecurity
order by e.table_name;

-- 4) Confirm media buckets are private unless a bucket is intentionally public.
select
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
from storage.buckets
where id in ('avatars', 'vault-covers', 'entry-assets')
order by id;

-- 5) Review storage policies for uploaded media.
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'storage'
order by tablename, policyname;
