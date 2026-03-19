import { LoadingPanel } from "@/components/ui/loading-panel";

export default function SettingsLoading() {
  return (
    <div className="section-stack">
      <LoadingPanel lines={4} />
      <LoadingPanel lines={8} />
    </div>
  );
}
