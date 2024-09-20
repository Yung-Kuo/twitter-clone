import { useFollowingStore } from "~/stores/following";
import { useReplyStore } from "~/stores/reply";
export const usePostStore = defineStore({
  id: "post",
  // pinia store to upload and download personal post
  state: () => ({
    // posts: [], // all posts or following
    userPosts: {}, // one user's posts
    post: {}, // the post you have just wrote
    allPosts: new Map(),
    // only store posts that are not replies
    allPostId: [],
    userAvatars: {},
    userProfile: {},
    followingPid: [],
    bookmarks: [],
    bookmarkCount: {},
    likes: {},
    likeCount: {},
    reply: {},
  }),
  getters: {
    getPost(state) {
      // get single post
      return (pid) => state.allPosts.get(pid) || null;
    },
    getAllPosts(state) {
      const filteredPosts = [];
      for (const pid of state.allPostId) {
        if (state.allPosts.has(pid)) {
          filteredPosts.push(state.allPosts.get(pid));
        }
      }
      return filteredPosts;
    },
    getFollowingPosts(state) {
      const filteredPosts = [];
      for (const pid of state.followingPid) {
        if (state.allPosts.has(pid)) {
          filteredPosts.push(state.allPosts.get(pid));
        }
      }
      return filteredPosts;
    },
    getUserPosts(state) {
      return (uid) => {
        // get all posts of a user
        const filteredPosts = [];
        if (!state.userPosts[uid]) return null;
        for (const pid of state.userPosts[uid]) {
          if (filteredPosts.find((post) => post.id === pid)) continue;
          if (state.allPosts.has(pid)) {
            filteredPosts.push(state.allPosts.get(pid));
          }
        }
        return filteredPosts;
      };
    },
    getAvatarUrl(state) {
      return (uid) => state.userProfile[uid]?.avatar_url;
    },
    getAvatar(state) {
      return (uid) => state.userAvatars[uid];
    },
    getUsername(state) {
      return (uid) => state.userProfile[uid]?.username;
    },
    getName(state) {
      return (uid) => {
        if (!uid) return null;
        else {
          return (
            state.userProfile[uid]?.first_name +
            " " +
            state.userProfile[uid]?.last_name
          );
        }
      };
    },
    getProfile(state) {
      return (uid) => state.userProfile[uid];
    },
    getProfileList(state) {
      return state.userProfile;
    },
    getBookmarks(state) {
      return state.bookmarks;
    },
    getBookmarkPosts(state) {
      const filteredPosts = [];
      for (const bookmark of state.bookmarks) {
        if (state.allPosts.has(bookmark.post_id)) {
          filteredPosts.push(state.allPosts.get(bookmark.post_id));
        }
      }
      return filteredPosts;
    },
    getBookmarkCount(state) {
      return (pid) =>
        state.bookmarkCount[pid] ? state.bookmarkCount[pid] : "";
    },
    checkBookmark(state) {
      return (pid) =>
        !!state.bookmarks.find((bookmark) => bookmark.post_id === pid);
    },
    getLikes(state) {
      return (uid) => state.likes[uid];
    },
    getLikePosts(state) {
      return (uid) => {
        if (!state.likes[uid]) return null;
        const filteredPosts = [];
        for (const like of state.likes[uid]) {
          if (state.allPosts.has(like.post_id)) {
            filteredPosts.push(state.allPosts.get(like.post_id));
          }
        }
        return filteredPosts;
      };
    },
    getLikeCount(state) {
      return (pid) => (state.likeCount[pid] ? state.likeCount[pid] : "");
      // return (pid) => state.likeCount[pid];
    },
    checkLike(state) {
      return (pid) => {
        const user = useSupabaseUser();
        return !!state.likes[user.value.id]?.find(
          (like) => like.post_id === pid
        );
      };
    },
  },
  actions: {
    async uploadPost(newPost) {
      // upload post
      const client = useSupabaseClient();
      const user = useSupabaseUser();
      try {
        const { error, data } = await client
          .from("posts")
          .insert({
            user_id: user.value.id,
            text: newPost.text,
            pictures: newPost.pictures,
            reply_to: newPost.reply_to,
            type: newPost.type,
          })
          .select()
          .single();
        if (error) throw error;
        else if (data) {
          this.allPosts.set(data.id, data);
          if (!this.userPosts[user.value.id]) {
            this.userPosts[user.value.id] = [];
          }
          this.userPosts[user.value.id].unshift(data.id);
          this.followingPid.unshift(data.id);
          const newPostAddress = `/${this.getUsername(user.value.id)}/post/${
            data.id
          }`;
          // console.log(newPostAddress);
          return newPostAddress;
        }
      } catch (error) {
        console.log(`error message: ${error.message}`);
        return false;
      }
    },
    async updatePost(edit) {
      const client = useSupabaseClient();
      try {
        const { error, data } = await client
          .from("posts")
          .update({ text: edit.text, edited: true })
          .eq("id", edit.id)
          .select()
          .single();
        if (error) throw error;
        if (data) {
          console.log("data: ", data);
          this.allPosts.set(data.id, data);
          // if this is a reply
          if (data.type === "reply" && data.reply_to) {
            const replyStore = useReplyStore();
            replyStore.editReply(edit.id, data);
          }
          return true;
        }
      } catch (error) {
        console.log(error.message);
        return false;
      }
    },
    async deletePost(pid) {
      const deleteThis = this.allPosts.get(pid);
      const replyStore = useReplyStore();
      // delete post
      const client = useSupabaseClient();
      const user = useSupabaseUser();
      try {
        console.log("run delete post!!!");
        const { error } = await client.from("posts").delete().match({
          id: pid,
          user_id: user.value.id,
        });
        if (error) throw error;
        else {
          this.allPosts.delete(pid);
          if (deleteThis.reply_to)
            await replyStore.deleteReply(pid, deleteThis.reply_to);
          return true;
        }
      } catch (error) {
        console.log(error.message);
        return false;
      }
    },
    async setPosts(posts) {
      for (const post of posts) {
        if (!this.allPostId.find((pid) => pid === post.id))
          this.allPostId.push(post.id);
        if (!this.allPosts.has(post.id)) {
          this.allPosts.set(post.id, post);
        }
        if (!this.getProfile(post.user_id))
          await this.fetchUserProfile(post.user_id);
        if (!this.getAvatar(post.user_id))
          await this.downloadAvatar(
            post.user_id,
            this.userProfile[post.user_id].avatar_url
          );
      }
    },
    setReplies(posts) {
      for (const post of posts) {
        if (!this.allPosts.has(post.id)) {
          this.allPosts.set(post.id, post);
        }
      }
    },
    async fetchUserPosts(uid) {
      const client = useSupabaseClient();
      if (!uid) return;
      try {
        // fetch list of posts of a user
        const { error, data } = await client
          .from("posts")
          .select()
          .in("type", ["post", "repost"])
          .eq("user_id", uid)
          .order("created_at", { ascending: false });

        if (data) {
          for (const post of data) {
            if (!this.userPosts[uid]) {
              this.userPosts[uid] = [];
            }
            this.userPosts[uid].push(post.id);
          }
          await this.setPosts(data);
          await this.fetchUserProfile(uid);
        }
        if (error) throw error;
      } catch (error) {
        console.log("error: ", error.message);
      }
    },
    async fetchAllPosts() {
      const client = useSupabaseClient();
      // fetch all posts
      try {
        const { error, data } = await client
          .from("posts")
          .select()
          .in("type", ["post", "repost"])
          .order("created_at", { ascending: false });

        if (data) {
          this.allPostId = [];
          await this.setPosts(data);
        }
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchFollowingPosts() {
      const client = useSupabaseClient();
      const user = useSupabaseUser();
      // check following list
      const followingStore = useFollowingStore();
      await followingStore.fetchFollowing();
      let following_id = followingStore.getFollowing(user.value.id);
      following_id.push(user.value.id);
      // console.log("getFollowing: ", following_id);
      if (following_id.length > 0) {
        // fetch posts from followed users
        try {
          const { error, data } = await client
            .from("posts")
            .select()
            .in("type", ["post", "repost"])
            .in("user_id", following_id)
            .order("created_at", { ascending: false });

          if (data) {
            this.followingPid = [];
            for (const post of data) {
              this.followingPid.push(post.id);
              if (!this.allPosts.has(post.id)) {
                this.allPosts.set(post.id, post);
              }
              await this.fetchUserProfile(post.user_id);
              await this.downloadAvatar(
                post.user_id,
                this.userProfile[post.user_id].avatar_url
              );
            }
          }
          if (error) throw error;
        } catch (error) {
          console.log("error: ", error);
        }
      }
    },
    async fetchOnePost(pid) {
      const client = useSupabaseClient();
      try {
        const { error, data } = await client
          .from("posts")
          .select()
          .eq("id", pid)
          .single();
        if (data) {
          const post = data;
          if (!this.allPosts.has(post.id)) {
            this.allPosts.set(post.id, post);
          }
          if (!this.getProfile(post.user_id))
            await this.fetchUserProfile(post.user_id);
          if (!this.getAvatar(post.user_id))
            await this.downloadAvatar(
              post.user_id,
              this.userProfile[post.user_id].avatar_url
            );
        }
        if (error) throw error;
      } catch (error) {
        console.log("error: ", error);
      }
    },
    async downloadAvatar(uid, url) {
      // download avatar from url store in supabase
      const client = useSupabaseClient();
      if (!url) return;
      if (!this.userAvatars[uid]) {
        try {
          const { data, error } = await client.storage
            .from("avatars")
            .download(url);
          if (error) throw error;
          this.userAvatars[uid] = URL.createObjectURL(data);
        } catch (error) {
          console.log(error.message);
        } finally {
          // console.log(this.userAvatars[uid]);
        }
      }
    },
    async fetchProfiles() {
      const client = useSupabaseClient();
      try {
        const { error, data } = await client.from("profiles").select();
        if (data) {
          for (const profile of data) {
            this.userProfile[profile.id] = profile;
          }
        }
        if (error) throw error;
      } catch (error) {
        console.log(error.message);
      }
    },
    async fetchUserProfile(uid) {
      const client = useSupabaseClient();
      if (!this.userProfile[uid] && uid) {
        try {
          const { data, error } = await client
            .from("profiles")
            .select()
            .eq("id", uid)
            .single();
          if (error) throw error;
          this.userProfile[uid] = data;
          // console.log("userProfile: ", this.userProfile[uid]);
        } catch (error) {
          console.log(error.message);
        }
      }
    },
    setProfile(profile) {
      this.userProfile[profile.id] = profile;
    },
    async bookmarkPost(pid) {
      const client = useSupabaseClient();
      const user = useSupabaseUser();
      try {
        const { error, data } = await client
          .from("bookmark")
          .insert({
            post_id: pid,
            user_id: user.value.id,
          })
          .select("post_id")
          .single();
        if (data) {
          this.bookmarks.unshift(data);
          if (this.bookmarkCount[pid]) this.bookmarkCount[pid] += 1;
          else this.bookmarkCount[pid] = 1;
        }
        if (error) throw error;
      } catch (error) {
        console.log(error.message);
      }
    },
    async unbookmarkPost(pid) {
      const client = useSupabaseClient();
      const user = useSupabaseUser();
      try {
        const { error } = await client.from("bookmark").delete().match({
          post_id: pid,
          user_id: user.value.id,
        });
        if (error) throw error;
        else {
          this.bookmarks = this.bookmarks.filter(
            (bookmark) => bookmark.post_id !== pid
          );
          if (this.bookmarkCount[pid]) this.bookmarkCount[pid] -= 1;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async fetchBookmarks() {
      const client = useSupabaseClient();
      const user = useSupabaseUser();
      try {
        const { error, data } = await client
          .from("bookmark")
          .select("post_id")
          .eq("user_id", user.value.id)
          .order("created_at", { ascending: false });
        // console.log("fetchBookmarks: ", data.value);
        if (data) this.bookmarks = data;
        if (error) throw error;
      } catch (error) {
        console.log(error.message);
      }
    },
    async fetchBookmarkPosts() {
      const client = useSupabaseClient();
      try {
        let map = this.bookmarks.map((bookmark) => bookmark.post_id);
        const { error, data } = await client
          .from("posts")
          .select()
          .in("id", map)
          .order("created_at", { ascending: false });
        // console.log("fetchBookmarkPosts: ", data.value);
        if (data) {
          for (const post of data) {
            if (!this.allPosts.has(post.id)) {
              this.allPosts.set(post.id, post);
            }
            if (!this.getProfile(post.user_id))
              await this.fetchUserProfile(post.user_id);
            if (!this.getAvatar(post.user_id))
              await this.downloadAvatar(
                post.user_id,
                this.userProfile[post.user_id].avatar_url
              );
          }
        }
        if (error) throw error;
      } catch (error) {
        console.log(error.message);
      }
    },
    async fetchBookmarkCount(pid) {
      if (pid) {
        const client = useSupabaseClient();
        try {
          const { error, count } = await client
            .from("bookmark")
            .select("*", { count: "exact" })
            .eq("post_id", pid);
          this.bookmarkCount[pid] = count;
          if (error) throw error;
        } catch (error) {
          console.log(error.message);
        }
      }
    },
    async likePost(pid) {
      const client = useSupabaseClient();
      const user = useSupabaseUser();
      try {
        const { error, data } = await client
          .from("likes")
          .insert({
            post_id: pid,
            user_id: user.value.id,
          })
          .select("post_id")
          .single();
        if (data) {
          this.likes[user.value.id].unshift(data);
          if (this.likeCount[pid]) this.likeCount[pid] += 1;
          else this.likeCount[pid] = 1;
        }
        if (error) return error;
      } catch (error) {
        console.log(error.message);
      }
    },
    async unlikePost(pid) {
      const client = useSupabaseClient();
      const user = useSupabaseUser();
      try {
        const { error } = await client.from("likes").delete().match({
          post_id: pid,
          user_id: user.value.id,
        });
        if (error) return error;
        else {
          this.likes[user.value.id] = this.likes[user.value.id].filter(
            (like) => like.post_id !== pid
          );
          if (this.likeCount[pid]) this.likeCount[pid] -= 1;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async fetchLikes(uid) {
      const client = useSupabaseClient();
      try {
        const { error, data } = await client
          .from("likes")
          .select("post_id")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });

        if (data) this.likes[uid] = data;
        if (error) throw error;
      } catch (error) {
        console.log(error.message);
      }
    },
    async fetchLikePosts(uid) {
      const client = useSupabaseClient();
      try {
        let map = this.likes[uid].map((like) => like.post_id);
        const { error, data } = await client
          .from("posts")
          .select()
          .in("id", map)
          .order("created_at", { ascending: false });

        if (data) {
          for (const post of data) {
            if (!this.allPosts.has(post.id)) {
              this.allPosts.set(post.id, post);
            }
            if (!this.getProfile(post.user_id))
              await this.fetchUserProfile(post.user_id);
            if (!this.getAvatar(post.user_id))
              await this.downloadAvatar(
                post.user_id,
                this.userProfile[post.user_id].avatar_url
              );
          }
        }
        if (error) throw error;
      } catch (error) {
        console.log(error.message);
      }
    },
    async fetchLikeCount(pid) {
      if (pid) {
        const client = useSupabaseClient();
        try {
          const { error, count } = await client
            .from("likes")
            .select("*", { count: "exact" })
            .eq("post_id", pid);
          this.likeCount[pid] = count;
          if (error) throw error;
        } catch (error) {
          console.log(error.message);
        }
      }
    },
    async reply(pid, reply) {
      const user = useSupabaseUser();
      const client = useSupabaseClient();
      try {
        const { error, data } = await client
          .from("reply")
          .insert({
            user_id: user.value.id,
            text: reply,
          })
          .select()
          .single();
        if (data) {
          this.reply[pid].unshift(data);
        }
        if (error) throw error;
      } catch (error) {
        console.log(error.message);
      }
    },
  },
});
