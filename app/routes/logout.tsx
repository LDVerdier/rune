import { redirect } from "react-router";
import { createServerClient } from "~/services/supabase.server";
import type { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createServerClient(request);
  await supabase.auth.signOut();
  return redirect("/", { headers });
}
