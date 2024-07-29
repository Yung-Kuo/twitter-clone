import { usePostStore } from "~/stores/post";
export const useReplyStore = defineStore({
  id: "reply",
  state: () => ({
    allReply: new Map(),
    postReplyId: {},
    replyCount: {},
    userHasReplied: {},
    authorHasReplied: {},
    userReplies: {},
  }),
  getters: {
    getReplies(state) {
      return (pid) => {
        const filteredReplies = [];
        if (!state.postReplyId[pid]) return null;
        for (const replyId of state.postReplyId[pid]) {
          if (state.allReply.has(replyId)) {
            filteredReplies.push(state.allReply.get(replyId));
          }
        }
        return filteredReplies;
      };
    },
    getUserReplies(state) {
      return (pid) => {
        const filteredReplies = [];
        if (!state.userReplies[pid]) return null;
        for (const replyId of state.userReplies[pid]) {
          if (state.allReply.has(replyId)) {
            filteredReplies.push(state.allReply.get(replyId));
          }
        }
        return filteredReplies;
      };
    },
    getReplyCount(state) {
      return (pid) =>
        state.replyCount[pid] > 0 ? state.replyCount[pid] : null;
    },
    checkReplied(state) {
      return (pid) => state.userHasReplied[pid] || false;
    },
    checkAuthorReplied(state) {
      return (pid) => state.authorHasReplied[pid] || false;
    },
  },
  actions: {
    async uploadReply(newReply) {
      const client = useSupabaseClient();
      const user = useSupabaseUser();
      try {
        const { error, data } = await client
          .from("posts")
          .insert({
            user_id: user.value.id,
            text: newReply.text,
            pictures: newReply.pictures,
            reply_to: newReply.reply_to,
            type: newReply.type,
          })
          .select()
          .single();
        if (data) {
          if (!this.postReplyId[data.reply_to])
            this.postReplyId[data.reply_to] = [];
          // store reply
          this.allReply.set(data.id, data);
          // store id into post's reply list
          // use reply_to as key
          this.postReplyId[data.reply_to].unshift(data.id);
          // user has replied & reply count
          this.userHasReplied[data.reply_to] = true;
          if (this.replyCount[data.reply_to])
            this.replyCount[data.reply_to] += 1;
          else this.replyCount[data.reply_to] = 1;

          // update the postStore
          // setReplies deals with list, thus [data]
          const postStore = usePostStore();
          postStore.setReplies([data]);
          await this.fetchAuthorReplyStatus(data.reply_to);
          return true;
        }
        if (error) throw error;
      } catch (error) {
        console.log(error.message);
        return false;
      }
    },
    editReply(pid, data) {
      this.allReply.set(pid, data);
    },
    async deleteReply(pid, reply_to) {
      // assume postStore.deletePost(pid) could do the job
      this.allReply.delete(pid);
      this.postReplyId[pid] = [];
      this.postReplyId[reply_to] = this.postReplyId[reply_to].filter(
        (replyId) => replyId !== pid
      );
      if (this.authorHasReplied[reply_to] === pid) {
        this.authorHasReplied[reply_to] = null;
      }
      await this.fetchUserReplyStatus(reply_to);
      await this.fetchAuthorReplyStatus(reply_to);
      if (this.replyCount[reply_to] >= 1) this.replyCount[reply_to] -= 1;
    },
    async fetchReplies(pid) {
      if (pid) {
        const client = useSupabaseClient();
        try {
          const { error, data } = await client
            .from("posts")
            .select()
            .eq("type", "reply")
            .eq("reply_to", pid)
            .order("created_at", { ascending: true });
          if (data.length) {
            this.setReplies(data);
            this.postReplyId[pid] = data.map((reply) => reply.id);
          } else {
            this.postReplyId[pid] = [];
          }
          if (error) throw error;
        } catch (error) {
          console.log(error.message);
        }
      }
    },
    async fetchUserReplies(uid) {
      if (uid) {
        const client = useSupabaseClient();
        try {
          const { error, data } = await client
            .from("posts")
            .select()
            .eq("type", "reply")
            .eq("user_id", uid)
            .order("created_at", { ascending: false });
          if (data) {
            this.setReplies(data);
            this.userReplies[uid] = data.map((reply) => reply.id);
          }
          if (error) throw error;
        } catch (error) {
          console.log(error.message);
        }
      }
    },
    setReplies(data) {
      const postStore = usePostStore();
      for (const reply of data) {
        this.allReply.set(reply.id, reply);
      }
      postStore.setReplies(data);
    },
    async fetchReplyCount(pid) {
      if (pid) {
        const client = useSupabaseClient();
        try {
          const { error, count } = await client
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("reply_to", pid)
            .eq("type", "reply");
          if (count) {
            this.replyCount[pid] = count;
          }
          if (error) throw error;
        } catch (error) {
          console.log(error.message);
        }
      }
    },
    async fetchUserReplyStatus(pid) {
      if (pid) {
        const client = useSupabaseClient();
        const user = useSupabaseUser();
        try {
          const { error, data } = await client
            .from("posts")
            .select("id")
            .eq("type", "reply")
            .eq("reply_to", pid)
            .eq("user_id", user.value.id)
            .limit(1);
          if (data.length) this.userHasReplied[pid] = true;
          else this.userHasReplied[pid] = false;
          if (error) throw error;
        } catch (error) {}
      }
    },
    async fetchAuthorReplyStatus(pid) {
      if (pid) {
        const client = useSupabaseClient();
        let authorId = "";
        if (this.allReply.has(pid)) {
          authorId = this.allReply.get(pid).user_id;
        } else {
          const postStore = usePostStore();
          authorId = postStore.getPost(pid).user_id;
        }
        try {
          const { error, data } = await client
            .from("posts")
            .select("*")
            .eq("reply_to", pid)
            .eq("user_id", authorId)
            .order("created_at")
            .limit(1);
          if (data.length) {
            this.setReplies(data);
            this.authorHasReplied[pid] = data[0].id;
            // return data[0].id;
          }
          if (error) throw error;
        } catch (error) {}
      }
    },
  },
});
