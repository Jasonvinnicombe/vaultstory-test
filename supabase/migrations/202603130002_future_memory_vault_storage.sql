insert into storage.buckets (id, name, public)
values
  ('vault-covers', 'vault-covers', false),
  ('entry-assets', 'entry-assets', false),
  ('avatars', 'avatars', false)
on conflict (id) do nothing;

drop policy if exists "vault covers authenticated upload" on storage.objects;
create policy "vault covers authenticated upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'vault-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "vault covers authenticated read" on storage.objects;
create policy "vault covers authenticated read"
on storage.objects
for select
to authenticated
using (bucket_id = 'vault-covers');

drop policy if exists "vault covers owner update" on storage.objects;
create policy "vault covers owner update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'vault-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'vault-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "entry assets authenticated upload" on storage.objects;
create policy "entry assets authenticated upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'entry-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "entry assets authenticated read" on storage.objects;
create policy "entry assets authenticated read"
on storage.objects
for select
to authenticated
using (bucket_id = 'entry-assets');

drop policy if exists "entry assets owner update" on storage.objects;
create policy "entry assets owner update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'entry-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'entry-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "avatars authenticated upload" on storage.objects;
create policy "avatars authenticated upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "avatars authenticated read" on storage.objects;
create policy "avatars authenticated read"
on storage.objects
for select
to authenticated
using (bucket_id = 'avatars');

drop policy if exists "avatars owner update" on storage.objects;
create policy "avatars owner update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
