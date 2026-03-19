import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminUsersLoading() {
  return (
    <AppShell fullName={null} email="" isAdmin>
      <div className="space-y-6 sm:space-y-7 animate-pulse">
        <Card className="glass-panel">
          <CardContent className="space-y-4 p-8 sm:p-10">
            <div className="h-5 w-20 rounded-full bg-secondary/60" />
            <div className="h-10 w-96 max-w-full rounded-full bg-secondary/45" />
            <div className="h-5 w-[32rem] max-w-full rounded-full bg-secondary/35" />
          </CardContent>
        </Card>
        {[1,2,3].map((item) => (
          <Card key={item} className="glass-panel">
            <CardContent className="space-y-4 p-8">
              <div className="h-8 w-64 rounded-full bg-secondary/45" />
              <div className="h-5 w-80 rounded-full bg-secondary/35" />
              <div className="grid gap-4 xl:grid-cols-4">
                <div className="h-14 rounded-[22px] bg-secondary/30" />
                <div className="h-14 rounded-[22px] bg-secondary/30" />
                <div className="h-14 rounded-[22px] bg-secondary/30" />
                <div className="h-14 rounded-[22px] bg-secondary/30" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
