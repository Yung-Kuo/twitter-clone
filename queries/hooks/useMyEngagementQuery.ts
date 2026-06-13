import { useQuery } from "@tanstack/vue-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import {
  fetchBookmarksForUser,
  fetchLikesForUser,
  getPostsClient,
} from "~/queries/api/posts";
import { parseEngagementPayload } from "~/schemas/parse";
import { hydrateBookmarks, hydrateLikes } from "~/queries/sync/hydrateStores";

export const engagementQueryKey = ["me", "engagement"] as const;

export async function loadMyEngagement(
  client: SupabaseClient<Database>,
  uid: string,
) {
  const [likesRes, bookmarksRes] = await Promise.all([
    fetchLikesForUser(client, uid),
    fetchBookmarksForUser(client, uid),
  ]);
  if (likesRes.error) throw likesRes.error;
  if (bookmarksRes.error) throw bookmarksRes.error;
  return parseEngagementPayload({
    likes: likesRes.data ?? [],
    bookmarks: bookmarksRes.data ?? [],
  });
}

export function useMyEngagementQuery() {
  const user = useSupabaseUser();
  return useQuery({
    queryKey: engagementQueryKey,
    queryFn: async () => {
      const uid = user.value?.id;
      if (!uid) return { likes: [], bookmarks: [] };
      return loadMyEngagement(getPostsClient(), uid);
    },
    enabled: computed(() => !!user.value?.id),
    select: (data) => data,
  });
}

export function useMyEngagementQueryWithStore() {
  const user = useSupabaseUser();
  const query = useMyEngagementQuery();
  watch(
    () => query.data.value,
    (data) => {
      const uid = user.value?.id;
      if (!uid || !data) return;
      hydrateLikes(uid, data.likes);
      hydrateBookmarks(data.bookmarks);
    },
    { immediate: true },
  );
  return query;
}
