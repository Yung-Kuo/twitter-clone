import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  deleteBookmark,
  insertBookmark,
  getPostsClient,
} from "~/queries/api/posts";
import { usePostStore } from "~/stores/post";

export function useBookmarkMutation() {
  const user = useSupabaseUser();
  const postStore = usePostStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      bookmarked,
    }: {
      postId: string;
      bookmarked: boolean;
    }) => {
      const uid = user.value?.id;
      if (!uid) return;
      const client = getPostsClient();
      if (bookmarked) {
        const { error } = await deleteBookmark(client, postId, uid);
        if (error) throw error;
      } else {
        const { error, data } = await insertBookmark(client, postId, uid);
        if (error) throw error;
        return data;
      }
    },
    onMutate: async ({ postId, bookmarked }) => {
      if (bookmarked) {
        postStore.bookmarks = postStore.bookmarks.filter(
          (b) => b.post_id !== postId,
        );
        if (postStore.bookmarkCount[postId]) postStore.bookmarkCount[postId] -= 1;
      } else {
        postStore.bookmarks.unshift({ post_id: postId });
        if (postStore.bookmarkCount[postId]) postStore.bookmarkCount[postId] += 1;
        else postStore.bookmarkCount[postId] = 1;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "engagement"] });
    },
  });
}
