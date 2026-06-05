import type { PostRow } from "~/queries/api/posts";

/** Pure helper: ids of quoted posts missing from cache. */
export function quotedRepostIdsFromPosts(
  posts: PostRow[],
  hasPost: (id: string) => boolean,
): string[] {
  const ids = new Set<string>();
  for (const post of posts) {
    if (
      post.type === "repost" &&
      post.reply_to &&
      !hasPost(post.reply_to)
    ) {
      ids.add(post.reply_to);
    }
  }
  return [...ids];
}
