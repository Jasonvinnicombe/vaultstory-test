import Link from "next/link";
import { BookOpenText, CalendarClock, FolderLock, Home, Menu, PlusCircle, Settings, ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type AppShellProps = {
  children: React.ReactNode;
  fullName?: string | null;
  email: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
  variant?: "default" | "reveal";
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const baseNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/vaults/new", label: "New vault", icon: PlusCircle },
  { href: "/dashboard#vaults", label: "Vaults", icon: FolderLock },
  { href: "/dashboard#upcoming", label: "Upcoming", icon: CalendarClock },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/how-to", label: "How to", icon: BookOpenText },
];

function getInitials(fullName?: string | null, email?: string) {
  const trimmedName = fullName?.trim();
  if (trimmedName) {
    const parts = trimmedName.split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "VS";
  }

  return email?.[0]?.toUpperCase() ?? "VS";
}

function ProfileAvatar({ avatarUrl, fullName, email, initials, sizeClass = "h-16 w-16", textClass = "text-lg" }: {
  avatarUrl?: string | null;
  fullName?: string | null;
  email: string;
  initials: string;
  sizeClass?: string;
  textClass?: string;
}) {
  return (
    <div className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-secondary/82 ${textClass} font-medium text-primary shadow-[0_14px_34px_rgba(66,46,31,0.14)]`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={`${fullName ?? email} avatar`} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

function SidebarContent({
  fullName,
  email,
  avatarUrl,
  isAdmin,
  initials,
  navItems,
  variant,
}: {
  fullName?: string | null;
  email: string;
  avatarUrl?: string | null;
  isAdmin: boolean;
  initials: string;
  navItems: NavItem[];
  variant: "default" | "reveal";
}) {
  const isReveal = variant === "reveal";

  return (
    <>
      <CardHeader className="space-y-4">
        <Badge className={isReveal ? "w-fit border border-amber-200/20 bg-amber-200/14 text-amber-100" : "w-fit bg-secondary/88"}>Vault Story</Badge>
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <ProfileAvatar avatarUrl={avatarUrl} fullName={fullName} email={email} initials={initials} />
            <div className="min-w-0 flex-1">
              <CardTitle className={isReveal ? "font-display text-3xl leading-tight text-white" : "font-display text-3xl leading-tight"}>{fullName ?? "Your vault"}</CardTitle>
            </div>
          </div>
          <p className={isReveal ? "break-all text-sm leading-7 text-white/64" : "break-all text-sm leading-7 text-muted-foreground"}>{email}</p>
          {isAdmin ? <Badge className="w-fit bg-primary text-primary-foreground">Admin access</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button key={item.href} asChild variant="ghost" className={isReveal ? "h-11 w-full justify-start rounded-[18px] px-4 text-white hover:bg-white/10" : "h-11 w-full justify-start rounded-[18px] px-4"}>
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
        <LogoutButton />
      </CardContent>
    </>
  );
}

export function AppShell({ children, fullName, email, avatarUrl, isAdmin = false, variant = "default" }: AppShellProps) {
  const initials = getInitials(fullName, email);
  const isReveal = variant === "reveal";
  const navItems = isAdmin
    ? [...baseNavItems, { href: "/admin/users", label: "Admin", icon: ShieldCheck }]
    : baseNavItems;

  return (
    <div className={isReveal ? "min-h-screen bg-[radial-gradient(circle_at_top,rgba(233,211,182,0.12),transparent_20%),linear-gradient(180deg,rgba(23,18,15,1),rgba(46,33,27,1))]" : "min-h-screen bg-[radial-gradient(circle_at_top,rgba(220,197,171,0.26),transparent_28%),linear-gradient(180deg,rgba(255,251,247,1),rgba(246,240,232,1))]"}>
      <div className="page-wrap grid min-h-screen gap-6 py-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-7">
        <div className="lg:hidden">
          <Card className={isReveal ? "overflow-hidden border-white/10 bg-white/5 text-white shadow-[0_22px_60px_rgba(20,14,10,0.24)]" : "glass-panel"}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <ProfileAvatar
                  avatarUrl={avatarUrl}
                  fullName={fullName}
                  email={email}
                  initials={initials}
                  sizeClass="h-12 w-12"
                  textClass="text-sm"
                />
                <div className="min-w-0">
                  <p className={isReveal ? "truncate font-display text-xl leading-tight text-white" : "truncate font-display text-xl leading-tight text-foreground"}>{fullName ?? "Your vault"}</p>
                  <p className={isReveal ? "truncate text-sm text-white/64" : "truncate text-sm text-muted-foreground"}>{email}</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Open navigation menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[88vh] max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-[32px] p-0 sm:max-w-lg">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Vault navigation</DialogTitle>
                    <DialogDescription>Open navigation, account links, and actions.</DialogDescription>
                  </DialogHeader>
                  <Card className="border-0 shadow-none">
                    <SidebarContent
                      fullName={fullName}
                      email={email}
                      avatarUrl={avatarUrl}
                      isAdmin={isAdmin}
                      initials={initials}
                      navItems={navItems}
                      variant={variant}
                    />
                  </Card>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <aside className="hidden flex-col gap-5 lg:sticky lg:top-5 lg:flex lg:self-start">
          <Card className={isReveal ? "overflow-hidden border-white/10 bg-white/5 text-white shadow-[0_22px_60px_rgba(20,14,10,0.24)]" : "glass-panel"}>
            <SidebarContent
              fullName={fullName}
              email={email}
              avatarUrl={avatarUrl}
              isAdmin={isAdmin}
              initials={initials}
              navItems={navItems}
              variant={variant}
            />
          </Card>

          <Card className={isReveal ? "overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(29,43,74,0.98),rgba(22,33,60,0.95))] text-white shadow-[0_24px_60px_rgba(17,24,39,0.28)]" : "overflow-hidden bg-primary text-primary-foreground shadow-[0_20px_48px_rgba(48,32,23,0.18)]"}>
            <CardContent className="p-6 sm:p-7">
              <p className={isReveal ? "text-sm uppercase tracking-[0.22em] text-white/62" : "text-sm uppercase tracking-[0.22em] text-primary-foreground/68"}>Core workflow</p>
              <h2 className="mt-3 text-balance font-display text-2xl">Vaults, entries, and future unlocks.</h2>
              <p className={isReveal ? "mt-3 text-sm leading-7 text-white/78" : "mt-3 text-sm leading-7 text-primary-foreground/80"}>Create vaults, collaborate with family, and move through memories in a way that feels warm, private, and intentional.</p>
              <div className="mt-5 grid gap-3">
                <Button asChild variant="secondary" className={isReveal ? "w-full justify-start bg-amber-200 text-[#1f1713] hover:bg-amber-100" : "w-full justify-start"}>
                  <Link href="/vaults/new">
                    <PlusCircle className="h-4 w-4" />
                    Create a vault
                  </Link>
                </Button>
                <Button asChild variant="outline" className={isReveal ? "w-full justify-start border-white/10 bg-white/8 text-white hover:bg-white/12" : "w-full justify-start border-white/20 bg-transparent text-white hover:bg-white/10"}>
                  <Link href="/how-to">
                    <BookOpenText className="h-4 w-4" />
                    Open how-to guide
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
        <div className="space-y-6 sm:space-y-7">{children}</div>
      </div>
    </div>
  );
}