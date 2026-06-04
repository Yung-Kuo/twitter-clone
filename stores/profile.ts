/**
 * Owns: profiles by user id, avatar blobs, current-user profile edit/fetch.
 * Does not own: posts, likes, bookmarks (see stores/post.ts).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import type { PostRow } from "~/queries/api/posts";
import {
  downloadAvatarBlob,
  removeAvatarFile,
  uploadAvatarFile,
} from "~/queries/api/avatars";
import {
  fetchAllProfiles,
  fetchProfileById,
  fetchProfileByUsername,
  getProfilesClient,
  upsertProfile,
  type ProfileRow,
  type ProfileUpdatePayload,
} from "~/queries/api/profiles";
import { errMsg } from "~/utils/errMsg";

type UserId = string;

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profiles: {} as Record<UserId, ProfileRow>,
    avatarByUserId: {} as Record<UserId, string>,
    profile: null as ProfileRow | null,
    avatar_src: "",
    loading: false,
    error: null as string | null,
  }),
  getters: {
    currentProfile(state) {
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return state.profile;
      return state.profiles[uid] ?? state.profile;
    },
    getProfile: (state) => state.profile,
    getProfileList: (state) => state.profiles,
    getUsername: (state) => state.profile?.username ?? null,
    getName: (state) => {
      if (!state.profile) return null;
      return `${state.profile.first_name} ${state.profile.last_name}`;
    },
    getAvatar: (state) => state.avatar_src || null,
    getAvatarUrl: (state) => state.profile?.avatar_url ?? null,
    profileById: (state) => (uid: UserId) => state.profiles[uid],
    usernameById: (state) => (uid: UserId) => state.profiles[uid]?.username,
    nameById: (state) => (uid: UserId) => {
      const p = state.profiles[uid];
      if (!p) return null;
      return `${p.first_name} ${p.last_name}`;
    },
    avatarUrlById: (state) => (uid: UserId) => state.profiles[uid]?.avatar_url,
    avatarById: (state) => (uid: UserId) => state.avatarByUserId[uid],
    noProfile: (state) => !state.profile,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
  actions: {
    cacheProfile(profile: ProfileRow) {
      this.profiles[profile.id] = profile;
      const user = useSupabaseUser();
      if (user.value?.id === profile.id) {
        this.profile = profile;
      }
    },
    async fetchUserProfile(
      uid: UserId,
      client?: SupabaseClient<Database>,
    ) {
      const supabase = client ?? getProfilesClient();
      if (!uid || this.profiles[uid]) return;
      try {
        const { data, error } = await fetchProfileById(supabase, uid);
        if (error) throw error;
        if (data) this.cacheProfile(data);
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async fetchProfiles() {
      const client = getProfilesClient();
      try {
        const { error, data } = await fetchAllProfiles(client);
        if (data) {
          for (const profile of data) {
            this.cacheProfile(profile);
          }
        }
        if (error) throw error;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async downloadAvatarForUser(
      uid: UserId,
      url: string,
      client?: SupabaseClient<Database>,
    ) {
      const supabase = client ?? getProfilesClient();
      if (!url || this.avatarByUserId[uid]) return;
      try {
        const { data, error } = await downloadAvatarBlob(supabase, url);
        if (error) throw error;
        if (data) this.avatarByUserId[uid] = URL.createObjectURL(data);
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async ensureAuthorsForPosts(
      posts: PostRow[],
      client?: SupabaseClient<Database>,
    ) {
      const supabase = client ?? getProfilesClient();
      for (const post of posts) {
        if (!this.profileById(post.user_id)) {
          await this.fetchUserProfile(post.user_id, supabase);
        }
        const prof = this.profiles[post.user_id];
        if (!this.avatarById(post.user_id) && prof?.avatar_url) {
          await this.downloadAvatarForUser(
            post.user_id,
            prof.avatar_url,
            supabase,
          );
        }
      }
    },
    async fetchOtherProfile(username: string | null = null) {
      if (username == null) return;
      const client = getProfilesClient();
      this.loading = true;
      try {
        const { error, data } = await fetchProfileByUsername(
          client,
          username,
        );
        if (error) throw error;
        if (data) {
          this.cacheProfile(data);
          return data;
        }
      } catch (error) {
        this.error = errMsg(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchProfile() {
      const client = getProfilesClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      this.loading = true;
      try {
        const { error, data } = await fetchProfileById(client, uid);
        if (error) throw error;
        if (data) {
          this.profile = data;
          this.cacheProfile(data);
        }
      } catch (error) {
        this.error = errMsg(error);
      } finally {
        this.loading = false;
      }
    },
    async updateProfile(data: ProfileUpdatePayload) {
      const client = getProfilesClient();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!this.profile || !uid) return;

      this.profile.id = uid;
      this.profile.first_name = data.first_name;
      this.profile.last_name = data.last_name;
      this.profile.username = data.username;
      this.profile.avatar_url = data.avatar_url;
      this.profile.description = data.description;
      this.profile.updated_at = new Date().toISOString();

      this.loading = true;
      try {
        const { error } = await upsertProfile(client, this.profile, uid);
        if (error) throw error;
        this.cacheProfile(this.profile);
      } catch (error) {
        this.error = errMsg(error);
      } finally {
        this.loading = false;
      }
    },
    async downloadAvatar(avatarUrl: string) {
      const client = getProfilesClient();
      try {
        const { data, error } = await downloadAvatarBlob(client, avatarUrl);
        if (error) throw error;
        if (data) this.avatar_src = URL.createObjectURL(data);
      } catch (error) {
        this.error = errMsg(error);
      } finally {
        this.loading = false;
      }
    },
    async uploadAvatar(file: File, filePath: string) {
      const client = getProfilesClient();
      this.loading = true;
      try {
        const { error: uploadError } = await uploadAvatarFile(
          client,
          filePath,
          file,
        );
        if (uploadError) throw uploadError;
      } catch (error) {
        this.error = errMsg(error);
        console.error("uploadAvatar error:", errMsg(error));
      } finally {
        this.loading = false;
      }
    },
    async deleteOldAvatar(filePath: string) {
      const client = getProfilesClient();
      this.loading = true;
      try {
        const { error: deleteError } = await removeAvatarFile(
          client,
          filePath,
        );
        if (deleteError) throw deleteError;
      } catch (error) {
        console.error("deleteOldAvatar failed:", errMsg(error));
        this.error = errMsg(error);
      } finally {
        this.loading = false;
      }
    },
    clearProfile() {
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (uid) {
        Reflect.deleteProperty(this.profiles, uid);
        Reflect.deleteProperty(this.avatarByUserId, uid);
      }
      this.profile = null;
      this.avatar_src = "";
      this.loading = false;
      this.error = null;
    },
  },
});
