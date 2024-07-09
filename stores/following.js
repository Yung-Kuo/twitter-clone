export const useFollowingStore = defineStore({
  id: "following",
  state: () => ({
    // current user
    following: "",
    followers: "",
    isFollowing: {},
    // other user
    userFollowing: "",
    userFollowers: "",
    error: "",
  }),
  getters: {
    getFollowing: (state) => {
      return state.following;
    },
    getFollowers: (state) => {
      return state.followers;
    },
    getUserFollowing: (state) => {
      return state.userFollowing;
    },
    getUserFollowers: (state) => {
      return state.userFollowers;
    },
    getFollowingStatus: (state) => {
      return (uid) => state.isFollowing[uid];
    },
    getError: (state) => {
      return state.error;
    },
  },
  actions: {
    // fetch current user's following list
    async fetchFollowing() {
      const user = useSupabaseUser();
      const client = useSupabaseClient();
      const { error, data } = await useAsyncData("my_following", async () => {
        const { error, data } = await client
          .from("following")
          .select("following_id")
          .eq("follower_id", user.value.id)
          .order("created_at", { ascending: false });
        return error, data;
      });
      if (!data.value) {
        await refreshNuxtData("my_following");
      }
      if (data.value) {
        this.following = data.value.map((obj) => obj.following_id);
      }
      if (error.value) this.error = error.value;
    },
    // fetch other user's following list
    async fetchUserFollowing(uid) {
      const client = useSupabaseClient();
      const { error, data } = await useAsyncData("user_following", async () => {
        const { error, data } = await client
          .from("following")
          .select("following_id")
          .eq("follower_id", uid)
          .order("created_at", { ascending: false });
        return error, data;
      });
      if (!data.value) await refreshNuxtData("user_following");
      if (data.value)
        this.userFollowing = data.value.map((obj) => obj.following_id);
      if (error.value) this.error = error.value;
    },
    // fetch current user's follower list
    async fetchFollowers() {
      const user = useSupabaseUser();
      const client = useSupabaseClient();
      const { error, data } = await useAsyncData("my_followers", async () => {
        const { error, data } = await client
          .from("following")
          .select()
          .eq("following_id", user.value.id)
          .order("created_at", { ascending: false });
        return error, data;
      });
      if (!data.value) await refreshNuxtData("my_followers");
      if (data.value) this.followers = data.value;
      if (error.value) console.log("fetch followers error: ", error.value);
    },
    // fetch other user's follower list
    async fetchUserFollowers(uid) {
      const client = useSupabaseClient();
      if (uid)
        try {
          const { error, data } = await client
            .from("following")
            .select()
            .eq("following_id", uid)
            .order("created_at", { ascending: false });
          if (data) this.userFollowers = data;
          if (error) throw error;
        } catch (error) {
          console.log("fetch followers error: ", error);
        }
    },
    // check if an user is being follow by you
    async checkIsFollowing(uid) {
      const user = useSupabaseUser();
      const client = useSupabaseClient();
      const { error, data } = await useAsyncData("is_following", async () => {
        const { error, data } = await client
          .from("following")
          .select()
          .eq("follower_id", user.value.id)
          .eq("following_id", uid);
        return error, data.length > 0;
      });
      if (error.value) console.log("error: ", error.value);
      this.isFollowing[uid] = data.value;
    },
    // do I need to explain?
    async followUser(uid) {
      const user = useSupabaseUser();
      const client = useSupabaseClient();
      try {
        const { error } = await client.from("following").insert({
          follower_id: user.value.id,
          following_id: uid,
        });
        if (error) throw error;
        else this.isFollowing[uid] = true;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.fetchUserFollowers(uid);
      }
    },
    // cancelled
    async unfollowUser(uid) {
      const user = useSupabaseUser();
      const client = useSupabaseClient();
      try {
        const { error } = await client.from("following").delete().match({
          follower_id: user.value.id,
          following_id: uid,
        });
        if (error) throw error;
        else this.isFollowing[uid] = false;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.fetchUserFollowers(uid);
      }
    },
  },
  // persist: true,
});
