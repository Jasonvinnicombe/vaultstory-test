import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export const getProfileById = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error) throw error;

  return data;
});

