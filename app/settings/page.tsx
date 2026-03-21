import { AppShell } from "@/components/layout/app-shell";
import { MembershipOptions } from "@/components/settings/membership-options";
import { MfaSettings } from "@/components/settings/mfa-settings";
import { UserSettingsForm } from "@/components/settings/user-settings-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMembershipLabel } from "@/lib/billing";
import { getProfile } from "@/lib/auth";
import { env } from "@/lib/env";

type SettingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettingsPage(props: SettingsPageProps) {
  const { profile, user, avatarPreviewUrl } = await getProfile();
  const searchParams = props.searchParams ? await props.searchParams : {};
  const preferences = (profile?.notification_preferences as { emailReminders?: boolean; unlockDigest?: boolean } | null) ?? {};
  const billingError = typeof searchParams.billingError === "string" ? searchParams.billingError : null;
  const billingSuccess = typeof searchParams.billingSuccess === "string" ? searchParams.billingSuccess : null;
  const currentPlan = getMembershipLabel(profile?.membership_plan ?? "free");
  const currentStatus = profile?.membership_status ?? "active";
  const familyCheckoutEnabled = Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_FAMILY_PRICE_ID);

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="section-stack">
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="p-8 sm:p-10">
            <Badge className="mb-5 bg-secondary/85">Settings</Badge>
            <h1 className="max-w-3xl text-balance font-display text-4xl text-foreground sm:text-5xl">Shape how Vault Story feels for you.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Update your profile, avatar, birthday, timezone, and launch-ready notification preferences from one calm, private place.
            </p>
          </CardContent>
        </Card>
        <UserSettingsForm
          fullName={profile?.full_name ?? user.user_metadata.full_name ?? ""}
          birthday={profile?.birthday ?? null}
          timezone={profile?.timezone ?? null}
          avatarUrl={profile?.avatar_url ?? null}
          notifications={{
            emailReminders: preferences.emailReminders ?? true,
            unlockDigest: preferences.unlockDigest ?? true,
          }}
        />
        <MfaSettings />
        <MembershipOptions currentPlan={currentPlan} currentStatus={currentStatus} billingError={billingError} billingSuccess={billingSuccess} billingPlan={typeof searchParams.billingPlan === "string" ? searchParams.billingPlan : null} familyCheckoutEnabled={familyCheckoutEnabled} />
      </div>
    </AppShell>
  );
}
