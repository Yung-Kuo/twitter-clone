import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import { POST_COLUMNS, PROFILE_COLUMNS, REPLY_TABLE_COLUMNS } from "~/types/supabase-select";
import { errMsg } from "~/utils/errMsg";
import { useFollowingStore } from "~/stores/following";
import { useReplyStore } from "~/stores/reply";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ReplyRow = Database["public"]["Tables"]["reply"]["Row"];
type BookmarkPick = Pick<Database["public"]["Tables"]["bookmark"]["Row"], "post_id">;
type LikePick = Pick<Database["public"]["Tables"]["likes"]["Row"], "post_id">;
type PostId = string;
type UserId = string;

type NewPostInput = Pick<
  PostRow,
  "text" | "pictures" | "reply_to" | "type"
>;

type PostEdit = Pick<PostRow, "id" | "text">;

export const usePostStore = defineStore("post", {
  state: () => ({
    userPosts: {} as Record<UserId, PostId[]>,
    allPosts: new Map<PostId, PostRow>(),
    allPostId: [] as PostId[],
    userAvatars: {} as Record<UserId, string>,
    userProfile: {} as Record<UserId, ProfileRow>,
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
        if (n != null && n > 0) return n;
        return null;
      };
    },
    getAvatarUrl(state) {
      return (uid: UserId) => state.userProfile[uid]?.avatar_url;
    },
    getAvatar(state) {
      return (uid: UserId) => state.userAvatars[uid];
    },
    getUsername(state) {
      return (uid: UserId) => state.userProfile[uid]?.username;
    },
    getName(state) {
      return (uid: UserId) => {
        if (!uid) return null;
        const p = state.userProfile[uid];
        if (!p) return null;
        return `${p.first_name} ${p.last_name}`;
      };
    },
    getProfile(state) {
      return (uid: UserId) => state.userProfile[uid];
    },
    getProfileList(state) {
      return state.userProfile;
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
      const client = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return false;
      try {
        const { error, data } = await client
          .from("posts")
          .insert({
            user_id: uid,
            text: newPost.text,
            pictures: newPost.pictures,
            reply_to: newPost.reply_to,
            type: newPost.type,
          })
          .select(POST_COLUMNS)
          .single();
        if (error) throw error;
        else if (data) {
          this.allPosts.set(data.id, data);
          this.allPostId.unshift(data.id);
          if (!this.userPosts[uid]) {
            this.userPosts[uid] = [];
          }
          this.userPosts[uid].unshift(data.id);
          this.followingPid.unshift(data.id);
          const username = this.getUsername(uid);
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
      const client = useSupabaseClient<Database>();
      try {
        const { error, data } = await client
          .from("posts")
          .update({ text: edit.text, edited: true })
          .eq("id", edit.id)
          .select(POST_COLUMNS)
          .single();
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
      const client = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return false;
      try {
        const { error } = await client.from("posts").delete().match({
          id: pid,
          user_id: uid,
        });
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
      for (const post of posts) {
        if (!this.allPostId.find((p) => p === post.id))
          this.allPostId.push(post.id);
        if (!this.allPosts.has(post.id)) {
          this.allPosts.set(post.id, post);
        }
        if (!this.getProfile(post.user_id))
          await this.fetchUserProfile(post.user_id, supabase);
        const prof = this.userProfile[post.user_id];
        if (!this.getAvatar(post.user_id) && prof?.avatar_url)
          await this.downloadAvatar(
            post.user_id,
            prof.avatar_url,
            supabase,
          );
      }
    },
    setReplies(posts: PostRow[]) {
      for (const post of posts) {
        if (!this.allPosts.has(post.id)) {
          this.allPosts.set(post.id, post);
        }
      }
    },
    async fetchUserPosts(uid: UserId) {
      const client = useSupabaseClient<Database>();
      if (!uid) return;
      try {
        const { error, data } = await client
          .from("posts")
          .select(POST_COLUMNS)
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
          await this.setPosts(data, client);
          await this.fetchUserProfile(uid, client);
        }
        if (error) throw error;
      } catch (error) {
        console.error("error: ", errMsg(error));
      }
    },
    async fetchAllPosts() {
      const client = useSupabaseClient<Database>();
      try {
        const { error, data } = await client
          .from("posts")
          .select(POST_COLUMNS)
          .in("type", ["post", "repost"])
          .order("created_at", { ascending: false });

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
      const client = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      const followingStore = useFollowingStore();
      await followingStore.fetchFollowing(uid);
      const following_id = [...(followingStore.getFollowing(uid) ?? [])];
      following_id.push(uid);
      if (following_id.length > 0) {
        try {
          const { error, data } = await client
            .from("posts")
            .select(POST_COLUMNS)
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
              await this.fetchUserProfile(post.user_id, client);
              const prof = this.userProfile[post.user_id];
              if (prof?.avatar_url)
                await this.downloadAvatar(
                  post.user_id,
                  prof.avatar_url,
                  client,
                );
            }
          }
          if (error) throw error;
        } catch (error) {
          console.error("error: ", errMsg(error));
        }
      }
    },
    async fetchOnePost(pid: PostId) {
      const client = useSupabaseClient<Database>();
      try {
        const { error, data } = await client
          .from("posts")
          .select(POST_COLUMNS)
          .eq("id", pid)
          .single();
        if (data) {
          const post = data;
          if (!this.allPosts.has(post.id)) {
            this.allPosts.set(post.id, post);
          }
          if (!this.getProfile(post.user_id))
            await this.fetchUserProfile(post.user_id, client);
          const prof = this.userProfile[post.user_id];
          if (!this.getAvatar(post.user_id) && prof?.avatar_url)
            await this.downloadAvatar(
              post.user_id,
              prof.avatar_url,
              client,
            );
        }
        if (error) throw error;
      } catch (error) {
        console.error("error: ", errMsg(error));
      }
    },
    async fetchQuotes(pid: PostId) {
      const client = useSupabaseClient<Database>();
      try {
        const { error, data } = await client
          .from("posts")
          .select(POST_COLUMNS)
          .eq("type", "repost")
          .eq("reply_to", pid)
          .neq("text", pid)
          .order("created_at", { ascending: false });

        if (data?.length) {
          this.quotes[pid] = data.map((post) => post.id);
          for (const post of data) {
            if (!this.allPosts.has(post.id)) {
              this.allPosts.set(post.id, post);
            }
            if (!this.getProfile(post.user_id))
              await this.fetchUserProfile(post.user_id, client);
            const prof = this.userProfile[post.user_id];
            if (!this.getAvatar(post.user_id) && prof?.avatar_url)
              await this.downloadAvatar(
                post.user_id,
                prof.avatar_url,
                client,
              );
          }
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchReposts(pid: PostId) {
      const client = useSupabaseClient<Database>();
      try {
        const { error, data } = await client
          .from("posts")
          .select(POST_COLUMNS)
          .eq("type", "repost")
          .eq("reply_to", pid)
          .eq("text", pid)
          .order("created_at", { ascending: false });

        if (data?.length) {
          this.reposts[pid] = data.map((post) => post.id);
          for (const post of data) {
            if (!this.allPosts.has(post.id)) {
              this.allPosts.set(post.id, post);
            }
            if (!this.getProfile(post.user_id))
              await this.fetchUserProfile(post.user_id, client);
            const prof = this.userProfile[post.user_id];
            if (!this.getAvatar(post.user_id) && prof?.avatar_url)
              await this.downloadAvatar(
                post.user_id,
                prof.avatar_url,
                client,
              );
          }
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchRepostCount(pid: PostId) {
      if (!pid) return;
      const client = useSupabaseClient<Database>();
      try {
        const { count, error } = await client
          .from("posts")
          .select("*", { count: "exact", head: true })
          .eq("reply_to", pid)
          .eq("type", "repost");
        if (count) this.repostCount[pid] = count;
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async downloadAvatar(
      uid: UserId,
      url: string,
      client?: SupabaseClient<Database>,
    ) {
      const supabase = client ?? useSupabaseClient<Database>();
      if (!url) return;
      if (!this.userAvatars[uid]) {
        try {
          const { data, error } = await supabase.storage
            .from("avatars")
            .download(url);
          if (error) throw error;
          if (data) this.userAvatars[uid] = URL.createObjectURL(data);
        } catch (error) {
          console.error(errMsg(error));
        }
      }
    },
    async fetchProfiles() {
      const client = useSupabaseClient<Database>();
      try {
        const { error, data } = await client
          .from("profiles")
          .select(PROFILE_COLUMNS);
        if (data) {
          for (const profile of data) {
            this.userProfile[profile.id] = profile;
          }
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchUserProfile(
      uid: UserId,
      client?: SupabaseClient<Database>,
    ) {
      const supabase = client ?? useSupabaseClient<Database>();
      if (!this.userProfile[uid] && uid) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select(PROFILE_COLUMNS)
            .eq("id", uid)
            .single();
          if (error) throw error;
          if (data) this.userProfile[uid] = data;
        } catch (error) {
          console.error(errMsg(error));
        }
      }
    },
    setProfile(profile: ProfileRow) {
      this.userProfile[profile.id] = profile;
    },
    async bookmarkPost(pid: PostId) {
      const client = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error, data } = await client
          .from("bookmark")
          .insert({
            post_id: pid,
            user_id: uid,
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
        console.error(errMsg(error));
      }
    },
    async unbookmarkPost(pid: PostId) {
      const client = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error } = await client.from("bookmark").delete().match({
          post_id: pid,
          user_id: uid,
        });
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
      const client = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error, data } = await client
          .from("bookmark")
          .select("post_id")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });
        if (data) this.bookmarks = data;
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchBookmarkPosts() {
      const client = useSupabaseClient<Database>();
      try {
        const map: PostId[] = [];
        for (const bookmark of this.bookmarks) {
          if (!this.getPost(bookmark.post_id)) {
            map.push(bookmark.post_id);
          }
        }
        if (map.length === 0) return;
        const { error, data } = await client
          .from("posts")
          .select(POST_COLUMNS)
          .in("id", map)
          .order("created_at", { ascending: false });
        if (data) {
          for (const post of data) {
            if (!this.allPosts.has(post.id)) {
              this.allPosts.set(post.id, post);
            }
            if (!this.getProfile(post.user_id))
              await this.fetchUserProfile(post.user_id, client);
            const prof = this.userProfile[post.user_id];
            if (!this.getAvatar(post.user_id) && prof?.avatar_url)
              await this.downloadAvatar(
                post.user_id,
                prof.avatar_url,
                client,
              );
          }
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchBookmarkCount(pid: PostId) {
      if (pid) {
        const client = useSupabaseClient<Database>();
        try {
          const { error, count } = await client
            .from("bookmark")
            .select("*", { count: "exact", head: true })
            .eq("post_id", pid);
          if (count != null) this.bookmarkCount[pid] = count;
          if (error) throw error;
        } catch (error) {
          console.error(errMsg(error));
        }
      }
    },
    async likePost(pid: PostId) {
      const client = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error, data } = await client
          .from("likes")
          .insert({
            post_id: pid,
            user_id: uid,
          })
          .select("post_id")
          .single();
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
      const client = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error } = await client.from("likes").delete().match({
          post_id: pid,
          user_id: uid,
        });
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
      const client = useSupabaseClient<Database>();
      try {
        const { error, data } = await client
          .from("likes")
          .select("post_id")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });

        if (data) this.likes[uid] = data;
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchLikePosts(uid: UserId) {
      const client = useSupabaseClient<Database>();
      if (!this.likes[uid]) return;
      try {
        const map: PostId[] = [];
        for (const like of this.likes[uid] ?? []) {
          if (!this.getPost(like.post_id)) {
            map.push(like.post_id);
          }
        }
        if (map.length === 0) return;
        const { error, data } = await client
          .from("posts")
          .select(POST_COLUMNS)
          .in("id", map)
          .order("created_at", { ascending: false });

        if (data) {
          for (const post of data) {
            if (!this.allPosts.has(post.id)) {
              this.allPosts.set(post.id, post);
            }
            if (!this.getProfile(post.user_id))
              await this.fetchUserProfile(post.user_id, client);
            const prof = this.userProfile[post.user_id];
            if (!this.getAvatar(post.user_id) && prof?.avatar_url)
              await this.downloadAvatar(
                post.user_id,
                prof.avatar_url,
                client,
              );
          }
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchLikeCount(pid: PostId) {
      if (pid) {
        const client = useSupabaseClient<Database>();
        try {
          const { error, count } = await client
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", pid);
          if (count != null) this.likeCount[pid] = count;
          if (error) throw error;
        } catch (error) {
          console.error(errMsg(error));
        }
      }
    },
    async reply(pid: PostId, text: string) {
      const user = useSupabaseUser();
      const client = useSupabaseClient<Database>();
      const uid = user.value?.id;
      if (!uid) return;
      try {
        const { error, data } = await client
          .from("reply")
          .insert({
            user_id: uid,
            text,
          })
          .select(REPLY_TABLE_COLUMNS)
          .single();
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
