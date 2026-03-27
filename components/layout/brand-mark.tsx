import { LockKeyhole } from "lucide-react";

type BrandMarkProps = {
  variant?: "modern" | "legacy";
  className?: string;
};

function ModernBrandMark({ className }: { className?: string }) {
  return (
    <span className={`flex min-w-0 items-center gap-3 text-primary ${className ?? ""}`.trim()}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.1rem] border border-primary/12 bg-primary text-primary-foreground shadow-[0_14px_28px_rgba(29,42,68,0.16)]">
        <span className="relative flex h-7 w-7 items-center justify-center rounded-[0.95rem] border-2 border-primary-foreground/96">
          <span className="absolute -top-1.5 h-3.5 w-3.5 rounded-t-full border-2 border-b-0 border-primary-foreground/96" />
          <span className="h-2.5 w-2.5 rounded-full border-2 border-primary-foreground/96" />
        </span>
      </span>
      <span className="truncate text-[1.05rem] font-semibold tracking-[0.22em] text-primary">VAULT STORY</span>
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
