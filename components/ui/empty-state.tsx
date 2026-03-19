import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  body,
  icon: Icon,
  action,
}: {
  title: string;
  body: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-white/60 bg-card/82 shadow-[0_18px_52px_rgba(66,46,31,0.08)]">
      <CardContent className="flex flex-col items-start gap-4 p-7 sm:p-8">
        {Icon ? <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/85 text-primary"><Icon className="h-5 w-5" /></div> : null}
        <div className="space-y-2">
          <h3 className="font-display text-2xl text-foreground">{title}</h3>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{body}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
