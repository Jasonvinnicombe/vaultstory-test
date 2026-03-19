import Link from "next/link";
import { LockKeyhole, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header id="top" className="sticky top-0 z-40 border-b border-white/35 bg-background/75 backdrop-blur-xl">
      <div className="page-wrap flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.16em] text-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_24px_rgba(61,41,28,0.18)]">
            <LockKeyhole className="h-4 w-4" />
          </span>
          VAULT STORY
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
          <Link href="/#how-it-works" className="transition-colors hover:text-foreground">How it works</Link>
          <Link href="/#features" className="transition-colors hover:text-foreground">Features</Link>
          <Link href="/#use-cases" className="transition-colors hover:text-foreground">Use cases</Link>
          <Link href="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
          <Link href="/reviews" className="transition-colors hover:text-foreground">Reviews</Link>
          <Link href="/#faq" className="transition-colors hover:text-foreground">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link href="/login">Log in</Link></Button>
          <Button asChild size="sm" className="sm:h-11 sm:px-5"><Link href="/signup"><Sparkles className="h-4 w-4" />Start your vault</Link></Button>
        </div>
      </div>
    </header>
  );
}
