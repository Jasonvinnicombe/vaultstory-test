import { LogOut } from "lucide-react";

import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" className="w-full justify-start sm:w-auto">
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </form>
  );
}
