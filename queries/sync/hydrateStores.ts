import type { BookmarkPick, LikePick } from "~/queries/api/posts";
import type { PostWithMetaDTO } from "~/schemas/post";
import { applyPostMetaRows } from "~/queries/sync/applyPostMeta";
import { hydrateQuotedReposts } from "~/queries/sync/hydrateQuotedReposts";
import { usePostStore } from "~/stores/post";

export async function hydrateFeedPosts(
  kind: "all" | "following",
  rows: PostWithMetaDTO[],
) {
  const postStore = usePostStore();
  const posts = applyPostMetaRows(rows);
  await hydrateQuotedReposts(posts);

  if (kind === "all") {
    postStore.allPostId = posts.map((p) => p.id);
    for (const post of posts) {
      postStore.allPosts.set(post.id, post);
    }
  } else {
    postStore.followingPid = posts.map((p) => p.id);
    for (const post of posts) {
      if (!postStore.allPosts.has(post.id)) {
        postStore.allPosts.set(post.id, post);
      }
    }
  }
}

export function hydrateLikes(uid: string, likes: LikePick[]) {
  const postStore = usePostStore();
  postStore.likes[uid] = likes;
}

export function hydrateBookmarks(bookmarks: BookmarkPick[]) {
  const postStore = usePostStore();
  postStore.bookmarks = bookmarks;
}
