/**
 * Owns: posts, feeds, likes, bookmarks, reposts, quotes — not profiles (see stores/profile.ts).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import {
  countBookmarks,
  countLikes,
  countReposts,
  deleteBookmark,
  deleteLike,
  deletePostRow,
  fetchAllFeedPosts,
  fetchBookmarksForUser,
  fetchLikesForUser,
  fetchPostById,
  fetchPostsByIds,
  fetchPostsByUser,
  fetchPostsByUserIds,
  fetchQuotesForPost,
  fetchRepostsForPost,
  getPostsClient,
  insertBookmark,
  insertLike,
  insertPost,
  insertReplyTableRow,
  updatePostRow,
  type BookmarkPick,
  type LikePick,
  type NewPostInput,
  type PostEdit,
  type PostRow,
  type ReplyRow,
} from "~/queries/api/posts";
import { errMsg } from "~/utils/errMsg";
import { useFollowingStore } from "~/stores/following";
import { useProfileStore } from "~/stores/profile";
import { useReplyStore } from "~/stores/reply";

type PostId = string;

const postFetchesInFlight = new Map<PostId, Promise<void>>();
type UserId = string;

export const usePostStore = defineStore("post", {
  state: () => ({
    userPosts: {} as Record<UserId, PostId[]>,
    allPosts: new Map<PostId, PostRow>(),
    allPostId: [] as PostId[],
    followingPid: [] as PostId[],
    bookmarks: [] as BookmarkPick[],
    bookmarkCount: {} as Record<PostId, number>,
    likes: {} as Record<UserId, LikePick[]>,
    likeCount: {} as Record<PostId, number>,
    reply: {} as Record<PostId, ReplyRow[]>,
    quotes: {} as Record<PostId, PostId[]>,
    reposts: {} as Record<PostId, PostId[]>,
    repostCount: {} as Record<PostId, number>,
  }),
  getters: {
    getPost(state) {
      return (pid: PostId) => state.allPosts.get(pid) ?? null;
    },
    getAllPosts(state) {
      const filteredPosts: PostRow[] = [];
      for (const pid of state.allPostId) {
        if (state.allPosts.has(pid)) {
          filteredPosts.push(state.allPosts.get(pid)!);
        }
      }
      return filteredPosts;
    },
    getFollowingPosts(state) {
      const filteredPosts: PostRow[] = [];
      for (const pid of state.followingPid) {
        if (state.allPosts.has(pid)) {
          filteredPosts.push(state.allPosts.get(pid)!);
        }
      }
      return filteredPosts;
    },
    getUserPosts(state) {
      return (uid: UserId) => {
        const filteredPosts: PostRow[] = [];
        if (!state.userPosts[uid]) return null;
        for (const pid of state.userPosts[uid] ?? []) {
          if (filteredPosts.find((post) => post.id === pid)) continue;
          if (state.allPosts.has(pid)) {
            filteredPosts.push(state.allPosts.get(pid)!);
          }
        }
        return filteredPosts;
      };
    },
    getQuotes(state) {
      return (pid: PostId) => {
        const filteredPosts: PostRow[] = [];
        if (!state.quotes[pid]) return [];
        for (const quote of state.quotes[pid] ?? []) {
          if (state.allPosts.has(quote)) {
            filteredPosts.push(state.allPosts.get(quote)!);
          }
        }
        return filteredPosts;
      };
    },
    getReposts(state) {
      return (pid: PostId) => {
        const filteredPosts: PostRow[] = [];
        if (!state.reposts[pid]) return [];
        for (const repost of state.reposts[pid] ?? []) {
          if (state.allPosts.has(repost)) {
            filteredPosts.push(state.allPosts.get(repost)!);
          }
        }
        return filteredPosts;
      };
    },
    getRepostCount(state) {
      return (pid: PostId) => {
        const n = state.repostCount[pid];
        if (n != null) return n;
        return null;
      };
    },
    getBookmarks(state) {
      return state.bookmarks;
    },
    getBookmarkPosts(state) {
      const filteredPosts: PostRow[] = [];
      for (const bookmark of state.bookmarks) {
        if (state.allPosts.has(bookmark.post_id)) {
          filteredPosts.push(state.allPosts.get(bookmark.post_id)!);
        }
      }
      return filteredPosts;
    },
    getBookmarkCount(state) {
      return (pid: PostId) => state.bookmarkCount[pid] ?? null;
    },
    checkBookmark(state) {
      return (pid: PostId) =>
        !!state.bookmarks.find((bookmark) => bookmark.post_id === pid);
    },
    getLikes(state) {
      return (uid: UserId) => state.likes[uid];
    },
    getLikePosts(state) {
      return (uid: UserId) => {
        if (!state.likes[uid]) return null;
        const filteredPosts: PostRow[] = [];
        for (const like of state.likes[uid] ?? []) {
          if (state.allPosts.has(like.post_id)) {
            filteredPosts.push(state.allPosts.get(like.post_id)!);
          }
        }
        return filteredPosts;
      };
    },
    getLikeCount(state) {
      return (pid: PostId) => state.likeCount[pid] ?? null;
    },
    checkLike(state) {
      return (pid: PostId) => {
        const user = useSupabaseUser();
        const id = user.value?.id;
        if (!id) return false;
        return !!state.likes[id]?.find((like) => like.post_id === pid);
      };
    },
  },
  actions: {
    async uploadPost(newPost: NewPostInput) {
      const client = getPostsClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return false;
      try {
        const { error, data } = await insertPost(client, uid, newPost);
        if (error) throw error;
        else if (data) {
          this.allPosts.set(data.id, data);
          this.allPostId.unshift(data.id);
          if (!this.userPosts[uid]) {
            this.userPosts[uid] = [];
          }
          this.userPosts[uid].unshift(data.id);
          this.followingPid.unshift(data.id);
          const profileStore = useProfileStore();
          const username = profileStore.usernameById(uid);
          const newPostAddress = `/${username}/post/${data.id}`;
          return newPostAddress;
        }
      } catch (error) {
        console.error(`error message: ${errMsg(error)}`);
        return false;
      }
      return false;
    },
    async updatePost(edit: PostEdit) {
      const client = getPostsClient();
      try {
        const { error, data } = await updatePostRow(client, edit);
        if (error) throw error;
        if (data) {
          this.allPosts.set(data.id, data);
          if (data.type === "reply" && data.reply_to) {
            const replyStore = useReplyStore();
            replyStore.editReply(edit.id, data);
          }
          return true;
        }
      } catch (error) {
        console.error(errMsg(error));
        return false;
      }
      return false;
    },
    async deletePost(pid: PostId) {
      const deleteThis = this.allPosts.get(pid);
      if (!deleteThis) return false;
      const replyStore = useReplyStore();
      const client = getPostsClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return false;
      try {
        const { error } = await deletePostRow(client, pid, uid);
        if (error) throw error;
        else {
          this.allPosts.delete(pid);
          if (deleteThis.type === "reply" && deleteThis.reply_to)
            await replyStore.deleteReply(pid, deleteThis.reply_to);
          return true;
        }
      } catch (error) {
        console.error(errMsg(error));
        return false;
      }
    },
    async setPosts(posts: PostRow[], client?: SupabaseClient<Database>) {
      const supabase = client ?? useSupabaseClient<Database>();
      const profileStore = useProfileStore();
      for (const post of posts) {
        if (!this.allPostId.find((p) => p === post.id))
          this.allPostId.push(post.id);
        if (!this.allPosts.has(post.id)) {
          this.allPosts.set(post.id, post);
        }
      }
      await profileStore.ensureAuthorsForPosts(posts, supabase);
    },
    setReplies(posts: PostRow[]) {
      for (const post of posts) {
        if (!this.allPosts.has(post.id)) {
          this.allPosts.set(post.id, post);
        }
      }
    },
    async fetchUserPosts(uid: UserId) {
      const client = getPostsClient();
      if (!uid) return;
      try {
        const { error, data } = await fetchPostsByUser(client, uid);

        if (data) {
          for (const post of data) {
            if (!this.userPosts[uid]) {
              this.userPosts[uid] = [];
            }
            this.userPosts[uid].push(post.id);
          }
          await this.setPosts(data, client);
          await useProfileStore().fetchUserProfile(uid, client);
        }
        if (error) throw error;
      } catch (error) {
        console.error("error: ", errMsg(error));
      }
    },
    async fetchAllPosts() {
      const client = getPostsClient();
      try {
        const { error, data } = await fetchAllFeedPosts(client);

        if (data) {
          this.allPostId = [];
          await this.setPosts(data, client);
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchFollowingPosts() {
      const client = getPostsClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      const followingStore = useFollowingStore();
      await followingStore.fetchFollowing(uid);
      const following_id = [...(followingStore.getFollowing(uid) ?? [])];
      following_id.push(uid);
      if (following_id.length > 0) {
        try {
          const { error, data } = await fetchPostsByUserIds(
            client,
            following_id,
          );

          if (data) {
            this.followingPid = [];
            for (const post of data) {
              this.followingPid.push(post.id);
              if (!this.allPosts.has(post.id)) {
                this.allPosts.set(post.id, post);
              }
            }
            await useProfileStore().ensureAuthorsForPosts(data, client);
          }
          if (error) throw error;
        } catch (error) {
          console.error("error: ", errMsg(error));
        }
      }
    },
    async fetchOnePost(pid: PostId) {
      if (!pid || this.allPosts.has(pid)) return;
      const inFlight = postFetchesInFlight.get(pid);
      if (inFlight) return inFlight;

      const client = getPostsClient();
      const task = (async () => {
        try {
          if (this.allPosts.has(pid)) return;
          const { error, data } = await fetchPostById(client, pid);
          if (data) {
            if (!this.allPosts.has(data.id)) {
              this.allPosts.set(data.id, data);
            }
            await useProfileStore().ensureAuthorsForPosts([data], client);
          }
          if (error) throw error;
        } catch (error) {
          console.error("error: ", errMsg(error));
        } finally {
          postFetchesInFlight.delete(pid);
        }
      })();
      postFetchesInFlight.set(pid, task);
      return task;
    },
    async fetchQuotes(pid: PostId) {
      const client = getPostsClient();
      try {
        const { error, data } = await fetchQuotesForPost(client, pid);

        if (data?.length) {
          this.quotes[pid] = data.map((post) => post.id);
          for (const post of data) {
            if (!this.allPosts.has(post.id)) {
              this.allPosts.set(post.id, post);
            }
          }
          await useProfileStore().ensureAuthorsForPosts(data, client);
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchReposts(pid: PostId) {
      const client = getPostsClient();
      try {
        const { error, data } = await fetchRepostsForPost(client, pid);

        if (data?.length) {
          this.reposts[pid] = data.map((post) => post.id);
          for (const post of data) {
            if (!this.allPosts.has(post.id)) {
              this.allPosts.set(post.id, post);
            }
          }
          await useProfileStore().ensureAuthorsForPosts(data, client);
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchRepostCount(pid: PostId) {
      if (!pid) return;
      const client = getPostsClient();
      try {
        const { count, error } = await countReposts(client, pid);
        if (count) this.repostCount[pid] = count;
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async bookmarkPost(pid: PostId) {
      const client = getPostsClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error, data } = await insertBookmark(client, pid, uid);
        if (data) {
          this.bookmarks.unshift(data);
          if (this.bookmarkCount[pid]) this.bookmarkCount[pid] += 1;
          else this.bookmarkCount[pid] = 1;
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async unbookmarkPost(pid: PostId) {
      const client = getPostsClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error } = await deleteBookmark(client, pid, uid);
        if (error) throw error;
        else {
          this.bookmarks = this.bookmarks.filter(
            (bookmark) => bookmark.post_id !== pid,
          );
          if (this.bookmarkCount[pid]) this.bookmarkCount[pid] -= 1;
        }
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchBookmarks() {
      const client = getPostsClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error, data } = await fetchBookmarksForUser(client, uid);
        if (data) this.bookmarks = data;
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchBookmarkPosts() {
      const client = getPostsClient();
      try {
        const map: PostId[] = [];
        for (const bookmark of this.bookmarks) {
          if (!this.getPost(bookmark.post_id)) {
            map.push(bookmark.post_id);
          }
        }
        if (map.length === 0) return;
        const { error, data } = await fetchPostsByIds(client, map);
        if (data) {
          for (const post of data) {
            if (!this.allPosts.has(post.id)) {
              this.allPosts.set(post.id, post);
            }
          }
          await useProfileStore().ensureAuthorsForPosts(data, client);
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchBookmarkCount(pid: PostId) {
      if (pid) {
        const client = getPostsClient();
        try {
          const { error, count } = await countBookmarks(client, pid);
          if (count != null) this.bookmarkCount[pid] = count;
          if (error) throw error;
        } catch (error) {
          console.error(errMsg(error));
        }
      }
    },
    async likePost(pid: PostId) {
      const client = getPostsClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error, data } = await insertLike(client, pid, uid);
        if (data) {
          if (!this.likes[uid]) this.likes[uid] = [];
          this.likes[uid].unshift(data);
          if (this.likeCount[pid]) this.likeCount[pid] += 1;
          else this.likeCount[pid] = 1;
        }
        if (error) return error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async unlikePost(pid: PostId) {
      const client = getPostsClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error } = await deleteLike(client, pid, uid);
        if (error) return error;
        else {
          if (!this.likes[uid]) this.likes[uid] = [];
          this.likes[uid] = this.likes[uid].filter(
            (like) => like.post_id !== pid,
          );
          if (this.likeCount[pid]) this.likeCount[pid] -= 1;
        }
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchLikes(uid: UserId) {
      const client = getPostsClient();
      try {
        const { error, data } = await fetchLikesForUser(client, uid);

        if (data) this.likes[uid] = data;
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchLikePosts(uid: UserId) {
      const client = getPostsClient();
      if (!this.likes[uid]) return;
      try {
        const map: PostId[] = [];
        for (const like of this.likes[uid] ?? []) {
          if (!this.getPost(like.post_id)) {
            map.push(like.post_id);
          }
        }
        if (map.length === 0) return;
        const { error, data } = await fetchPostsByIds(client, map);

        if (data) {
          for (const post of data) {
            if (!this.allPosts.has(post.id)) {
              this.allPosts.set(post.id, post);
            }
          }
          await useProfileStore().ensureAuthorsForPosts(data, client);
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchLikeCount(pid: PostId) {
      if (pid) {
        const client = getPostsClient();
        try {
          const { error, count } = await countLikes(client, pid);
          if (count != null) this.likeCount[pid] = count;
          if (error) throw error;
        } catch (error) {
          console.error(errMsg(error));
        }
      }
    },
    async reply(pid: PostId, text: string) {
      const user = useSupabaseUser();
      const client = getPostsClient();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error, data } = await insertReplyTableRow(client, uid, text);
        if (data) {
          if (!this.reply[pid]) this.reply[pid] = [];
          this.reply[pid].unshift(data);
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    clearBookmarks() {
      this.bookmarks = [];
    },
  },
});
