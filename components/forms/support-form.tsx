"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type SupportRequestValues, supportRequestSchema } from "@/lib/validations/support";

const SUPPORT_EMAIL = "support@vaultstory.app";

export function SupportForm() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<SupportRequestValues>({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: SupportRequestValues) {
    setSubmitting(true);

    const response = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    setSubmitting(false);

    if (!response.ok) {
      toast.error(payload.error ?? `We could not send your request. Please email ${SUPPORT_EMAIL} directly.`);
      return;
    }

    form.reset();
    toast.success("Support request sent. We will get back to you as soon as we can.");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="support-name">Name</Label>
          <Input id="support-name" placeholder="Your name" disabled={submitting} aria-invalid={Boolean(form.formState.errors.name)} {...form.register("name")} />
          {form.formState.errors.name ? <p className="text-xs text-destructive">{String(form.formState.errors.name.message)}</p> : null}
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="support-email">Email</Label>
          <Input id="support-email" type="email" placeholder="you@example.com" disabled={submitting} aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />
          {form.formState.errors.email ? <p className="text-xs text-destructive">{String(form.formState.errors.email.message)}</p> : null}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="support-subject">Subject</Label>
        <Input id="support-subject" placeholder="What do you need help with?" disabled={submitting} aria-invalid={Boolean(form.formState.errors.subject)} {...form.register("subject")} />
        {form.formState.errors.subject ? <p className="text-xs text-destructive">{String(form.formState.errors.subject.message)}</p> : <p className="text-xs text-muted-foreground">Examples: invite issue, billing question, login help, missing vault, upload trouble.</p>}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="support-message">Message</Label>
        <Textarea id="support-message" placeholder="Share as much detail as you can, including the vault name, email address used, what happened, and what you expected to see." disabled={submitting} aria-invalid={Boolean(form.formState.errors.message)} {...form.register("message")} />
        {form.formState.errors.message ? <p className="text-xs text-destructive">{String(form.formState.errors.message.message)}</p> : <p className="text-xs text-muted-foreground">The more context you give us, the faster we can help.</p>}
      </div>

      <div className="rounded-[24px] border border-border/70 bg-background/70 p-4 text-sm leading-7 text-muted-foreground">
        Prefer email directly? Reach us at <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-primary underline-offset-4 hover:underline">{SUPPORT_EMAIL}</a>.
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
        {submitting ? "Sending..." : "Send support request"}
        {submitting ? <Send className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </Button>
    </form>
  );
}
