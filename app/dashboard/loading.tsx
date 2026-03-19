import { LoadingPanel } from "@/components/ui/loading-panel";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-7">
      <LoadingPanel lines={4} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <LoadingPanel lines={2} />
        <LoadingPanel lines={2} />
        <LoadingPanel lines={2} />
        <LoadingPanel lines={2} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <LoadingPanel lines={7} />
        <LoadingPanel lines={5} />
      </div>
    </div>
  );
}
