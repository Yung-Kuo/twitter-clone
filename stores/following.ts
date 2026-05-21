import type { Database } from "#build/types/supabase-database";
import { FOLLOWING_COLUMNS } from "~/types/supabase-select";
import { errMsg } from "~/utils/errMsg";

type UserId = string;

export const useFollowingStore = defineStore("following", {
  state: () => ({
    following: {} as Record<UserId, UserId[]>,
    followers: {} as Record<UserId, UserId[]>,
    isFollowing: {} as Record<UserId, boolean>,
    error: "",
  }),
  getters: {
    getFollowing: (state) => {
      return (uid: UserId) => state.following[uid];
    },
    getFollowers: (state) => {
      return (uid: UserId) => state.followers[uid];
    },
    getFollowingStatus: (state) => {
      return (uid: UserId) => state.isFollowing[uid];
    },
    getError: (state) => {
      return state.error;
    },
  },
  actions: {
    async fetchFollowing(uid: UserId) {
      if (!uid) return;
      const client = useSupabaseClient<Database>();
      try {
        const { error, data } = await client
          .from("following")
          .select("following_id")
          .eq("follower_id", uid)
          .order("created_at", { ascending: false });
        if (data) {
          const user = useSupabaseUser();
          const uidSelf = user.value?.id;
          if (!uidSelf) return;
          this.following[uid] = data.map((obj) => obj.following_id);
          if (uid === uidSelf) {
            for (const id of this.following[uid] ?? []) {
              this.isFollowing[id] = true;
            }
          }
        }
        if (error) throw error;
      } catch (error) {
        this.error = errMsg(error);
      }
    },
    async fetchFollowers(uid: UserId) {
      if (!uid) return;
      const client = useSupabaseClient<Database>();
      try {
        const { error, data } = await client
          .from("following")
          .select(FOLLOWING_COLUMNS)
          .eq("following_id", uid)
          .order("created_at", { ascending: false });
        if (data)
          this.followers[uid] = data.map((obj) => obj.following_id);
        if (error) throw error;
      } catch (error) {
        this.error = errMsg(error);
      }
    },
    async checkIsFollowing(uid: UserId) {
      const user = useSupabaseUser();
      const client = useSupabaseClient<Database>();
      const myId = user.value?.id;
      if (!myId) return;
      try {
        const { error, data } = await client
          .from("following")
          .select(FOLLOWING_COLUMNS)
          .eq("follower_id", myId)
          .eq("following_id", uid);

        this.isFollowing[uid] = (data?.length ?? 0) > 0;
        if (error) throw error;
      } catch (error) {
        this.error = errMsg(error);
      }
    },
    async followUser(uid: UserId) {
      const user = useSupabaseUser();
      const client = useSupabaseClient<Database>();
      const myId = user.value?.id;
      if (!myId) return;
      try {
        const { error } = await client.from("following").insert({
          follower_id: myId,
          following_id: uid,
        });
        if (error) throw error;
        this.isFollowing[uid] = true;
        if (!this.following[myId]) this.following[myId] = [];
        if (!this.followers[uid]) this.followers[uid] = [];
        this.following[myId].push(uid);
        this.followers[uid].push(myId);
      } catch (error) {
        this.error = errMsg(error);
      }
    },
    async unfollowUser(uid: UserId) {
      const user = useSupabaseUser();
      const client = useSupabaseClient<Database>();
      const myId = user.value?.id;
      if (!myId) return;
      try {
        const { error } = await client.from("following").delete().match({
          follower_id: myId,
          following_id: uid,
        });
        if (error) throw error;
        this.isFollowing[uid] = false;
        if (this.following[myId]) {
          this.following[myId] = this.following[myId].filter(
            (id) => id !== uid,
          );
        }
        if (this.followers[uid]) {
          this.followers[uid] = this.followers[uid].filter(
            (id) => id !== myId,
          );
        }
      } catch (error) {
        this.error = errMsg(error);
      }
    },
    clearFollowing() {
      this.isFollowing = {};
    },
  },
});
