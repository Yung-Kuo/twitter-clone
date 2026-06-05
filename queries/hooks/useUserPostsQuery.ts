import { useQuery } from "@tanstack/vue-query";
import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";
import { qk } from "~/queries/keys";
import {
  fetchUserPostsFromView,
  getPostsWithMetaClient,
} from "~/queries/api/postsWithMeta";
import { parsePostsWithMetaRows } from "~/schemas/parse";
import { applyPostMetaRows } from "~/queries/sync/applyPostMeta";
import { hydrateQuotedReposts } from "~/queries/sync/hydrateQuotedReposts";
import { usePostStore } from "~/stores/post";

async function loadUserPosts(uid: string) {
  const client = getPostsWithMetaClient();
  const { data, error } = await fetchUserPostsFromView(client, uid);
  if (error) throw error;
  return parsePostsWithMetaRows(data);
}

export function useUserPostsQuery(uid: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: computed(() => {
      const id = toValue(uid);
      return id ? qk.posts.byUser(id) : ["posts", "user", "none"];
    }),
    queryFn: () => loadUserPosts(toValue(uid)!),
    enabled: computed(() => !!toValue(uid)),
    select: (rows) => rows,
  });
}

export function useUserPostsQueryWithStore(uid: MaybeRefOrGetter<string | undefined>) {
  const postStore = usePostStore();
  const query = useUserPostsQuery(uid);
  watch(
    () => query.data.value,
    async (rows) => {
      const id = toValue(uid);
      if (!id || !rows) return;
      const posts = applyPostMetaRows(rows);
      await hydrateQuotedReposts(posts);
      postStore.userPosts[id] = posts.map((p) => p.id);
      for (const post of posts) {
        if (!postStore.allPosts.has(post.id)) {
          postStore.allPosts.set(post.id, post);
        }
      }
    },
    { immediate: true },
  );
  return query;
}
