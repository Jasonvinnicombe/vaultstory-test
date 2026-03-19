import { AppShell } from "@/components/layout/app-shell";
import { VaultCreateForm } from "@/components/forms/vault-create-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMembershipLabel } from "@/lib/billing";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function NewVaultPage() {
  const [{ profile, user, avatarPreviewUrl }, supabase] = await Promise.all([getProfile(), createClient()]);
  const { count: currentVaultCount } = await supabase
    .from("vaults")
    .select("id", { head: true, count: "exact" })
    .eq("owner_user_id", user.id);

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="section-stack">
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="p-8 sm:p-10">
            <Badge className="mb-5 bg-secondary/85">Vault creation</Badge>
            <h1 className="max-w-3xl text-balance font-display text-4xl text-foreground sm:text-5xl">Create a quiet place for memories that deserve a future moment.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Start a private time capsule for yourself, your child, your partner, or your whole family. You can shape the details now and refine them anytime later.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              You are currently on <strong className="text-foreground">{getMembershipLabel(profile?.membership_plan)}</strong> and own <strong className="text-foreground">{currentVaultCount ?? 0}</strong> vault{currentVaultCount === 1 ? "" : "s"}.
            </p>
          </CardContent>
        </Card>
        <VaultCreateForm currentPlan={profile?.membership_plan ?? "free"} currentVaultCount={currentVaultCount ?? 0} />
      </div>
    </AppShell>
  );
}
