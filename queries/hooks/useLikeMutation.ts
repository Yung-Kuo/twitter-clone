import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  deleteLike,
  insertLike,
  getPostsClient,
} from "~/queries/api/posts";
import { usePostStore } from "~/stores/post";

export function useLikeMutation() {
  const user = useSupabaseUser();
  const postStore = usePostStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      liked,
    }: {
      postId: string;
      liked: boolean;
    }) => {
      const uid = user.value?.id;
      if (!uid) return;
      const client = getPostsClient();
      if (liked) {
        const { error } = await deleteLike(client, postId, uid);
        if (error) throw error;
      } else {
        const { error, data } = await insertLike(client, postId, uid);
        if (error) throw error;
        return data;
      }
    },
    onMutate: async ({ postId, liked }) => {
      const uid = user.value?.id;
      if (!uid) return;
      if (liked) {
        if (!postStore.likes[uid]) postStore.likes[uid] = [];
        postStore.likes[uid] = postStore.likes[uid].filter(
          (l) => l.post_id !== postId,
        );
        if (postStore.likeCount[postId]) postStore.likeCount[postId] -= 1;
      } else {
        if (!postStore.likes[uid]) postStore.likes[uid] = [];
        postStore.likes[uid].unshift({ post_id: postId });
        if (postStore.likeCount[postId]) postStore.likeCount[postId] += 1;
        else postStore.likeCount[postId] = 1;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "engagement"] });
    },
  });
}
