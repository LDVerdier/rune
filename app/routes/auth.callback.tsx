import { redirect } from "react-router";
import { createServerClient } from "~/services/supabase.server";
import type { Route } from "./+types/auth.callback";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const { supabase, headers } = createServerClient(request);
    await supabase.auth.exchangeCodeForSession(code);
    return redirect("/my-characters", { headers });
  }

  return redirect("/login");
}
