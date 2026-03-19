import Link from "next/link";
import { CalendarClock, FolderLock, Home, PlusCircle, Settings, ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AppShellProps = {
  children: React.ReactNode;
  fullName?: string | null;
  email: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
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
];

function getInitials(fullName?: string | null, email?: string) {
  const trimmedName = fullName?.trim();
  if (trimmedName) {
    const parts = trimmedName.split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "VS";
  }

  return email?.[0]?.toUpperCase() ?? "VS";
}

export function AppShell({ children, fullName, email, avatarUrl, isAdmin = false }: AppShellProps) {
  const initials = getInitials(fullName, email);
  const navItems = isAdmin
    ? [...baseNavItems, { href: "/admin/users", label: "Admin", icon: ShieldCheck }]
    : baseNavItems;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(220,197,171,0.26),transparent_28%),linear-gradient(180deg,rgba(255,251,247,1),rgba(246,240,232,1))]">
      <div className="page-wrap grid min-h-screen gap-6 py-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-7">
        <aside className="flex flex-col gap-5 lg:sticky lg:top-5 lg:self-start">
          <Card className="glass-panel">
            <CardHeader className="space-y-4">
              <Badge className="w-fit bg-secondary/88">Vault Story</Badge>
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-secondary/82 text-lg font-medium text-primary shadow-[0_14px_34px_rgba(66,46,31,0.14)]">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={`${fullName ?? email} avatar`} className="h-full w-full object-cover" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="font-display text-3xl leading-tight">{fullName ?? "Your vault"}</CardTitle>
                  </div>
                </div>
                <p className="break-all text-sm leading-7 text-muted-foreground">{email}</p>
                {isAdmin ? <Badge className="w-fit bg-primary text-primary-foreground">Admin access</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return <Button key={item.href} asChild variant="ghost" className="h-11 w-full justify-start rounded-[18px] px-4"><Link href={item.href}><Icon className="h-4 w-4" />{item.label}</Link></Button>;
              })}
              <LogoutButton />
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-primary text-primary-foreground shadow-[0_20px_48px_rgba(48,32,23,0.18)]">
            <CardContent className="p-6 sm:p-7">
              <p className="text-sm uppercase tracking-[0.22em] text-primary-foreground/68">Core workflow</p>
              <h2 className="mt-3 text-balance font-display text-2xl">Vaults, entries, and future unlocks.</h2>
              <p className="mt-3 text-sm leading-7 text-primary-foreground/80">Create vaults, collaborate with family, and move through memories in a way that feels warm, private, and intentional.</p>
              <Button asChild variant="secondary" className="mt-5 w-full justify-start"><Link href="/vaults/new"><PlusCircle className="h-4 w-4" />Create a vault</Link></Button>
            </CardContent>
          </Card>
        </aside>
        <div className="space-y-6 sm:space-y-7">{children}</div>
      </div>
    </div>
  );
}
