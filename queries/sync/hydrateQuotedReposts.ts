import type { PostRow } from "~/queries/api/posts";
import { fetchPostsByIds, getPostsClient } from "~/queries/api/posts";
import { quotedRepostIdsFromPosts } from "~/queries/sync/quotedRepostIds";
import { usePostStore } from "~/stores/post";
import { useProfileStore } from "~/stores/profile";

export { quotedRepostIdsFromPosts } from "~/queries/sync/quotedRepostIds";

/** Post ids referenced by repost rows that are not yet in the post cache. */
export function collectQuotedRepostIds(posts: PostRow[]): string[] {
  const postStore = usePostStore();
  return quotedRepostIdsFromPosts(posts, (id) => !!postStore.getPost(id));
}

/** One batched fetch for all quoted posts on a feed (Phase 6b-3). */
export async function hydrateQuotedReposts(posts: PostRow[]) {
  const ids = collectQuotedRepostIds(posts);
  if (ids.length === 0) return;

  const client = getPostsClient();
  const postStore = usePostStore();
  const profileStore = useProfileStore();

  const { data, error } = await fetchPostsByIds(client, ids);
  if (error) throw error;
  if (!data?.length) return;

  for (const post of data) {
    if (!postStore.allPosts.has(post.id)) {
      postStore.allPosts.set(post.id, post);
    }
  }
  await profileStore.ensureAuthorsForPosts(data, client);
}
