"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, ImagePlus, Loader2, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { uploadFileToBucket, validateAsset } from "@/lib/uploads";
import { userSettingsSchema } from "@/lib/validations/auth";

type UserSettingsValues = z.infer<typeof userSettingsSchema>;

export function UserSettingsForm(props: {
  fullName: string;
  birthday: string | null;
  timezone: string | null;
  avatarUrl: string | null;
  notifications: { emailReminders: boolean; unlockDigest: boolean };
}) {
  const router = useRouter();
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient>>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<UserSettingsValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      fullName: props.fullName,
      birthday: props.birthday ?? "",
      timezone: props.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      emailReminders: props.notifications.emailReminders,
      unlockDigest: props.notifications.unlockDigest,
    },
  });

  const previewUrl = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : null), [avatarFile]);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  async function onSubmit(values: UserSettingsValues) {
    if (!supabase) {
      toast.error("Add your Supabase URL and anon key in .env.local to enable authentication.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in again.");

      let avatarUrl = props.avatarUrl;
      if (avatarFile) {
        validateAsset(avatarFile, "cover");
        const uploaded = await uploadFileToBucket({
          supabase,
          bucket: "avatars",
          file: avatarFile,
          path: `${user.id}/${crypto.randomUUID()}-${avatarFile.name}`,
        });
        avatarUrl = uploaded.path;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.fullName,
          birthday: values.birthday || null,
          timezone: values.timezone,
          avatar_url: avatarUrl,
          notification_preferences: {
            emailReminders: values.emailReminders,
            unlockDigest: values.unlockDigest,
          },
        })
        .eq("id", user.id);

      if (error) throw new Error(error.message);

      toast.success("Settings updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_26px_80px_rgba(66,46,31,0.12)]">
      <CardHeader className="space-y-3 p-7 sm:p-9">
        <CardTitle className="font-display text-3xl sm:text-4xl">Profile settings</CardTitle>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Keep your profile warm and recognizable so shared vaults feel personal the moment someone joins.
        </p>
      </CardHeader>
      <CardContent className="p-7 pt-0 sm:p-9 sm:pt-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
          <section className="grid gap-5 rounded-[32px] border border-border/70 bg-background/60 p-5 sm:p-6 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-secondary/80 text-muted-foreground shadow-[0_16px_36px_rgba(66,46,31,0.10)]">
              {previewUrl ? <img src={previewUrl} alt="Avatar preview" className="h-full w-full object-cover" /> : <UserCircle2 className="h-10 w-10" />}
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="avatar">Avatar</Label>
                <p className="text-sm text-muted-foreground">A profile photo makes collaboration feel more human inside shared family vaults.</p>
              </div>
              <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-[22px] border border-dashed border-border bg-background/78 px-4 text-sm text-muted-foreground transition hover:bg-background/92 sm:justify-start">
                <input
                  id="avatar"
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setAvatarFile(file);
                  }}
                />
                <span className="inline-flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-primary" />
                  {avatarFile ? avatarFile.name : "Upload avatar"}
                </span>
              </label>
            </div>
          </section>

          <section className="space-y-5 rounded-[32px] border border-border/70 bg-background/60 p-5 sm:p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-foreground">Personal details</h2>
              <p className="text-sm text-muted-foreground">These details support age-based unlocks, timestamps, and a more thoughtful experience across the app.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" aria-invalid={Boolean(form.formState.errors.fullName)} {...form.register("fullName")} />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" aria-invalid={Boolean(form.formState.errors.timezone)} {...form.register("timezone")} />
              </div>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="birthday">Birthday</Label>
              <Input id="birthday" type="date" {...form.register("birthday")} />
            </div>
          </section>

          <section className="rounded-[32px] border border-border/70 bg-background/60 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/85 text-primary">
                <BellRing className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-medium text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Choose how you would like future reminders and unlock summaries to reach you.</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <label className="flex items-start gap-3 rounded-[24px] border border-border/70 bg-card/80 p-4 text-sm">
                <Checkbox checked={form.watch("emailReminders")} onCheckedChange={(checked) => form.setValue("emailReminders", Boolean(checked))} />
                <span>
                  <span className="block font-medium text-foreground">Email reminders</span>
                  <span className="mt-1 block leading-6 text-muted-foreground">Receive reminders about upcoming unlocks and milestone prompts.</span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-[24px] border border-border/70 bg-card/80 p-4 text-sm">
                <Checkbox checked={form.watch("unlockDigest")} onCheckedChange={(checked) => form.setValue("unlockDigest", Boolean(checked))} />
                <span>
                  <span className="block font-medium text-foreground">Unlock digest</span>
                  <span className="mt-1 block leading-6 text-muted-foreground">Get a future summary of memories that have just become available.</span>
                </span>
              </label>
            </div>
          </section>

          <div className="flex justify-end border-t border-border/70 pt-1">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Saving..." : "Save settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
