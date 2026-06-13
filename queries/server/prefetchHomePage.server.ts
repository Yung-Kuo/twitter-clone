import type { H3Event } from "h3";
import type { QueryClient } from "@tanstack/vue-query";
import { prefetchHome } from "~/queries/server/prefetchHome";
import {
  getServerSupabaseClient,
  getServerSupabaseUser,
} from "~/queries/server/supabaseServer.server";

/** Server-only entry for home SSR prefetch (Phase 6c). */
export async function prefetchHomePage(
  event: H3Event,
  queryClient: QueryClient,
) {
  const user = await getServerSupabaseUser(event);
  if (!user?.id) return;

  const client = await getServerSupabaseClient(event);
  await prefetchHome({
    queryClient,
    client,
    userId: user.id,
  });
}
