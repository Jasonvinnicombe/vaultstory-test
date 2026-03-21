"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { canUseMediaKind, canUseMilestoneUnlocks, getMembershipLabel, getMilestoneUnlockUpgradeMessage, getRichMediaUpgradeMessage, normalizeMembershipPlan } from "@/lib/billing";
import { MOODS, RELATIVE_UNITS, UNLOCK_TYPES } from "@/lib/constants";
import { normalizeTags, resolveUnlockAt } from "@/lib/entries";
import { createClient } from "@/lib/supabase/client";
import { getAssetKind, uploadFileToBucket, validateAsset } from "@/lib/uploads";
import { createEntryWorkflowSchema } from "@/lib/validations/entries";

type EntryValues = z.infer<typeof createEntryWorkflowSchema>;

type ExistingAsset = {
  id: string;
  label: string;
};

type EntryCreateFormProps = {
  vaultId: string;
  subjectBirthdate: string | null;
  currentPlan: string;
  entryId?: string;
  startStep?: number;
  initialValues?: Partial<EntryValues>;
  existingAssets?: ExistingAsset[];
  existingEntryType?: string | null;
};

const steps = [
  { label: "Compose", helper: "Write the heart of the memory." },
  { label: "Media", helper: "Add photos, audio, or video." },
  { label: "Unlock", helper: "Choose when it should arrive." },
  { label: "Context", helper: "Capture mood and future hopes." },
] as const;

const darkFieldClass = "border-white/10 bg-white/6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-white/34 focus-visible:ring-amber-200/40";
const darkSelectClass = "border-white/10 bg-white/6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:ring-amber-200/40";
const darkSelectContentClass = "border-white/10 bg-[#241b16]/96 text-white shadow-[0_18px_48px_rgba(20,14,10,0.48)]";
const darkHintClass = "text-xs text-white/46";

function mergeSelectedFiles(existingFiles: File[], nextFiles: File[]) {
  const merged = [...existingFiles];

  for (const file of nextFiles) {
    const alreadyIncluded = merged.some(
      (existing) =>
        existing.name === file.name &&
        existing.size === file.size &&
        existing.lastModified === file.lastModified,
    );

    if (!alreadyIncluded) {
      merged.push(file);
    }
  }

  return merged;
}

function clampStep(step?: number) {
  if (typeof step !== "number" || Number.isNaN(step)) return 0;
  return Math.min(Math.max(step, 0), steps.length - 1);
}

function getStoredUnlockType(unlockType: EntryValues["unlockType"]) {
  return unlockType === "draft" ? "manual_milestone" : unlockType;
}

function getMilestoneLabel(values: EntryValues) {
  if (values.unlockType === "draft") {
    return null;
  }

  if (values.unlockType === "age_milestone") {
    return `Age ${values.ageMilestone}`;
  }

  if (values.unlockType === "manual_milestone") {
    return values.milestoneLabel || null;
  }

  return null;
}

function getSubmitLabel(isEditing: boolean, unlockType: EntryValues["unlockType"], loading: boolean) {
  if (loading) {
    return isEditing ? "Saving entry..." : unlockType === "draft" ? "Saving draft..." : "Saving entry...";
  }

  if (unlockType === "draft") {
    return isEditing ? "Update draft" : "Save draft";
  }

  return isEditing ? "Save and seal entry" : "Create entry";
}

function isMilestoneUnlockType(unlockType: EntryValues["unlockType"]) {
  return unlockType === "age_milestone" || unlockType === "manual_milestone";
}

