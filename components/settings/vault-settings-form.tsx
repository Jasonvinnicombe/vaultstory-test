"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, PencilLine } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VAULT_TYPES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { uploadFileToBucket, validateAsset } from "@/lib/uploads";
import { createVaultSchema } from "@/lib/validations/vaults";

type VaultValues = z.infer<typeof createVaultSchema>;

export function VaultSettingsForm(props: {
  vaultId: string;
  ownerUserId: string;
  vaultType: string;
  vaultName: string;
  subjectName: string;
  subjectBirthdate: string | null;
  description: string | null;
  coverImageUrl: string | null;
  coverImagePreviewUrl: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<VaultValues>({
    resolver: zodResolver(createVaultSchema),
    defaultValues: {
      vaultType: props.vaultType as VaultValues["vaultType"],
      vaultName: props.vaultName,
      subjectName: props.subjectName,
      subjectBirthdate: props.subjectBirthdate ?? "",
      description: props.description ?? "",
    },
  });

  const previewUrl = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile]);
  const resolvedCoverPreviewUrl = previewUrl ?? props.coverImagePreviewUrl;

  async function onSubmit(values: VaultValues) {
    if (!supabase) return;
    setLoading(true);
    try {
      let coverImageUrl = props.coverImageUrl;
      if (coverFile) {
        validateAsset(coverFile, "cover");
        const uploaded = await uploadFileToBucket({
          supabase,
          bucket: "vault-covers",
          file: coverFile,
          path: `${props.ownerUserId}/${crypto.randomUUID()}-${coverFile.name}`,
        });
        coverImageUrl = uploaded.path;
      }

      const { error } = await supabase
        .from("vaults")
        .update({
          name: values.vaultName,
          vault_type: values.vaultType,
          subject_name: values.subjectName,
          subject_birthdate: values.subjectBirthdate || null,
          description: values.description || null,
          cover_image_url: coverImageUrl,
        })
        .eq("id", props.vaultId);

      if (error) throw new Error(error.message);
      toast.success("Vault updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update vault.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_26px_80px_rgba(66,46,31,0.12)]">
      <CardHeader className="space-y-3 p-7 sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/95 text-primary">
          <PencilLine className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <CardTitle className="font-display text-3xl sm:text-4xl">Vault details</CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Refine the name, subject details, and cover so this vault continues to feel intentional as it grows.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-7 pt-0 sm:p-9 sm:pt-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
          <section className="space-y-5 rounded-[32px] border border-border/70 bg-background/60 p-5 sm:p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-foreground">Cover and framing</h2>
              <p className="text-sm text-muted-foreground">A calm, meaningful image helps the vault feel personal before any entry is opened.</p>
            </div>
            {resolvedCoverPreviewUrl ? (
              <img
                src={resolvedCoverPreviewUrl}
                alt="Vault cover preview"
                className="h-56 w-full rounded-[30px] object-cover shadow-[0_16px_40px_rgba(66,46,31,0.14)]"
              />
            ) : null}
            <div className="space-y-2.5">
              <Label htmlFor="cover">Cover image</Label>
              <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-[22px] border border-dashed border-border bg-background/78 px-4 text-sm text-muted-foreground transition hover:bg-background/92 sm:justify-start">
                <input id="cover" type="file" className="hidden" accept="image/png,image/jpeg,image/webp" onChange={(e) => { const file = e.target.files?.[0]; if (file) setCoverFile(file); }} />
                <span className="inline-flex items-center gap-2"><ImagePlus className="h-4 w-4 text-primary" />{coverFile ? coverFile.name : "Update cover image"}</span>
              </label>
            </div>
          </section>

          <section className="space-y-5 rounded-[32px] border border-border/70 bg-background/60 p-5 sm:p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-foreground">Vault identity</h2>
              <p className="text-sm text-muted-foreground">These details shape how entries are grouped, unlocked, and understood in the future.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="vaultType">Vault type</Label>
                <Select defaultValue={form.getValues("vaultType")} onValueChange={(value) => form.setValue("vaultType", value as VaultValues["vaultType"], { shouldValidate: true })}>
                  <SelectTrigger id="vaultType"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VAULT_TYPES.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="subjectBirthdate">Subject birthdate</Label>
                <Input id="subjectBirthdate" type="date" {...form.register("subjectBirthdate")} />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5"><Label htmlFor="vaultName">Vault name</Label><Input id="vaultName" {...form.register("vaultName")} /></div>
              <div className="space-y-2.5"><Label htmlFor="subjectName">Subject name</Label><Input id="subjectName" {...form.register("subjectName")} /></div>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the kind of moments this vault is meant to hold." {...form.register("description")} />
            </div>
          </section>

          <div className="flex justify-end border-t border-border/70 pt-1">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Saving..." : "Save vault changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}



