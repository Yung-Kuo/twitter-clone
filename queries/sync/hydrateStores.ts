import type { PostRow, BookmarkPick, LikePick  } from "~/queries/api/posts";
import { usePostStore } from "~/stores/post";
import { useProfileStore } from "~/stores/profile";

export async function hydrateFeedPosts(
  kind: "all" | "following",
  posts: PostRow[],
) {
  const postStore = usePostStore();
  const profileStore = useProfileStore();
  const client = useSupabaseClient();

  if (kind === "all") {
    postStore.allPostId = [];
    await postStore.setPosts(posts, client);
  } else {
    postStore.followingPid = posts.map((p) => p.id);
    for (const post of posts) {
      if (!postStore.allPosts.has(post.id)) {
        postStore.allPosts.set(post.id, post);
      }
    }
    await profileStore.ensureAuthorsForPosts(posts, client);
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
