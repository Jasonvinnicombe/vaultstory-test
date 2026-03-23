"use client";

import { useMemo, useState } from "react";

import { saveRealityReflectionAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReflectionForm({
  entryId,
  vaultId,
  initialValue = "",
}: {
  entryId: string;
  vaultId: string;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const isValid = useMemo(() => value.trim().length >= 3, [value]);

  return (
    <form action={saveRealityReflectionAction} className="space-y-4">
      <input type="hidden" name="entryId" value={entryId} />
      <input type="hidden" name="vaultId" value={vaultId} />
      <Textarea
        name="realityText"
        placeholder="What actually happened? How did life feel compared with what you predicted?"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button type="submit" disabled={!isValid} aria-disabled={!isValid}>
        Save reflection
      </Button>
    </form>
  );
}
