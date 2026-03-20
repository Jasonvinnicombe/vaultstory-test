"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CalendarHeart, ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { canCreateAnotherVault, getMembershipLabel, getVaultLimit, getVaultLimitUpgradeMessage, normalizeMembershipPlan } from "@/lib/billing";
import { VAULT_TYPES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { uploadFileToBucket, validateAsset } from "@/lib/uploads";
import { createVaultSchema } from "@/lib/validations/vaults";

type VaultValues = z.infer<typeof createVaultSchema>;

type VaultCreateFormProps = {
  currentPlan: string;
  currentVaultCount: number;
};

export function VaultCreateForm({ currentPlan, currentVaultCount }: VaultCreateFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient>>(null);
  const [loading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const form = useForm<VaultValues>({
    resolver: zodResolver(createVaultSchema),
    defaultValues: {
      vaultType: "self",
      vaultName: "",
      subjectName: "",
      subjectBirthdate: "",
      description: "",
    },
  });

  const previewUrl = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile]);
  const normalizedPlan = normalizeMembershipPlan(currentPlan);
  const vaultLimit = getVaultLimit(currentPlan);
  const hasReachedVaultLimit = !canCreateAnotherVault(currentPlan, "active", currentVaultCount);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  async function onSubmit(values: VaultValues) {
    if (!supabase) {
      toast.error("Add Supabase env vars to create vaults.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in again.");
        return;
      }

      const [{ data: latestProfile }, { count: latestVaultCount, error: vaultCountError }] = await Promise.all([
        supabase.from("profiles").select("membership_plan,membership_status").eq("id", user.id).maybeSingle(),
        supabase.from("vaults").select("id", { head: true, count: "exact" }).eq("owner_user_id", user.id),
      ]);

      if (vaultCountError) {
        throw new Error(vaultCountError.message);
      }

      if (!canCreateAnotherVault(latestProfile?.membership_plan, latestProfile?.membership_status, latestVaultCount ?? 0)) {
        throw new Error(getVaultLimitUpgradeMessage(latestProfile?.membership_plan, latestProfile?.membership_status));
      }

      let coverImageUrl: string | null = null;

      if (coverFile) {
        validateAsset(coverFile, "cover");
        const uploaded = await uploadFileToBucket({
          supabase,
          bucket: "vault-covers",
          file: coverFile,
          path: `${user.id}/${crypto.randomUUID()}-${coverFile.name}`,
        });
        coverImageUrl = uploaded.path;
      }

      const { data: vault, error } = await supabase
        .from("vaults")
        .insert({
          owner_user_id: user.id,
          name: values.vaultName,
          vault_type: values.vaultType,
          subject_name: values.subjectName,
          subject_birthdate: values.subjectBirthdate || null,
          description: values.description || null,
          cover_image_url: coverImageUrl,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      await supabase.from("vault_members").insert({
        vault_id: vault.id,
        user_id: user.id,
        role: "owner",
      });

      toast.success("Vault created.");
      const nextHref = searchParams.get("onboarding") === "1" ? `/vaults/${vault.id}/entries/new?onboarding=1` : `/vaults/${vault.id}`;
      router.push(nextHref);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create vault.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_26px_80px_rgba(66,46,31,0.12)]">
      <CardHeader className="space-y-5 p-7 sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/95 text-primary">
          <CalendarHeart className="h-5 w-5" />
        </div>
        <div className="space-y-3">
          <CardTitle className="font-display text-3xl sm:text-4xl">Create a vault</CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Define who this vault is for, how it should feel, and the kind of future memories it will hold.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-7 pt-0 sm:p-9 sm:pt-0">
        {Number.isFinite(vaultLimit) ? (
          <div className={`mb-7 rounded-[30px] border px-5 py-4 shadow-sm ${hasReachedVaultLimit ? "border-amber-300 bg-amber-50 text-amber-950 shadow-[0_16px_40px_rgba(230,184,106,0.18)]" : "border-border/70 bg-background/75 text-foreground"}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${hasReachedVaultLimit ? "bg-amber-200 text-amber-900" : "bg-secondary/70 text-primary"}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/80">
                    {hasReachedVaultLimit ? "Vault limit reached" : `${getMembershipLabel(normalizedPlan)} plan allowance`}
                  </p>
                  <p className="text-sm leading-7 sm:text-[15px]">
                    <strong className="text-foreground">{getMembershipLabel(normalizedPlan)}</strong> currently includes <strong className="text-foreground">{vaultLimit}</strong> vault{vaultLimit === 1 ? "" : "s"}.
                    {hasReachedVaultLimit
                      ? " Upgrade to Premium to create another vault."
                      : ` You have ${Math.max(vaultLimit - currentVaultCount, 0)} slot${vaultLimit - currentVaultCount === 1 ? "" : "s"} left before you hit that limit.`}
                  </p>
                </div>
              </div>
              {hasReachedVaultLimit ? (
                <div className="md:shrink-0 md:pl-4">
                  <Button asChild className="h-11 w-full whitespace-nowrap px-5 md:w-auto">
                    <Link href="/pricing">Upgrade to Premium</Link>
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <section className="space-y-5 rounded-[32px] border border-border/70 bg-background/60 p-5 sm:p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-foreground">Vault identity</h2>
              <p className="text-sm text-muted-foreground">Choose the relationship and language that will shape the memories inside.</p>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="vaultType">Vault type</Label>
              <Select defaultValue={form.getValues("vaultType")} onValueChange={(value) => form.setValue("vaultType", value as VaultValues["vaultType"], { shouldValidate: true })}>
                <SelectTrigger id="vaultType">
                  <SelectValue placeholder="Choose a vault type" />
                </SelectTrigger>
                <SelectContent>
                  {VAULT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.vaultType ? <p className="text-xs text-destructive">{form.formState.errors.vaultType.message}</p> : <p className="text-xs text-muted-foreground">Self, child, partner, or family. You can invite others later.</p>}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="vaultName">Vault name</Label>
                <Input id="vaultName" placeholder="Letters for Mia" aria-invalid={Boolean(form.formState.errors.vaultName)} {...form.register("vaultName")} />
                {form.formState.errors.vaultName ? <p className="text-xs text-destructive">{form.formState.errors.vaultName.message}</p> : null}
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="subjectName">Subject name</Label>
                <Input id="subjectName" placeholder="Mia" aria-invalid={Boolean(form.formState.errors.subjectName)} {...form.register("subjectName")} />
                {form.formState.errors.subjectName ? <p className="text-xs text-destructive">{form.formState.errors.subjectName.message}</p> : null}
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="subjectBirthdate">Subject birthdate</Label>
              <Input id="subjectBirthdate" type="date" {...form.register("subjectBirthdate")} />
              <p className="text-xs text-muted-foreground">Helpful for age-based unlocks later on.</p>
            </div>
          </section>

          <section className="space-y-5 rounded-[32px] border border-border/70 bg-background/60 p-5 sm:p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-foreground">Presentation</h2>
              <p className="text-sm text-muted-foreground">A cover image and a short description give this vault warmth from the start.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-2.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="A quiet collection of birthday letters, short videos, and everyday moments to revisit years from now." aria-invalid={Boolean(form.formState.errors.description)} {...form.register("description")} />
                {form.formState.errors.description ? <p className="text-xs text-destructive">{form.formState.errors.description.message}</p> : <p className="text-xs text-muted-foreground">Optional, but helpful when this vault grows over time.</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="coverImage">Cover image</Label>
                <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[30px] border border-dashed border-border bg-background/78 px-5 text-center text-sm text-muted-foreground transition hover:bg-background/92">
                  <input
                    id="coverImage"
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      try {
                        validateAsset(file, "cover");
                        setCoverFile(file);
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Invalid cover image.");
                      }
                    }}
                  />
                  <ImagePlus className="mb-3 h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{coverFile ? coverFile.name : "Choose cover image"}</span>
                  <span className="mt-2 text-xs">JPEG, PNG, or WebP. A portrait or quiet family photo works beautifully here.</span>
                </label>
              </div>
            </div>

            {previewUrl ? <img src={previewUrl} alt="Cover preview" className="h-52 w-full rounded-[30px] object-cover shadow-[0_16px_40px_rgba(66,46,31,0.14)]" /> : null}
          </section>

          <div className="flex flex-col gap-3 border-t border-border/70 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              You can refine the cover, description, and collaborators later in vault settings.
            </p>
            <Button type="submit" disabled={loading || hasReachedVaultLimit} className="w-full sm:w-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {loading ? "Creating vault..." : "Create vault"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
