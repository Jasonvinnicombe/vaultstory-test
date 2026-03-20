import Link from "next/link";
import { LockKeyhole, Menu, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const marketingLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#use-cases", label: "Use cases" },
  { href: "/pricing", label: "Pricing" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header id="top" className="sticky top-0 z-40 border-b border-white/35 bg-background/75 backdrop-blur-xl">
      <div className="page-wrap flex items-center justify-between gap-3 py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-sm font-semibold tracking-[0.16em] text-primary">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_24px_rgba(61,41,28,0.18)]">
            <LockKeyhole className="h-4 w-4" />
          </span>
          <span className="truncate">VAULT STORY</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
          {marketingLinks.map((link) => (
            link.href.startsWith("/#") ? (
              <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">{link.label}</a>
            ) : (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">{link.label}</Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[92vw] rounded-[32px] border-white/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(243,236,227,0.94))] p-6 sm:max-w-md">
              <DialogHeader className="space-y-3 text-left">
                <DialogTitle>Navigate Vault Story</DialogTitle>
                <DialogDescription>
                  Explore how it works, read reviews, check pricing, or jump straight into your vault.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 grid gap-2">
                {marketingLinks.map((link) => (
                  link.href.startsWith("/#") ? (
                    <a
                      key={link.href}
                      href={link.href}
                      className="rounded-[22px] border border-white/80 bg-white/70 px-4 py-3 text-sm font-medium text-foreground shadow-[0_10px_26px_rgba(30,42,68,0.04)] transition hover:bg-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-[22px] border border-white/80 bg-white/70 px-4 py-3 text-sm font-medium text-foreground shadow-[0_10px_26px_rgba(30,42,68,0.04)] transition hover:bg-white"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Button asChild variant="ghost" className="justify-center sm:justify-center">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">
                    <Sparkles className="h-4 w-4" />
                    Start your vault
                  </Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link href="/login">Log in</Link></Button>
          <Button asChild size="sm" className="hidden sm:inline-flex sm:h-11 sm:px-5"><Link href="/signup"><Sparkles className="h-4 w-4" />Start your vault</Link></Button>
        </div>
      </div>
    </header>
  );
}
