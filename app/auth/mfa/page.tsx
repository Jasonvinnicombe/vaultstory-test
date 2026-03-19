import Link from "next/link";

import { MfaChallengeForm } from "@/components/forms/mfa-challenge-form";
import { Badge } from "@/components/ui/badge";

export default function MfaPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 lg:px-8">
      <div className="grid w-full gap-12 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
        <div>
          <Badge className="mb-6 bg-secondary/80">Two-factor authentication</Badge>
          <h1 className="font-display text-5xl leading-tight text-foreground sm:text-6xl">
            Confirm it is really you before opening the vault.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Enter the 6-digit code from your authenticator app to finish signing in to Vault Story.
          </p>
          <p className="mt-8 text-sm text-muted-foreground">
            Need to go back?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Return to login
            </Link>
          </p>
        </div>
        <MfaChallengeForm />
      </div>
    </main>
  );
}
