import { completeMilestoneAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function MilestoneCompleteForm({ entryId, vaultId }: { entryId: string; vaultId: string }) {
  return (
    <form action={completeMilestoneAction}>
      <input type="hidden" name="entryId" value={entryId} />
      <input type="hidden" name="vaultId" value={vaultId} />
      <Button type="submit">Mark milestone completed</Button>
    </form>
  );
}
