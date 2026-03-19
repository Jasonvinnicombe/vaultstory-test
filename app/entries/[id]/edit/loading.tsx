import { LoadingPanel } from "@/components/ui/loading-panel";

export default function EditEntryLoading() {
  return (
    <div className="space-y-6 sm:space-y-7">
      <LoadingPanel lines={3} />
      <LoadingPanel lines={6} />
    </div>
  );
}
