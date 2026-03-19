"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { deleteVaultAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function DeleteVaultButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending} className="w-full sm:w-auto">
      <Trash2 className="h-4 w-4" />
      {pending ? "Deleting vault..." : "Delete vault"}
    </Button>
  );
}

export function DeleteVaultForm({
  vaultId,
  vaultName,
  feedback,
}: {
  vaultId: string;
  vaultName: string;
  feedback?: { type: "success" | "error"; message: string } | null;
}) {
  return (
    <Card className="overflow-hidden border-destructive/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,244,244,0.9))] shadow-[0_26px_80px_rgba(120,36,36,0.08)]">
      <CardHeader className="space-y-3 p-7 sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <CardTitle className="font-display text-3xl sm:text-4xl">Danger zone</CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Deleting this vault removes its entries, pending invites, and timeline from your family archive. This action cannot be undone.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-7 pt-0 sm:p-9 sm:pt-0">
        {feedback ? (
          <div className={feedback.type === "error" ? "rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700" : "rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700"}>
            {feedback.message}
          </div>
        ) : null}
        <form
          action={deleteVaultAction}
          className="flex flex-col gap-5 rounded-[28px] border border-destructive/16 bg-background/75 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          onSubmit={(event) => {
            const confirmed = window.confirm(`Delete \"${vaultName}\" and all of its memories? This cannot be undone.`);
            if (!confirmed) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="vaultId" value={vaultId} />
          <div className="space-y-1">
            <p className="text-base font-medium text-foreground">Delete this vault permanently</p>
            <p className="text-sm leading-6 text-muted-foreground">
              Use this only if you are sure this vault should no longer exist.
            </p>
          </div>
          <DeleteVaultButton />
        </form>
      </CardContent>
    </Card>
  );
}
