# Vault Story

Vault Story is a private family time capsule MVP built with Next.js, TypeScript, Tailwind, shadcn/ui, Supabase, React Hook Form, Zod, and Framer Motion.

## What It Does

- Private vaults for self, child, partner, or family
- Email/password auth with protected routes
- Multi-step memory entry creation
- Future unlocks by date, age milestone, relative duration, or manual milestone
- Cinematic unlock reveal flow for unlocked entries
- Prediction versus reality reflections
- Family collaboration with owner, editor, and viewer roles
- User and vault settings

## Setup

1. Install dependencies.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project.
4. Run the SQL migrations in order.
5. Create the required storage buckets and policies from the included migration files.
6. Start the Next.js app locally.

Example env file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Vault Story <hello@vaultstory.app>
```

## Environment Variables

- `NEXT_PUBLIC_APP_URL`: public app URL for local or production use
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public anon key for browser and SSR auth
- `SUPABASE_SERVICE_ROLE_KEY`: server-only key used for invite lookup and admin tasks
- `RESEND_API_KEY`: API key for sending vault invitation emails
- `RESEND_FROM_EMAIL`: verified sender used for invitation emails

## Supabase Setup

### Auth

Enable email/password authentication in Supabase Auth.

### Database

Run these migrations:

- `supabase/migrations/20260313_future_memory_vault_foundation.sql`
- `supabase/migrations/20260313_future_memory_vault_storage.sql`
- `supabase/migrations/20260313_future_memory_vault_collaboration.sql`r`n- `supabase/migrations/20260315_future_memory_vault_unlock_notifications.sql`r`n- `supabase/migrations/20260316_future_memory_vault_billing.sql`

These migrations create:

- `profiles`
- `vaults`
- `vault_members`
- `vault_invites`
- `vault_entries`
- `entry_assets`
- `entry_tags`

They also add:

- row-level security policies
- profile auto-creation trigger
- collaboration role helpers
- storage buckets and storage policies

### Storage

Buckets created by migrations:

- `vault-covers`
- `entry-assets`
- `avatars`

Uploads are private. The app generates signed URLs on the server for reveal and detail pages.

## Running Locally

If your full Next.js project files are present, run the usual commands for your package manager.

Typical flow:

```bash
npm install
npm run dev
```


## Invitation Emails

Family invites are stored in `vault_invites` and can also send a real email when Resend is configured.

1. Create a Resend account.
2. Verify the sending domain or sender address you want to use.
3. Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to `.env.local`.
4. Restart the app.

When configured, vault owners can invite by email from vault settings and the recipient will receive login and signup links with their email prefilled.


## Stripe Billing

Stripe now powers Premium checkout and billing management.

1. Create a recurring monthly Price in Stripe for Premium.
2. Add these environment variables to `.env.local` and your deployment target:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PREMIUM_PRICE_ID`
3. In Stripe, add a webhook endpoint pointing to:
   - `/api/stripe/webhooks`
4. Subscribe the webhook to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Run the billing migration:
   - `supabase/migrations/20260316_future_memory_vault_billing.sql`

What the integration does:
- Premium checkout from pricing/settings
- Billing portal access for current Premium members
- Profile sync of membership plan, status, customer id, subscription id, and renewal period

Recommended local webhook testing:
```bash
stripe listen --forward-to http://127.0.0.1:3011/api/stripe/webhooks
```
## Unlock Notification Emails

Unlocked memories can also trigger a one-time email to current vault members when the memory becomes ready to open.

1. Add `UNLOCK_NOTIFICATIONS_CRON_SECRET` to `.env.local` and your production environment.
2. Run the `supabase/migrations/20260315_future_memory_vault_unlock_notifications.sql` migration.
3. Call `GET /api/notifications/unlocks` on a schedule with one of these:
   - `Authorization: Bearer <UNLOCK_NOTIFICATIONS_CRON_SECRET>`
   - `x-cron-secret: <UNLOCK_NOTIFICATIONS_CRON_SECRET>`
