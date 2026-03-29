import Image from "next/image";
import { LockKeyhole } from "lucide-react";

type BrandMarkProps = {
  variant?: "modern" | "legacy";
  className?: string;
};

function ModernBrandMark({ className }: { className?: string }) {
  return (
    <span className={`flex min-w-0 items-center ${className ?? ""}`.trim()}>
      <Image
        src="/Vaultstory.png"
        alt="Vault Story"
        width={2736}
        height={1388}
        className="h-8 w-auto sm:h-9"
        priority
      />
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

