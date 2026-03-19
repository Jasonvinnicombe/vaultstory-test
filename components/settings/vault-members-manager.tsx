import { MailPlus, Users } from "lucide-react";

import { inviteVaultMemberAction, removeVaultMemberAction, updateVaultMemberRoleAction } from "@/app/actions";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MEMBER_ROLES } from "@/lib/constants";

export function VaultMembersManager(props: {
  vaultId: string;
  members: { id: string; role: string; email: string; fullName: string | null }[];
  invites: { id: string; email: string; role: string; status: string }[];
  canInvite: boolean;
  inviteUpgradeMessage?: string | null;
  feedback?: { type: "success" | "error"; message: string } | null;
}) {
  return (
    <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_26px_80px_rgba(66,46,31,0.12)]">
      <CardHeader className="space-y-3 p-7 sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/95 text-primary">
          <Users className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <CardTitle className="font-display text-3xl sm:text-4xl">Family collaboration</CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Invite family members by email and choose whether they should view, edit, or help manage this vault.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-7 pt-0 sm:p-9 sm:pt-0">
        {props.feedback ? (
          <div className={props.feedback.type === "error" ? "rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700" : "rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700"}>
            {props.feedback.message}
          </div>
        ) : null}

        {!props.canInvite && props.inviteUpgradeMessage ? (
          <div className="rounded-[24px] border border-secondary/20 bg-secondary/10 px-5 py-4 text-sm leading-7 text-muted-foreground">
            {props.inviteUpgradeMessage}
          </div>
        ) : null}

        <form action={inviteVaultMemberAction} className="grid gap-4 rounded-[32px] border border-border/70 bg-background/60 p-5 sm:p-6 md:grid-cols-[1fr_190px_auto] md:items-end">
          <input type="hidden" name="vaultId" value={props.vaultId} />
          <label className="space-y-2.5 text-sm">
            <span className="font-medium text-foreground">Email invite</span>
            <input name="email" type="email" placeholder="family@example.com" disabled={!props.canInvite} className="flex h-12 w-full rounded-[20px] border border-border bg-card/90 px-4 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60" />
          </label>
          <label className="space-y-2.5 text-sm">
            <span className="font-medium text-foreground">Role</span>
            <select name="role" disabled={!props.canInvite} className="flex h-12 w-full rounded-[20px] border border-border bg-card/90 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60">
              {MEMBER_ROLES.filter((role) => role.value !== "owner").map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
            </select>
          </label>
          <Button type="submit" className="w-full md:w-auto" disabled={!props.canInvite}>
            <MailPlus className="h-4 w-4" />
            Invite member
          </Button>
        </form>

        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-foreground">Current members</h3>
            <p className="mt-1 text-sm text-muted-foreground">Owners can adjust roles or remove collaborators at any time.</p>
          </div>
          {props.members.length ? props.members.map((member) => (
            <div key={member.id} className="grid gap-4 rounded-[28px] border border-border/70 bg-background/60 p-5 shadow-[0_12px_24px_rgba(66,46,31,0.05)] md:grid-cols-[1fr_210px_auto] md:items-center">
              <div>
                <p className="font-medium text-foreground">{member.fullName || member.email}</p>
                <p className="mt-1 text-sm text-muted-foreground">{member.email}</p>
              </div>
              <form action={updateVaultMemberRoleAction} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input type="hidden" name="vaultId" value={props.vaultId} />
                <input type="hidden" name="memberId" value={member.id} />
                <select name="role" defaultValue={member.role} className="flex h-11 w-full rounded-[18px] border border-border bg-card/90 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10">
                  {MEMBER_ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                </select>
                <Button type="submit" variant="outline">Save</Button>
              </form>
              <form action={removeVaultMemberAction}>
                <input type="hidden" name="vaultId" value={props.vaultId} />
                <input type="hidden" name="memberId" value={member.id} />
                <Button type="submit" variant="ghost" className="w-full md:w-auto">Remove</Button>
              </form>
            </div>
          )) : (
            <EmptyState title="No members yet" body="Invite a partner, sibling, or parent when you are ready to build this vault together." icon={Users} />
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-foreground">Pending invites</h3>
            <p className="mt-1 text-sm text-muted-foreground">These invitations stay ready until the invited person joins.</p>
          </div>
          {props.invites.length ? props.invites.map((invite) => (
            <div key={invite.id} className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-background/60 p-5 shadow-[0_12px_24px_rgba(66,46,31,0.05)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">{invite.email}</p>
                <p className="mt-1 text-sm text-muted-foreground">{invite.role} - {invite.status}</p>
              </div>
              <form action={removeVaultMemberAction}>
                <input type="hidden" name="vaultId" value={props.vaultId} />
                <input type="hidden" name="inviteId" value={invite.id} />
                <Button type="submit" variant="ghost" className="w-full sm:w-auto">Cancel invite</Button>
              </form>
            </div>
          )) : (
            <EmptyState title="No pending invites" body="When you invite someone, their pending access will appear here until they accept and join the vault." icon={MailPlus} />
          )}
        </section>
      </CardContent>
    </Card>
  );
}
