import { LoadingPanel } from "@/components/ui/loading-panel";

export default function AppLoading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(220,197,171,0.26),transparent_28%),linear-gradient(180deg,rgba(255,251,247,1),rgba(246,240,232,1))]">
      <div className="page-wrap space-y-6 py-8 sm:py-10">
        <LoadingPanel lines={4} />
        <div className="grid gap-5 lg:grid-cols-2">
          <LoadingPanel lines={5} />
          <LoadingPanel lines={5} />
        </div>
      </div>
    </div>
  );
}
