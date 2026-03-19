import Link from "next/link";

import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { Badge } from "@/components/ui/badge";

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 lg:px-8">
      <div className="grid w-full gap-12 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
        <div>
          <Badge className="mb-6 bg-secondary/80">Password reset</Badge>
          <h1 className="font-display text-5xl leading-tight text-foreground sm:text-6xl">
            Choose a new password and step back into your vault.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Use a strong new password, save it somewhere safe, and then continue back into Vault Story.
          </p>
          <p className="mt-8 text-sm text-muted-foreground">
            Remembered it after all?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Return to login
            </Link>
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </main>
  );
}
