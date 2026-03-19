import { saveRealityReflectionAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReflectionForm({ entryId, vaultId }: { entryId: string; vaultId: string }) {
  return (
    <form action={saveRealityReflectionAction} className="space-y-4">
      <input type="hidden" name="entryId" value={entryId} />
      <input type="hidden" name="vaultId" value={vaultId} />
      <Textarea name="realityText" placeholder="What actually happened? How did life feel compared with what you predicted?" />
      <Button type="submit">Save reflection</Button>
    </form>
  );
}