export function EntryCreateForm({
  vaultId,
  subjectBirthdate,
  currentPlan,
  entryId,
  startStep,
  initialValues,
  existingAssets = [],
  existingEntryType,
}: EntryCreateFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient>>(null);
  const isEditing = Boolean(entryId);
  const [step, setStep] = useState(clampStep(startStep));
  const [loading, setLoading] = useState(false);
  const stepContentRef = useRef<HTMLDivElement | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const form = useForm<EntryValues>({
    resolver: zodResolver(createEntryWorkflowSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      message: initialValues?.message ?? "",
      unlockType: initialValues?.unlockType ?? "date",
      unlockAt: initialValues?.unlockAt ?? "",
      ageMilestone: initialValues?.ageMilestone,
      relativeAmount: initialValues?.relativeAmount,
      relativeUnit: initialValues?.relativeUnit,
      milestoneLabel: initialValues?.milestoneLabel ?? "",
      mood: initialValues?.mood ?? "",
      tags: initialValues?.tags ?? "",
      predictionText: initialValues?.predictionText ?? "",
    },
  });

  const unlockType = form.watch("unlockType");
  const normalizedPlan = normalizeMembershipPlan(currentPlan);
  const allowsRichMedia = canUseMediaKind(currentPlan, "active", "audio");
  const allowsMilestoneUnlocks = canUseMilestoneUnlocks(currentPlan, "active");
  const mediaSummary = useMemo(() => {
    const newFileLabel = mediaFiles.length ? `${mediaFiles.length} new file${mediaFiles.length > 1 ? "s" : ""}` : "No new media uploaded yet";
    if (!existingAssets.length) return newFileLabel;
    return `${existingAssets.length} saved, ${mediaFiles.length} new`;
  }, [existingAssets.length, mediaFiles.length]);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    stepContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const unlockTypeOptions = useMemo(
    () =>
      UNLOCK_TYPES.map((item) => ({
        ...item,
        disabled: !allowsMilestoneUnlocks && (item.value === "age_milestone" || item.value === "manual_milestone"),
        suffix: !allowsMilestoneUnlocks && (item.value === "age_milestone" || item.value === "manual_milestone") ? " (Premium)" : "",
      })),
    [allowsMilestoneUnlocks],
  );

  async function nextStep() {
    if (step === 0) {
      const valid = await form.trigger(["title", "message"]);
      if (!valid) return;
    }

    if (step === 2) {
      const valid = await form.trigger(["unlockType", "unlockAt", "ageMilestone", "relativeAmount", "relativeUnit", "milestoneLabel"]);
      if (!valid) return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function removeMediaFile(fileToRemove: File) {
    setMediaFiles((currentFiles) =>
      currentFiles.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          ),
      ),
    );
  }


  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    const tagName = target.tagName;
    const isTextarea = tagName === "TEXTAREA";
    const isSubmitButton = tagName === "BUTTON" && (target as HTMLButtonElement).type === "submit";

    if (isTextarea || isSubmitButton) {
      return;
    }

    event.preventDefault();
  }
  async function onSubmit(values: EntryValues) {
    if (!supabase) {
      toast.error("Add Supabase env vars to create entries.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please log in again.");
      }

      const { data: latestProfile } = await supabase
        .from("profiles")
        .select("membership_plan,membership_status")
        .eq("id", user.id)
        .maybeSingle();

      if (isMilestoneUnlockType(values.unlockType) && !canUseMilestoneUnlocks(latestProfile?.membership_plan, latestProfile?.membership_status)) {
        throw new Error(getMilestoneUnlockUpgradeMessage());
      }

      for (const file of mediaFiles) {
        const kind = getAssetKind(file);
        if (!canUseMediaKind(latestProfile?.membership_plan, latestProfile?.membership_status, kind)) {
          throw new Error(getRichMediaUpgradeMessage());
        }
      }

      let computedUnlockAt: Date | null = null;
      if (!["manual_milestone", "draft"].includes(values.unlockType)) {
        computedUnlockAt = resolveUnlockAt({
          unlockType: values.unlockType,
          unlockAt: values.unlockAt,
          relativeAmount: values.relativeAmount,
          relativeUnit: values.relativeUnit,
          subjectBirthdate,
          ageMilestone: values.ageMilestone,
        });
      }

      if (values.unlockType === "age_milestone" && !computedUnlockAt) {
        throw new Error("Age milestone unlocks need the vault subject birthdate.");
      }

      const totalAssetCount = existingAssets.length + mediaFiles.length;
      const nextEntryType = mediaFiles.length === 0
        ? existingEntryType ?? "text"
        : totalAssetCount > 1
          ? "bundle"
          : getAssetKind(mediaFiles[0]);

      const payload = {
        vault_id: vaultId,
        user_id: user.id,
        title: values.title,
        content_text: values.message,
        entry_type: nextEntryType,
        mood: values.mood || null,
        unlock_type: getStoredUnlockType(values.unlockType),
        unlock_at: computedUnlockAt ? computedUnlockAt.toISOString() : null,
        milestone_label: getMilestoneLabel(values),
        milestone_achieved_at: null,
        prediction_text: values.predictionText || null,
        reality_text: null,
      };

      let targetEntryId = entryId ?? "";

      if (isEditing && entryId) {
        const { error } = await supabase
          .from("vault_entries")
          .update(payload)
          .eq("id", entryId)
          .eq("user_id", user.id);

        if (error) {
          throw new Error(error.message);
        }

        targetEntryId = entryId;
      } else {
        const { data: entry, error } = await supabase
          .from("vault_entries")
          .insert(payload)
          .select("id")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        targetEntryId = entry.id;
      }

      if (mediaFiles.length) {
        const assets = [] as { entry_id: string; file_url: string; file_type: string }[];

        for (const file of mediaFiles) {
          const kind = getAssetKind(file);
          validateAsset(file, kind);
          const uploaded = await uploadFileToBucket({
            supabase,
            bucket: "entry-assets",
            file,
            path: `${user.id}/${targetEntryId}/${crypto.randomUUID()}-${file.name}`,
          });

          assets.push({
            entry_id: targetEntryId,
            file_url: uploaded.path,
            file_type: kind,
          });
        }

        const { error: assetsError } = await supabase.from("entry_assets").insert(assets);
        if (assetsError) {
          throw new Error(assetsError.message);
        }
      }

      const tags = normalizeTags(values.tags);
      if (isEditing && entryId) {
        const { error: deleteTagError } = await supabase.from("entry_tags").delete().eq("entry_id", entryId);
        if (deleteTagError) {
          throw new Error(deleteTagError.message);
        }
      }

      if (tags.length) {
        const { error: tagError } = await supabase.from("entry_tags").insert(
          tags.map((tag) => ({
            entry_id: targetEntryId,
            tag,
          })),
        );

        if (tagError) {
          throw new Error(tagError.message);
        }
      }

      const successMessage = values.unlockType === "draft"
        ? isEditing
          ? "Draft updated."
          : "Draft saved."
        : isEditing
          ? "Entry sealed."
          : "Entry created.";

      toast.success(successMessage);

      const nextHref = isEditing
        ? `/entries/${targetEntryId}`
        : searchParams.get("onboarding") === "1"
          ? values.unlockType === "draft"
            ? `/entries/${targetEntryId}`
            : "/dashboard?onboarding=done"
          : `/vaults/${vaultId}`;

      router.push(nextHref);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save entry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top,rgba(233,211,182,0.14),transparent_26%),linear-gradient(180deg,rgba(24,19,16,0.98),rgba(60,40,30,0.94))] text-white shadow-[0_32px_90px_rgba(30,21,16,0.3)]">
      <CardHeader className="space-y-6 p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <CardTitle className="font-display text-3xl text-white sm:text-4xl">{isEditing ? "Continue your draft" : "Create an entry"}</CardTitle>
            <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
              {isEditing
                ? "Keep shaping this memory, add more media, and decide when it should be sealed."
                : "Preserve the message, choose the right moment for it to arrive, and give it emotional context for the future."}
            </p>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-white/62 sm:inline-flex sm:items-center sm:gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Step {step + 1} of {steps.length}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white/68">
          You are currently on <strong className="text-amber-100">{getMembershipLabel(normalizedPlan)}</strong>.
          {!allowsRichMedia ? <> Video and voice memories unlock on paid plans.</> : null}
          {!allowsMilestoneUnlocks ? <> Milestone unlocks also unlock on paid plans.</> : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {steps.map((item, index) => (
            <div
              key={item.label}
              className={`rounded-[24px] border px-4 py-3 text-sm transition ${
                index === step
                  ? "border-amber-200/30 bg-[linear-gradient(180deg,rgba(32,46,82,0.98),rgba(28,40,70,0.95))] text-white shadow-[0_22px_36px_rgba(17,24,39,0.34)]"
                  : index < step
                    ? "border-amber-200/18 bg-amber-200/14 text-amber-50"
                    : "border-white/10 bg-white/5 text-white/58"
              }`}
            >
              <p className="font-medium">{index + 1}. {item.label}</p>
              <p className={`mt-1 text-xs leading-5 ${index === step ? "text-white/72" : index < step ? "text-amber-50/72" : "text-white/44"}`}>{item.helper}</p>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-7 pt-0 sm:p-9 sm:pt-0">
        <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown} className="space-y-7" noValidate>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            ref={stepContentRef}
            className="rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            {step === 0 ? (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-white">Compose the memory</h2>
                  <p className="text-sm text-white/64">This can be a letter, a note, a story, or a quiet snapshot of this moment in life.</p>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="title">Title</Label>
                  <Input className={darkFieldClass} id="title" placeholder="For your eighteenth birthday" aria-invalid={Boolean(form.formState.errors.title)} {...form.register("title")} />
                  {form.formState.errors.title ? <p className="text-xs text-amber-200">{form.formState.errors.title.message}</p> : null}
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea className={darkFieldClass} id="message" placeholder="Write the message you want them to feel when this finally opens." aria-invalid={Boolean(form.formState.errors.message)} {...form.register("message")} />
                  {form.formState.errors.message ? <p className="text-xs text-amber-200">{form.formState.errors.message.message}</p> : <p className={darkHintClass}>Long-form notes work well here. You can add media on the next step.</p>}
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-white">Add media</h2>
                  <p className="text-sm text-white/64">Support the memory with a photo, a voice note, or a short film from today.</p>
                </div>
                {!allowsRichMedia ? (
                  <div className="rounded-[24px] border border-amber-200/18 bg-amber-200/10 p-4 text-sm leading-7 text-amber-50/84">
                    Photos are included on Free. {getRichMediaUpgradeMessage()}
                  </div>
                ) : null}
                <div className="space-y-3">
                  <Label htmlFor="media">Upload media</Label>
                  <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[30px] border border-dashed border-white/14 bg-black/14 px-6 text-center text-sm text-white/58 transition hover:bg-black/22">
                    <input
                      id="media"
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/png,image/jpeg,image/webp,audio/mpeg,audio/mp4,audio/wav,audio/webm,video/mp4,video/quicktime,video/webm"
                      onChange={(event) => {
                        const files = Array.from(event.target.files ?? []);
                        if (!files.length) return;
                        try {
                          for (const file of files) {
                            const kind = getAssetKind(file);
                            if (!canUseMediaKind(currentPlan, "active", kind)) {
                              throw new Error(getRichMediaUpgradeMessage());
                            }
                            validateAsset(file, kind);
                          }
                          setMediaFiles((currentFiles) => mergeSelectedFiles(currentFiles, files));
                          event.target.value = "";
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : "Unable to add file.");
                        }
                      }}
                    />
                    <UploadCloud className="mb-3 h-5 w-5 text-amber-200" />
                    <span className="font-medium text-white">{mediaSummary}</span>
                    <span className="mt-2 text-xs">Photos, audio, and video are all supported. Keep it intimate and personal.</span>
                  </label>
                </div>
                {existingAssets.length ? (
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/58">Already attached</p>
                    <div className="grid gap-3">
                      {existingAssets.map((asset) => (
                        <div key={asset.id} className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/62">
                          {asset.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {mediaFiles.length ? (
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/58">Newly selected</p>
                    <div className="grid gap-3">
                      {mediaFiles.map((file) => (
                        <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-black/18 px-4 py-3 text-sm text-white/72 shadow-[0_12px_24px_rgba(20,14,10,0.22)]">
                          <span className="min-w-0 flex-1 truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 shrink-0 rounded-full text-white/58 hover:text-destructive"
                            onClick={() => removeMediaFile(file)}
                            aria-label={`Remove ${file.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {!existingAssets.length && !mediaFiles.length ? (
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-white/62">
                    No media yet. A text-only entry can still feel deeply meaningful.
                  </div>
                ) : null}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-white">Choose the unlock moment</h2>
                  <p className="text-sm text-white/64">Decide whether this should arrive on a date, at an age milestone, after a duration, after a manual milestone, or stay as a draft until you're ready.</p>
                </div>
                {!allowsMilestoneUnlocks ? (
                  <div className="rounded-[24px] border border-amber-200/18 bg-amber-200/10 p-4 text-sm leading-7 text-amber-50/84">
                    Free includes basic date-based scheduling. {getMilestoneUnlockUpgradeMessage()}
                  </div>
                ) : null}
                <div className="space-y-2.5">
                  <Label htmlFor="unlockType">Unlock type</Label>
                  <Select value={unlockType} onValueChange={(value) => form.setValue("unlockType", value as EntryValues["unlockType"], { shouldValidate: true })}>
                    <SelectTrigger className={darkSelectClass} id="unlockType">
                      <SelectValue placeholder="Choose unlock type" />
                    </SelectTrigger>
                    <SelectContent className={darkSelectContentClass}>
                      {unlockTypeOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                          {item.label}{item.suffix}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {unlockType === "draft" ? (
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/66">
                    Save this entry as an unsealed draft. You can come back, keep editing it, add more media, and only choose the unlock moment when it feels complete.
                  </div>
                ) : null}

                {unlockType === "date" ? (
                  <div className="space-y-2.5">
                    <Label htmlFor="unlockAt">Exact date</Label>
                    <Input className={darkFieldClass} id="unlockAt" type="date" aria-invalid={Boolean(form.formState.errors.unlockAt)} {...form.register("unlockAt")} />
                    {form.formState.errors.unlockAt ? <p className="text-xs text-amber-200">{form.formState.errors.unlockAt.message}</p> : null}
                  </div>
                ) : null}

                {unlockType === "age_milestone" ? (
                  <div className="space-y-2.5">
                    <Label htmlFor="ageMilestone">Age milestone</Label>
                    <Input className={darkFieldClass} id="ageMilestone" type="number" min="1" max="120" placeholder="18" aria-invalid={Boolean(form.formState.errors.ageMilestone)} {...form.register("ageMilestone")} />
                    <p className={darkHintClass}>The subject birthdate in this vault will be used to calculate the final unlock date.</p>
                    {form.formState.errors.ageMilestone ? <p className="text-xs text-amber-200">{form.formState.errors.ageMilestone.message}</p> : null}
                  </div>
                ) : null}

                {unlockType === "relative_duration" ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2.5">
                      <Label htmlFor="relativeAmount">Relative amount</Label>
                      <Input className={darkFieldClass} id="relativeAmount" type="number" min="1" max="120" placeholder="5" aria-invalid={Boolean(form.formState.errors.relativeAmount)} {...form.register("relativeAmount")} />
                      {form.formState.errors.relativeAmount ? <p className="text-xs text-amber-200">{form.formState.errors.relativeAmount.message}</p> : null}
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="relativeUnit">Relative unit</Label>
                      <Select onValueChange={(value) => form.setValue("relativeUnit", value as EntryValues["relativeUnit"], { shouldValidate: true })} value={form.watch("relativeUnit") || undefined}>
                        <SelectTrigger className={darkSelectClass} id="relativeUnit">
                          <SelectValue placeholder="Choose unit" />
                        </SelectTrigger>
                        <SelectContent className={darkSelectContentClass}>
                          {RELATIVE_UNITS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : null}

                {unlockType === "manual_milestone" ? (
                  <div className="space-y-2.5">
                    <Label htmlFor="milestoneLabel">Manual milestone</Label>
                    <Input className={darkFieldClass} id="milestoneLabel" placeholder="When we move into our forever home" aria-invalid={Boolean(form.formState.errors.milestoneLabel)} {...form.register("milestoneLabel")} />
                    {form.formState.errors.milestoneLabel ? <p className="text-xs text-amber-200">{form.formState.errors.milestoneLabel.message}</p> : <p className={darkHintClass}>This entry unlocks when someone marks that milestone complete.</p>}
                  </div>
                ) : null}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-white">Add emotional context</h2>
                  <p className="text-sm text-white/64">These details make the reveal feel more human when it opens years later.</p>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="mood">Mood</Label>
                  <Select onValueChange={(value) => form.setValue("mood", value as EntryValues["mood"], { shouldValidate: true })} value={form.watch("mood") || undefined}>
                    <SelectTrigger className={darkSelectClass} id="mood">
                      <SelectValue placeholder="Choose a mood" />
                    </SelectTrigger>
                    <SelectContent className={darkSelectContentClass}>
                      {MOODS.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          {mood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="tags">Tags</Label>
                  <Input className={darkFieldClass} id="tags" placeholder="birthday, future, family" {...form.register("tags")} />
                  <p className={darkHintClass}>Separate tags with commas.</p>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="predictionText">Prediction text</Label>
                  <Textarea className={darkFieldClass} id="predictionText" placeholder="I think by then we will laugh about how small this apartment felt, and how big everything ahead still seemed." {...form.register("predictionText")} />
                  <p className={darkHintClass}>This becomes part of the Past Prediction vs Reality moment after unlock.</p>
                </div>
              </div>
            ) : null}
          </motion.div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="ghost" onClick={previousStep} disabled={step === 0 || loading} className="w-full border border-white/10 bg-white/6 text-white hover:bg-white/10 sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button key="entry-next-step" type="button" onClick={nextStep} disabled={loading} className="w-full bg-amber-200 text-[#1f1713] shadow-[0_18px_32px_rgba(233,211,182,0.2)] hover:bg-amber-100 sm:w-auto">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button key="entry-submit-step" type="submit" disabled={loading} className="w-full bg-[linear-gradient(180deg,rgba(32,46,82,0.98),rgba(28,40,70,0.95))] text-white shadow-[0_18px_36px_rgba(17,24,39,0.32)] hover:brightness-110 sm:w-auto">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {getSubmitLabel(isEditing, unlockType, loading)}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}







