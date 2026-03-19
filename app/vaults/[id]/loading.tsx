import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function VaultLoading() {
  return (
    <AppShell fullName={null} email="">
      <div className="section-stack">
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="space-y-4 p-8 sm:p-10">
            <div className="h-5 w-28 rounded-full bg-secondary/40" />
            <div className="h-12 w-2/3 rounded-[20px] bg-secondary/30" />
            <div className="h-5 w-3/4 rounded-full bg-secondary/20" />
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_26px_80px_rgba(66,46,31,0.12)]">
          <CardContent className="space-y-5 p-7 sm:p-9">
            <div className="h-14 rounded-[24px] bg-secondary/20" />
            <div className="grid gap-5 md:grid-cols-2">
              <div className="h-14 rounded-[24px] bg-secondary/20" />
              <div className="h-14 rounded-[24px] bg-secondary/20" />
            </div>
            <div className="h-40 rounded-[32px] bg-secondary/15" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