4. For Vercel, add a cron job that hits `/api/notifications/unlocks`.

The endpoint sends one email per unlocked entry per recipient, records that delivery in `entry_unlock_notifications`, and skips people who turned off `unlockDigest` in their notification preferences.

## Supabase Auth Email Templates

Supabase confirmation, reset-password, magic-link, and change-email emails can be branded to match Vault Story.

Ready-to-paste HTML templates live in:
- `supabase/email-templates/confirm-signup.html`
- `supabase/email-templates/reset-password.html`
- `supabase/email-templates/magic-link.html`
- `supabase/email-templates/change-email.html`
- `supabase/email-templates/README.md`

Set them in:
- `Supabase Dashboard -> Authentication -> Email Templates`

For local testing, make sure Supabase Auth URL Configuration includes:
- `http://127.0.0.1:3011`
- `http://127.0.0.1:3011/login`
- `http://127.0.0.1:3011/signup`
- `http://127.0.0.1:3011/reset-password`
## Deployment To Vercel

1. Push the repo to GitHub.
2. Import the project into Vercel.
3. Add the six environment variables from `.env.example`.
4. Make sure Supabase Auth has the correct site URL and redirect URLs for your Vercel domain.
5. Deploy.

## Onboarding Flow

- After signup, the user is routed toward login with onboarding intent preserved.
- After first login, the user is guided to create their first vault.
- After first vault creation, the user is guided to create their first memory entry.
- The dashboard keeps onboarding prompts visible until the first vault and first entry exist.

## Architecture Summary

### App Router

- Public marketing routes live in `app/page.tsx`, `app/login`, and `app/signup`.
- Protected product routes live in `app/dashboard`, `app/vaults`, `app/entries`, and `app/settings`.

### Data Model

- `profiles` stores account metadata and notification preferences.
- `vaults` is the core family time capsule container.
- `vault_members` and `vault_invites` power collaboration and invitation delivery.
- `vault_entries`, `entry_assets`, and `entry_tags` power the memory timeline and reveal flow.

### Auth And Security

- Supabase SSR handles auth state across server and client.
- Middleware protects authenticated routes.
- Row-level security restricts profile, vault, entry, and invite access.
- Storage uses private buckets with signed URL reads.

### UX Layers

- Dashboard summarizes vaults, entries, locked/unlocked counts, and onboarding.
- Vault pages render a timeline view of memories.
- Entry pages switch between locked and cinematic unlocked views.
- Settings pages cover account, vault metadata, and family collaboration.

## Final File Tree

```text
app/
  actions.ts
  dashboard/page.tsx
  entries/[id]/page.tsx
  login/page.tsx
  settings/page.tsx
  signup/page.tsx
  vaults/new/page.tsx
  vaults/[id]/page.tsx
  vaults/[id]/entries/new/page.tsx
  vaults/[id]/settings/page.tsx
components/
  auth/logout-button.tsx
  entries/
    countdown-timer.tsx
    entry-card.tsx
    entry-status-badge.tsx
    locked-entry-view.tsx
    milestone-complete-form.tsx
    reflection-form.tsx
    reveal-experience.tsx
  forms/
    auth-form.tsx
    entry-create-form.tsx
    vault-create-form.tsx
  layout/
    app-shell.tsx
    site-footer.tsx
    site-header.tsx
  settings/
    user-settings-form.tsx
    vault-members-manager.tsx
    vault-settings-form.tsx
  vaults/
    vault-card.tsx
lib/
  auth.ts
  constants.ts
  date.ts
  entries.ts
  uploads.ts
  validations/
    auth.ts
    entries.ts
    vaults.ts
supabase/migrations/
  20260313_future_memory_vault_foundation.sql
  20260313_future_memory_vault_storage.sql
  20260313_future_memory_vault_collaboration.sql
types/
  database.ts
middleware.ts
.env.example
README.md
```

## Notes

This workspace snapshot does not currently include a top-level `package.json` or `tsconfig.json`, so local build verification depends on restoring the full project manifest files.
