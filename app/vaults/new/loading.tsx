import { LoadingPanel } from "@/components/ui/loading-panel";

export default function NewVaultLoading() {
  return (
    <div className="section-stack">
      <LoadingPanel lines={4} />
      <LoadingPanel lines={9} />
    </div>
  );
}
