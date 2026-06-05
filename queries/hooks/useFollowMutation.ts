import { useMutation } from "@tanstack/vue-query";
import {
  deleteFollowing,
  insertFollowing,
  getFollowingClient,
} from "~/queries/api/following";
import {
  handleMutationError,
  handleMutationSuccess,
} from "~/queries/lib/mutationAlert";
import { useFollowingStore } from "~/stores/following";

export function useFollowMutation() {
  const user = useSupabaseUser();
  const followingStore = useFollowingStore();

  return useMutation({
    mutationFn: async ({
      targetUid,
      following,
    }: {
      targetUid: string;
      following: boolean;
    }) => {
      const myId = user.value?.id;
      if (!myId) return;
      const client = getFollowingClient();
      if (following) {
        const { error } = await deleteFollowing(client, myId, targetUid);
        if (error) throw error;
      } else {
        const { error } = await insertFollowing(client, myId, targetUid);
        if (error) throw error;
      }
    },
    onMutate: async ({ targetUid, following }) => {
      const myId = user.value?.id;
      if (!myId) return;
      if (following) {
        followingStore.isFollowing[targetUid] = false;
        if (followingStore.following[myId]) {
          followingStore.following[myId] = followingStore.following[myId].filter(
            (id) => id !== targetUid,
          );
        }
        if (followingStore.followers[targetUid]) {
          followingStore.followers[targetUid] =
            followingStore.followers[targetUid].filter((id) => id !== myId);
        }
      } else {
        followingStore.isFollowing[targetUid] = true;
        if (!followingStore.following[myId]) followingStore.following[myId] = [];
        if (!followingStore.followers[targetUid])
          followingStore.followers[targetUid] = [];
        followingStore.following[myId].push(targetUid);
        followingStore.followers[targetUid].push(myId);
      }
    },
    onSuccess: (_data, { following }) => {
      handleMutationSuccess(following ? "Unfollowed" : "Now following");
    },
    onError: handleMutationError,
  });
}
