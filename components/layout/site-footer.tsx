import Link from "next/link";

const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/reviews", label: "Reviews" },
      { href: "/faq", label: "FAQ" },
      { href: "/support", label: "Support" },
      { href: "/signup", label: "Start free" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { href: "/#use-cases", label: "Messages for children" },
      { href: "/#use-cases", label: "Family stories" },
      { href: "/#use-cases", label: "Life milestones" },
      { href: "/#use-cases", label: "Family archive" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Create account" },
      { href: "/pricing", label: "Membership options" },
      { href: "/reviews", label: "Stories" },
      { href: "/support", label: "Contact support" },
      { href: "/settings", label: "Settings" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="soft-divider bg-[linear-gradient(180deg,rgba(249,245,239,0.92),rgba(242,236,228,0.96))] py-10 text-sm text-muted-foreground sm:py-16">
      <div className="page-wrap space-y-8 sm:space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.9fr] lg:items-start lg:gap-14">
          <div className="section-stack max-w-xl space-y-3 sm:space-y-4">
            <p className="text-sm font-semibold tracking-[0.18em] text-primary">VAULT STORY</p>
            <h2 className="font-display text-2xl leading-tight text-foreground sm:text-4xl">
              A private place to preserve memories for the right future moment.
            </h2>
            <p className="max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
              Built for secure vaults, intentional delivery, and meaningful family history that can be revisited for years to come.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-8 lg:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title} className={group.title === "Account" ? "col-span-2 space-y-3 sm:col-span-1 sm:space-y-4" : "space-y-3 sm:space-y-4"}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary/82">{group.title}</h3>
                <div className="space-y-2 sm:space-y-3">
                  {group.links.map((link) => (
                    <div key={link.label}>
                      <Link href={link.href} className="text-[0.95rem] leading-7 transition-colors hover:text-foreground">
                        {link.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/60 pt-5 text-xs uppercase tracking-[0.14em] text-muted-foreground/85 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <p>Copyright {year} Vault Story</p>
          <div className="hidden flex-wrap gap-4 sm:flex">
            <Link href="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
            <Link href="/reviews" className="transition-colors hover:text-foreground">Reviews</Link>
            <Link href="/faq" className="transition-colors hover:text-foreground">FAQ</Link>
            <Link href="/support" className="transition-colors hover:text-foreground">Support</Link>
            <Link href="/login" className="transition-colors hover:text-foreground">Log in</Link>
            <Link href="/signup" className="transition-colors hover:text-foreground">Create account</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

