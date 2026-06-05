import { useQuery } from "@tanstack/vue-query";
import {
  fetchBookmarksForUser,
  fetchLikesForUser,
  getPostsClient,
} from "~/queries/api/posts";
import { parseEngagementPayload } from "~/schemas/parse";
import { hydrateBookmarks, hydrateLikes } from "~/queries/sync/hydrateStores";

const engagementKey = ["me", "engagement"] as const;

export function useMyEngagementQuery() {
  const user = useSupabaseUser();
  return useQuery({
    queryKey: engagementKey,
    queryFn: async () => {
      const uid = user.value?.id;
      if (!uid) return { likes: [], bookmarks: [] };
      const client = getPostsClient();
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
