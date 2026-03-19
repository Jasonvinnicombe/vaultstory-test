create table if not exists public.entry_unlock_notifications (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.vault_entries(id) on delete cascade,
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  recipient_email text not null,
  sent_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  unique (entry_id, recipient_user_id)
);

alter table public.entry_unlock_notifications enable row level security;

drop policy if exists "entry unlock notifications select own" on public.entry_unlock_notifications;
create policy "entry unlock notifications select own"
on public.entry_unlock_notifications
for select
to authenticated
using (recipient_user_id = auth.uid());
