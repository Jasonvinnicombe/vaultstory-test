import { LockKeyhole } from "lucide-react";

type BrandMarkProps = {
  variant?: "modern" | "legacy";
  className?: string;
};

function ModernBrandMark({ className }: { className?: string }) {
  return (
    <span className={`flex min-w-0 items-center gap-3 text-[#243457] ${className ?? ""}`.trim()}>
      <svg
        viewBox="0 0 92 92"
        aria-hidden="true"
        className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M30 17h32l3 10H27l3-10Z" />
        <rect x="10" y="27" width="72" height="56" rx="12" />
        <path d="M20 38h7" />
        <circle cx="46" cy="55" r="18" />
        <path d="M46 46c-5 0-9 4-9 9v3h18v-3c0-5-4-9-9-9Z" />
        <path d="M41.5 46v-3.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5V46" />
      </svg>
      <span className="truncate text-[1.05rem] font-extrabold tracking-[0.08em] text-[#243457] sm:text-[1.15rem]">
        VAULT STORY
      </span>
    </span>
  );
}

function LegacyBrandMark({ className }: { className?: string }) {
  return (
    <span className={`flex min-w-0 items-center gap-3 text-primary ${className ?? ""}`.trim()}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_24px_rgba(61,41,28,0.18)]">
        <LockKeyhole className="h-4 w-4" />
      </span>
      <span className="truncate text-sm font-semibold tracking-[0.16em]">VAULT STORY</span>
    </span>
  );
}

export function BrandMark({ variant = "modern", className }: BrandMarkProps) {
  if (variant === "legacy") {
    return <LegacyBrandMark className={className} />;
  }

  return <ModernBrandMark className={className} />;
}

