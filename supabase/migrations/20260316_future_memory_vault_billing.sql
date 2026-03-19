alter table public.profiles
  add column if not exists membership_plan text not null default 'free',
  add column if not exists membership_status text not null default 'active',
  add column if not exists stripe_customer_id text unique,
  add column if not exists stripe_subscription_id text unique,
  add column if not exists stripe_price_id text,
  add column if not exists stripe_current_period_end timestamptz;

create index if not exists profiles_stripe_customer_id_idx on public.profiles (stripe_customer_id);
create index if not exists profiles_stripe_subscription_id_idx on public.profiles (stripe_subscription_id);

alter table public.profiles
  drop constraint if exists profiles_membership_plan_check;

alter table public.profiles
  add constraint profiles_membership_plan_check
  check (membership_plan in ('free', 'premium'));

alter table public.profiles
  drop constraint if exists profiles_membership_status_check;

alter table public.profiles
  add constraint profiles_membership_status_check
  check (membership_status in ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'inactive'));