import type { BookmarkPick, LikePick } from "~/queries/api/posts";
import type { PostWithMetaDTO } from "~/schemas/post";
import { applyPostMetaRows } from "~/queries/sync/applyPostMeta";
import { hydrateQuotedReposts } from "~/queries/sync/hydrateQuotedReposts";
import { usePostStore } from "~/stores/post";

const hydrateFeedInFlight = new Map<string, Promise<void>>();

function feedHydrateKey(kind: "all" | "following", rows: PostWithMetaDTO[]) {
  return `${kind}:${rows.map((r) => r.id).join(",")}`;
}

/** True when Pinia feed ids already match query rows (6d-2). */
export function feedStoreSynced(
  kind: "all" | "following",
  rows: PostWithMetaDTO[],
): boolean {
  const postStore = usePostStore();
  const ids = rows.map((r) => r.id);
  const current = kind === "all" ? postStore.allPostId : postStore.followingPid;
  if (current.length !== ids.length) return false;
  return ids.every((id, i) => current[i] === id);
}

/** Sync Pinia feed lists before render — no network (6d-1). */
export function syncFeedToStore(
  kind: "all" | "following",
  rows: PostWithMetaDTO[],
) {
  const postStore = usePostStore();
  const posts = applyPostMetaRows(rows);

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

  return posts;
}

export async function hydrateFeedPosts(
  kind: "all" | "following",
  rows: PostWithMetaDTO[],
) {
  const key = feedHydrateKey(kind, rows);
  const inFlight = hydrateFeedInFlight.get(key);
  if (inFlight) return inFlight;

  const task = (async () => {
    const posts = feedStoreSynced(kind, rows)
      ? applyPostMetaRows(rows)
      : syncFeedToStore(kind, rows);
    await hydrateQuotedReposts(posts);
  })();

  hydrateFeedInFlight.set(key, task);
  try {
    await task;
  } finally {
    hydrateFeedInFlight.delete(key);
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
