# Supabase RLS Security Checklist

Use this checklist with `supabase/rls-audit.sql` before treating the database as hardened. The audit SQL is read-only; paste the output into the review thread so the policies can be checked table by table.

## Expected RLS posture

- `profiles`: users can read and update only their own profile; admin/service-role flows handle broader support access.
- `vaults`: owners can create, update, and delete their own vaults; owners and accepted members can read shared vaults.
- `vault_members`: vault owners can manage members; members can read memberships for vaults they belong to; no public member lists.
- `vault_invites`: vault owners can create, resend, and delete invites for their vaults; invite acceptance should be handled through authenticated/server-side flows.
- `vault_entries`: owners and authorized vault members can read entries; entry creation and editing must be limited to permitted users; no anonymous reads.
- `entry_assets`: asset visibility follows the parent entry/vault permission; insert/delete should be limited to the uploader, vault owner, or trusted server flows.
- `entry_tags`: tag visibility follows the parent entry/vault permission; writes should be limited to permitted entry editors.
- `admin_invites`: admins only, preferably through server-side service-role actions; no ordinary authenticated-user access.
- `entry_unlock_notifications`: service role, admin, or scheduled job only; users should not be able to insert arbitrary notification records.

## Storage expectations

- `avatars`, `vault-covers`, and `entry-assets` should be private unless there is a deliberate public-read decision.
- Downloads should use short-lived signed URLs or a server route that checks the current user first.
- Upload policies should prevent users writing into another user's folder or attaching media to a vault they cannot access.

## Review process

1. Run `supabase/rls-audit.sql` in the Supabase SQL editor.
2. Confirm every app table has `rls_enabled = true`.
3. Confirm every table has policies for the actions the app needs and no broad `true` policies for authenticated users.
4. Confirm private storage buckets and storage object policies match the app's signed-media approach.
5. Apply any missing or over-broad policies as a separate migration after review.
