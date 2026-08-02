import { createServerClient as createSSRClient } from "@supabase/ssr";

export function createServerClient(request: Request) {
  const headers = new Headers();

  const supabase = createSSRClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      // @supabase/ssr defaults to httpOnly: false so a browser-side client can
      // read the session. This app only ever talks to Supabase from the server,
      // so the session cookie can stay out of reach of any script.
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("Cookie") ?? "";
          return parseCookies(cookieHeader);
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            headers.append(
              "Set-Cookie",
              serializeCookie(name, value, options),
            );
          }
        },
      },
    },
  );

  return { supabase, headers };
}

function parseCookies(
  cookieHeader: string,
): { name: string; value: string }[] {
  if (!cookieHeader) return [];
  return cookieHeader.split(";").map((pair) => {
    const [name, ...rest] = pair.trim().split("=");
    return { name, value: rest.join("=") };
  });
}

function serializeCookie(
  name: string,
  value: string,
  options?: Record<string, unknown>,
): string {
  let cookie = `${name}=${value}`;
  if (!options) return cookie;

  if (options.path) cookie += `; Path=${options.path}`;
  if (options.maxAge != null) cookie += `; Max-Age=${options.maxAge}`;
  if (options.expires instanceof Date) cookie += `; Expires=${options.expires.toUTCString()}`;
  if (options.domain) cookie += `; Domain=${options.domain}`;
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  if (options.httpOnly) cookie += "; HttpOnly";
  if (options.secure) cookie += "; Secure";

  return cookie;
}
