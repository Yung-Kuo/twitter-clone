import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { H3Event } from "h3";
import { getHeader, setCookie } from "h3";
import { useRuntimeConfig } from "#imports";
import type { Database } from "#build/types/supabase-database";

/** Server Supabase client from request cookies (no #supabase/server alias). */
export async function getServerSupabaseClient(
  event: H3Event,
): Promise<SupabaseClient<Database>> {
  const {
    public: {
      supabase: { url, key, cookieOptions },
    },
  } = useRuntimeConfig(event);

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => {
        const parsed = parseCookieHeader(getHeader(event, "cookie") ?? "");
        return parsed
          .filter(
            (cookie): cookie is { name: string; value: string } =>
              typeof cookie.value === "string",
          )
          .map((cookie) => ({ name: cookie.name, value: cookie.value }));
      },
      setAll: (
        cookies: {
          name: string;
          value: string;
          options?: Parameters<typeof setCookie>[3];
        }[],
      ) => {
        for (const { name, value, options } of cookies) {
          setCookie(event, name, value, { ...cookieOptions, ...options });
        }
      },
    },
  });
}

export async function getServerSupabaseUser(event: H3Event) {
  const client = await getServerSupabaseClient(event);
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}
