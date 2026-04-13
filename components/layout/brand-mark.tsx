import { LockKeyhole } from "lucide-react";

type BrandMarkProps = {
  variant?: "modern" | "legacy";
  className?: string;
};

function ModernBrandMark({ className }: { className?: string }) {
  return (
    <span className={`flex min-w-0 items-center gap-3 text-[#8F472B] ${className ?? ""}`.trim()}>
      <svg
        viewBox="0 0 128 128"
        aria-hidden="true"
        className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
        fill="none"
      >
        <rect width="128" height="128" rx="26" fill="#8F472B" />
        <rect x="2.5" y="2.5" width="123" height="123" rx="23.5" stroke="#F6EEE5" strokeWidth="5" />
        <g stroke="#F6EEE5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M37 44h54a12 12 0 0 1 12 12v35" />
          <path d="M25 99V56a12 12 0 0 1 12-12" />
          <path d="M25 99h78" />
          <path d="M38 44v-5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v5" />
          <path d="M56 44c4.5 0 8.5-2.5 10.5-6.5l4.3-8.7A9 9 0 0 1 78.9 24H95a9 9 0 0 1 8 4.9l4.2 8.4c2 4 6 6.7 10.5 6.7" />
          <path d="M42 54h6" />
          <circle cx="64" cy="73" r="23" />
          <circle cx="64" cy="73" r="8" />
          <path d="M64 56v10" />
          <path d="M64 80v10" />
          <path d="M47 73h10" />
          <path d="M71 73h10" />
          <path d="M52 61l7 7" />
          <path d="M69 78l7 7" />
          <path d="M52 85l7-7" />
          <path d="M69 68l7-7" />
          <circle cx="48" cy="57" r="1.5" fill="#F6EEE5" stroke="none" />
          <circle cx="80" cy="57" r="1.5" fill="#F6EEE5" stroke="none" />
          <circle cx="48" cy="89" r="1.5" fill="#F6EEE5" stroke="none" />
          <circle cx="80" cy="89" r="1.5" fill="#F6EEE5" stroke="none" />
          <circle cx="106" cy="52" r="2.5" fill="#F6EEE5" stroke="none" />
          <path d="M101 63h10" />
          <path d="M101 88h10" />
          <path d="M102 68v16" />
          <path d="M114 68v16" />
          <path d="M111 77a7 7 0 0 1 14 0" />
          <rect x="107" y="79" width="18" height="14" rx="2" />
          <path d="M116 84.5v3" />
          <circle cx="116" cy="83" r="1.4" fill="#8F472B" stroke="none" />
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
