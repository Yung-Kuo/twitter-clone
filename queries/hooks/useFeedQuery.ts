import { useQuery } from "@tanstack/vue-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";
import type { Database } from "#build/types/supabase-database";
import { qk } from "~/queries/keys";
import { fetchFollowingIds, getFollowingClient } from "~/queries/api/following";
import {
  fetchAllFeedFromView,
  fetchFeedByUserIdsFromView,
  getPostsWithMetaClient,
} from "~/queries/api/postsWithMeta";
import type { PostWithMetaDTO } from "~/schemas/post";
import { parsePostsWithMetaRows } from "~/schemas/parse";
import {
  feedStoreSynced,
  hydrateFeedPosts,
  syncFeedToStore,
} from "~/queries/sync/hydrateStores";

export type FeedKind = "all" | "following";

export type FeedLoadClients = {
  posts?: SupabaseClient<Database>;
  following?: SupabaseClient<Database>;
};

export async function loadFeed(
  kind: FeedKind,
  uid: string | undefined,
  clients?: FeedLoadClients,
) {
  const postsClient = clients?.posts ?? getPostsWithMetaClient();
  if (kind === "all") {
    const { data, error } = await fetchAllFeedFromView(postsClient);
    if (error) throw error;
    return parsePostsWithMetaRows(data);
  }
  if (!uid) return [] as PostWithMetaDTO[];
  const followingClient = clients?.following ?? getFollowingClient();
  const { data: followingData, error: followingError } =
    await fetchFollowingIds(followingClient, uid);
  if (followingError) throw followingError;
  const followingIds = (followingData ?? []).map((r) => r.following_id);
  followingIds.push(uid);
  if (followingIds.length === 0) return [] as PostWithMetaDTO[];
  const { data, error } = await fetchFeedByUserIdsFromView(
    postsClient,
    followingIds,
  );
  if (error) throw error;
  return parsePostsWithMetaRows(data);
}

export function useFeedQuery(kind: MaybeRefOrGetter<FeedKind>) {
  const user = useSupabaseUser();
  return useQuery({
    queryKey: computed(() => qk.posts.feed(toValue(kind))),
    queryFn: () => loadFeed(toValue(kind), user.value?.id),
    enabled: computed(() => !!user.value?.id),
    select: (rows) => rows,
  });
}

export function useFeedQueryWithStore(kind: MaybeRefOrGetter<FeedKind>) {
  const query = useFeedQuery(kind);

  watchEffect(() => {
    const posts = query.data.value;
    if (!posts) return;
    const k = toValue(kind);
    if (!feedStoreSynced(k, posts)) {
      syncFeedToStore(k, posts);
    }
  });

  if (import.meta.server) {
    onServerPrefetch(async () => {
      const posts = query.data.value;
      if (posts) await hydrateFeedPosts(toValue(kind), posts);
    });
  }

  watch(
    () => query.data.value,
    (posts) => {
      if (posts) void hydrateFeedPosts(toValue(kind), posts);
    },
    { immediate: import.meta.client },
  );

  return query;
}
