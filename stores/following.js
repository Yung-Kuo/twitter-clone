export const useFollowingStore = defineStore("following", {
  state: () => ({
    following: {},
    followers: {},
    isFollowing: {},
    error: "",
  }),
  getters: {
    getFollowing: (state) => {
      return (uid) => state.following[uid];
    },
    getFollowers: (state) => {
      return (uid) => state.followers[uid];
    },
    getFollowingStatus: (state) => {
      return (uid) => state.isFollowing[uid];
    },
    getError: (state) => {
      return state.error;
    },
  },
  actions: {
    // fetch following list
    async fetchFollowing(uid) {
      if (!uid) return;
      const client = useSupabaseClient();
      try {
        const { error, data } = await client
          .from("following")
          .select("following_id")
          .eq("follower_id", uid)
          .order("created_at", { ascending: false });
        if (data) {
          const user = useSupabaseUser();
          this.following[uid] = data.map((obj) => obj.following_id);
          if (uid === user.value.id) {
            for (const id of this.following[uid]) {
              this.isFollowing[id] = true;
            }
          }
        }
        if (error) throw error;
      } catch (error) {
        this.error = error.message;
      }
    },
    // fetch follower list
    async fetchFollowers(uid) {
      if (!uid) return;
      const client = useSupabaseClient();
      try {
        const { error, data } = await client
          .from("following")
          .select()
          .eq("following_id", uid)
          .order("created_at", { ascending: false });
        if (data) this.followers[uid] = data.map((obj) => obj.following_id);
        if (error) throw error;
      } catch (error) {
        this.error = error.message;
      }
    },
    // check if an user is being follow by you
    async checkIsFollowing(uid) {
      const user = useSupabaseUser();
      const client = useSupabaseClient();
      try {
        const { error, data } = await client
          .from("following")
          .select()
          .eq("follower_id", user.value.id)
          .eq("following_id", uid);

        this.isFollowing[uid] = data.length > 0;
        if (error) throw error;
      } catch (error) {
        this.error = error.message;
      }
    },
    // do I need to explain?
    async followUser(uid) {
      const user = useSupabaseUser();
      const client = useSupabaseClient();
      const myId = user.value.id;
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
        this.error = error.message;
      }
    },
    // cancelled
    async unfollowUser(uid) {
      const user = useSupabaseUser();
      const client = useSupabaseClient();
      const myId = user.value.id;
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
        this.error = error.message;
      }
    },
    clearFollowing() {
      this.isFollowing = {};
    },
  },
});
