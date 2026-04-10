import { LockKeyhole } from "lucide-react";

type BrandMarkProps = {
  variant?: "modern" | "legacy";
  className?: string;
};

function ModernBrandMark({ className }: { className?: string }) {
  return (
    <span className={`flex min-w-0 items-center gap-3 text-[#8F472B] ${className ?? ""}`.trim()}>
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
        <g transform="translate(46 55)">
          <path d="M-5 -2.5v-3a5 5 0 0 1 10 0v3" />
          <rect x="-8" y="-2.5" width="16" height="13" rx="4" />
          <path d="M0 1.5v3.5" />
        </g>
      </svg>
      <span className="truncate text-[1.05rem] font-extrabold tracking-[0.08em] text-[#8F472B] sm:text-[1.15rem]">
        VAULT STORY
      </span>
    </span>
  );
}

function LegacyBrandMark({ className }: { className?: string }) {
  return (
    <span className={`flex min-w-0 items-center gap-3 text-primary ${className ?? ""}`.trim()}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_24px_rgba(143,71,43,0.18)]">
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
