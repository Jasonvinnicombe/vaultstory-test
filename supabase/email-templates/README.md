# Supabase Auth Email Templates

These templates are ready to paste into `Supabase Dashboard -> Authentication -> Email Templates`.

Included files:
- `confirm-signup.html`
- `reset-password.html`
- `magic-link.html`
- `change-email.html`

Recommended subjects:
- Confirm signup: `Confirm your email for Vault Story`
- Reset password: `Reset your Vault Story password`
- Magic link: `Your Vault Story sign-in link`
- Change email: `Confirm your new Vault Story email`

Important placeholders:
- `{{ .ConfirmationURL }}` is provided by Supabase and must stay exactly as-is.

Local testing URL configuration in Supabase:
- Site URL: `http://127.0.0.1:3011`
- Redirect URLs:
  - `http://127.0.0.1:3011`
  - `http://127.0.0.1:3011/login`
  - `http://127.0.0.1:3011/signup`
  - `http://127.0.0.1:3011/reset-password`

Production URL configuration later:
- Site URL: `https://vaultstory.app`
- Redirect URLs:
  - `https://vaultstory.app`
  - `https://vaultstory.app/login`
  - `https://vaultstory.app/signup`
  - `https://vaultstory.app/reset-password`

Official Supabase docs:
- Email templates: https://supabase.com/docs/guides/auth/auth-email-templates
- URL configuration: https://supabase.com/docs/guides/auth/redirect-urls