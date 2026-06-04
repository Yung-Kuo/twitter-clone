/**
 * Owns: reply threads, counts, and user reply status. Fetches via queries/api.
 */
import { errMsg } from "~/utils/errMsg";
import type { NewPostInput, PostRow } from "~/queries/api/posts";
import {
  countRepliesForPost,
  fetchAuthorReplyOnPost,
  fetchRepliesByUser,
  fetchRepliesForPost,
  fetchUserRepliedToPost,
  getRepliesClient,
  insertReplyPost,
} from "~/queries/api/replies";
import { usePostStore } from "~/stores/post";

type PostId = string;

export type { NewPostInput as NewReplyInput } from "~/queries/api/posts";

export const useReplyStore = defineStore("reply", {
  state: () => ({
    allReply: new Map<PostId, PostRow>(),
    postReplyId: {} as Record<PostId, PostId[]>,
    replyCount: {} as Record<PostId, number>,
    userHasReplied: {} as Record<PostId, boolean>,
    authorHasReplied: {} as Record<PostId, PostId | null>,
    userReplies: {} as Record<PostId, PostId[]>,
  }),
  getters: {
    getReplies(state) {
      return (pid: PostId) => {
        const filteredReplies: PostRow[] = [];
        if (!state.postReplyId[pid]) return null;
        for (const replyId of state.postReplyId[pid] ?? []) {
          if (state.allReply.has(replyId)) {
            filteredReplies.push(state.allReply.get(replyId)!);
          }
        }
        return filteredReplies.length ? filteredReplies : null;
      };
    },
    getUserReplies(state) {
      return (pid: PostId) => {
        if (!state.userReplies[pid]) return null;
        const filteredReplies: PostRow[] = [];
        for (const replyId of state.userReplies[pid] ?? []) {
          if (state.allReply.has(replyId)) {
            filteredReplies.push(state.allReply.get(replyId)!);
          }
        }
        return filteredReplies;
      };
    },
    getReplyCount(state) {
      return (pid: PostId) => {
        const n = state.replyCount[pid];
        return n != null && n > 0 ? n : null;
      };
    },
    checkReplied(state) {
      return (pid: PostId) => state.userHasReplied[pid] || null;
    },
    checkAuthorReplied(state) {
      return (pid: PostId) => state.authorHasReplied[pid] || null;
    },
  },
  actions: {
    async uploadReply(newReply: NewPostInput) {
      const client = getRepliesClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return false;
      try {
        const { error, data: row } = await insertReplyPost(
          client,
          uid,
          newReply,
        );
        const data = row as PostRow | null;
        if (error) throw error;
        if (data?.reply_to) {
          const replyTo = data.reply_to;
          if (!this.postReplyId[replyTo]) this.postReplyId[replyTo] = [];
          this.allReply.set(data.id, data);
          this.postReplyId[replyTo].unshift(data.id);
          this.userHasReplied[replyTo] = true;
          if (this.replyCount[replyTo]) this.replyCount[replyTo] += 1;
          else this.replyCount[replyTo] = 1;

          const postStore = usePostStore();
          postStore.setReplies([data]);
          await this.fetchAuthorReplyStatus(replyTo);
          return true;
        }
      } catch (error) {
        console.error(errMsg(error));
        return false;
      }
      return false;
    },
    editReply(pid: PostId, data: PostRow) {
      this.allReply.set(pid, data);
    },
    async deleteReply(pid: PostId, reply_to: PostId) {
      this.allReply.delete(pid);
      this.postReplyId[pid] = [];
      const list = this.postReplyId[reply_to];
      if (list)
        this.postReplyId[reply_to] = list.filter((replyId) => replyId !== pid);
      if (this.authorHasReplied[reply_to] === pid) {
        this.authorHasReplied[reply_to] = null;
      }
      await this.fetchUserReplyStatus(reply_to);
      await this.fetchAuthorReplyStatus(reply_to);
      const rc = this.replyCount[reply_to] ?? 0;
      if (rc >= 1) this.replyCount[reply_to] = rc - 1;
    },
    async fetchReplies(pid: PostId) {
      if (pid) {
        const client = getRepliesClient();
        try {
          const { error, data } = await fetchRepliesForPost(client, pid);
          if (data?.length) {
            this.setReplies(data);
            this.postReplyId[pid] = data.map((reply) => reply.id);
          } else {
            this.postReplyId[pid] = [];
          }
          if (error) throw error;
        } catch (error) {
          console.error(errMsg(error));
        }
      }
    },
    async fetchUserReplies(uid: PostId) {
      if (!uid) return;
      const client = getRepliesClient();
      try {
        const { error, data } = await fetchRepliesByUser(client, uid);
        if (data) {
          this.setReplies(data);
          this.userReplies[uid] = data.map((reply) => reply.id);
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    setReplies(data: PostRow[]) {
      const postStore = usePostStore();
      for (const reply of data) {
        this.allReply.set(reply.id, reply);
      }
      postStore.setReplies(data);
    },
    async fetchReplyCount(pid: PostId) {
      if (pid) {
        const client = getRepliesClient();
        try {
          const { error, count } = await countRepliesForPost(client, pid);
          if (count) {
            this.replyCount[pid] = count;
          }
          if (error) throw error;
        } catch (error) {
          console.error(errMsg(error));
        }
      }
    },
    async fetchUserReplyStatus(pid: PostId) {
      if (pid) {
        const client = getRepliesClient();
        const user = useSupabaseUser();
        const uid = user.value?.id;
        if (!uid) return;
        try {
          const { error, data } = await fetchUserRepliedToPost(
            client,
            pid,
            uid,
          );
          this.userHasReplied[pid] = (data?.length ?? 0) > 0;
          if (error) throw error;
        } catch (error) {
          console.error(errMsg(error));
        }
      }
    },
    async fetchAuthorReplyStatus(pid: PostId) {
      if (pid) {
        const client = getRepliesClient();
        let authorId = "";
        if (this.allReply.has(pid)) {
          authorId = this.allReply.get(pid)!.user_id;
        } else {
          const postStore = usePostStore();
          const p = postStore.getPost(pid);
          if (!p) return;
          authorId = p.user_id;
        }
        try {
          const { error, data } = await fetchAuthorReplyOnPost(
            client,
            pid,
            authorId,
          );
          if (data?.length) {
            const rows = data as PostRow[];
            this.setReplies(rows);
            this.authorHasReplied[pid] = rows[0]!.id;
          }
          if (error) throw error;
        } catch (error) {
          console.error(errMsg(error));
        }
      }
    },
    clearReplies() {
      this.userHasReplied = {};
      this.userReplies = {};
    },
  },
});
