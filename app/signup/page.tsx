import Link from "next/link";

import { AuthForm } from "@/components/forms/auth-form";
import { Badge } from "@/components/ui/badge";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 lg:px-8">
      <div className="grid w-full gap-12 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
        <div>
          <Badge className="mb-6 bg-secondary/80">Signup</Badge>
          <h1 className="font-display text-5xl leading-tight text-foreground sm:text-6xl">
            Create a private home for the memories your family should receive later.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Set up your account and start with a secure vault foundation built for letters, photos, videos, and voice notes.
          </p>
          <p className="mt-8 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}