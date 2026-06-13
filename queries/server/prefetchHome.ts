import type { QueryClient } from "@tanstack/vue-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import { fetchProfileOnce } from "~/queries/api/profiles";
import { loadFeed } from "~/queries/hooks/useFeedQuery";
import {
  engagementQueryKey,
  loadMyEngagement,
} from "~/queries/hooks/useMyEngagementQuery";
import { qk } from "~/queries/keys";
import { parseProfileRowNullable } from "~/schemas/parse";

/** SSR prefetch for authenticated home — profile, feed (For You), likes/bookmarks. */
export async function prefetchHome(opts: {
  queryClient: QueryClient;
  client: SupabaseClient<Database>;
  userId: string;
}) {
  const { queryClient, client, userId } = opts;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: qk.profiles.byId(userId),
      queryFn: async () => {
        const data = await fetchProfileOnce(client, userId);
        return parseProfileRowNullable(data);
      },
    }),
    queryClient.prefetchQuery({
      queryKey: qk.posts.feed("all"),
      queryFn: () =>
        loadFeed("all", userId, { posts: client, following: client }),
    }),
    queryClient.prefetchQuery({
      queryKey: engagementQueryKey,
      queryFn: () => loadMyEngagement(client, userId),
    }),
  ]);
}
