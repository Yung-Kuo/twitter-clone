import { useQuery } from "@tanstack/vue-query";
import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";
import { qk } from "~/queries/keys";
import {
  fetchAllFeedPosts,
  fetchPostsByUserIds,
  getPostsClient,
} from "~/queries/api/posts";
import { fetchFollowingIds, getFollowingClient } from "~/queries/api/following";
import { hydrateFeedPosts } from "~/queries/sync/hydrateStores";

export type FeedKind = "all" | "following";

async function loadFeed(kind: FeedKind, uid: string | undefined) {
  const client = getPostsClient();
  if (kind === "all") {
    const { data, error } = await fetchAllFeedPosts(client);
    if (error) throw error;
    return data ?? [];
  }
  if (!uid) return [];
  const followingClient = getFollowingClient();
  const { data: followingData, error: followingError } =
    await fetchFollowingIds(followingClient, uid);
  if (followingError) throw followingError;
  const followingIds = (followingData ?? []).map((r) => r.following_id);
  followingIds.push(uid);
  if (followingIds.length === 0) return [];
  const { data, error } = await fetchPostsByUserIds(client, followingIds);
  if (error) throw error;
  return data ?? [];
}

export function useFeedQuery(kind: MaybeRefOrGetter<FeedKind>) {
  const user = useSupabaseUser();
  return useQuery({
    queryKey: computed(() => qk.posts.feed(toValue(kind))),
    queryFn: () => loadFeed(toValue(kind), user.value?.id),
    enabled: computed(() => !!user.value?.id),
  });
}

export function useFeedQueryWithStore(kind: MaybeRefOrGetter<FeedKind>) {
  const query = useFeedQuery(kind);
  watch(
    () => query.data.value,
    async (posts) => {
      if (posts) await hydrateFeedPosts(toValue(kind), posts);
    },
    { immediate: true },
  );
  return query;
}
