import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminUserDetailLoading() {
  return (
    <AppShell fullName={null} email="" isAdmin>
      <div className="space-y-6 sm:space-y-7 animate-pulse">
        <Card className="glass-panel">
          <CardContent className="space-y-4 p-8 sm:p-10">
            <div className="h-5 w-24 rounded-full bg-secondary/60" />
            <div className="h-10 w-80 max-w-full rounded-full bg-secondary/45" />
            <div className="h-5 w-72 rounded-full bg-secondary/35" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
