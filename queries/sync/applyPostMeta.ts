import type { PostRow } from "~/queries/api/posts";
import { parsePostsWithMetaRows, parseProfileRowNullable } from "~/schemas/parse";
import { stripPostRow } from "~/queries/sync/stripPostRow";
import { usePostStore } from "~/stores/post";
import { useProfileStore } from "~/stores/profile";
import { useReplyStore } from "~/stores/reply";

export { stripPostRow } from "~/queries/sync/stripPostRow";

export function applyPostMetaRows(rows: unknown) {
  const parsed = parsePostsWithMetaRows(rows);
  const postStore = usePostStore();
  const profileStore = useProfileStore();
  const replyStore = useReplyStore();
  const posts: PostRow[] = [];

  for (const row of parsed) {
    const post = stripPostRow(row);
    posts.push(post);
    postStore.likeCount[post.id] = row.like_count;
    replyStore.replyCount[post.id] = row.reply_count;
    postStore.repostCount[post.id] = row.repost_count;
    postStore.bookmarkCount[post.id] = row.bookmark_count;
    replyStore.userHasReplied[post.id] = row.i_replied;
    const author = parseProfileRowNullable(row.author);
    if (author) profileStore.cacheProfile(author);
  }

  return posts;
}
