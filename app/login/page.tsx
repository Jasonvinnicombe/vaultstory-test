import Link from "next/link";

import { AuthForm } from "@/components/forms/auth-form";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 lg:px-8">
      <div className="grid w-full gap-12 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
        <div>
          <Badge className="mb-6 bg-secondary/80">Login</Badge>
          <h1 className="font-display text-5xl leading-tight text-foreground sm:text-6xl">
            Return to the vaults and moments you are protecting for the future.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Log in to Vault Story and continue building secure time capsules for yourself and your family.
          </p>
          <p className="mt-8 text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
