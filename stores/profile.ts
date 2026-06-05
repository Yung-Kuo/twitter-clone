/**
 * Owns: profiles by user id, avatar blobs, current-user profile edit/fetch.
 * Does not own: posts, likes, bookmarks (see stores/post.ts).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import type { PostRow } from "~/queries/api/posts";
import {
  downloadAvatarBlob,
  isAbsoluteAvatarUrl,
  removeAvatarFile,
  uploadAvatarFile,
} from "~/queries/api/avatars";
import {
  fetchAllProfiles,
  fetchProfileById,
  fetchProfileByUsername,
  fetchProfilesByIds,
  getProfilesClient,
  upsertProfile,
  type ProfileRow,
  type ProfileUpdatePayload,
} from "~/queries/api/profiles";
import { errMsg } from "~/utils/errMsg";

type UserId = string;

const avatarDownloadsInFlight = new Map<UserId, Promise<void>>();
const profileFetchesInFlight = new Map<UserId, Promise<void>>();

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profiles: {} as Record<UserId, ProfileRow>,
    avatarByUserId: {} as Record<UserId, string>,
    profile: null as ProfileRow | null,
    avatar_src: "",
    sidebarProfilesLoaded: false,
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
    /** Blob URL, cached storage URL, or absolute avatar_url — no download required. */
    displayAvatarSrc: (state) => (uid: UserId) => {
      if (state.avatarByUserId[uid]) return state.avatarByUserId[uid];
      const url = state.profiles[uid]?.avatar_url;
      if (url && isAbsoluteAvatarUrl(url)) return url;
      return undefined;
    },
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
      if (!uid || this.profiles[uid]) return;
      const inFlight = profileFetchesInFlight.get(uid);
      if (inFlight) return inFlight;

      const supabase = client ?? getProfilesClient();
      const task = (async () => {
        try {
          if (this.profiles[uid]) return;
          const { data, error } = await fetchProfileById(supabase, uid);
          if (error) throw error;
          if (data) this.cacheProfile(data);
        } catch (error) {
          console.error(errMsg(error));
        } finally {
          profileFetchesInFlight.delete(uid);
        }
      })();
      profileFetchesInFlight.set(uid, task);
      return task;
    },
    async fetchProfiles() {
      if (this.sidebarProfilesLoaded) return;
      const client = getProfilesClient();
      try {
        const { error, data } = await fetchAllProfiles(client);
        if (data) {
          for (const profile of data) {
            this.cacheProfile(profile);
          }
        }
        if (error) throw error;
        this.sidebarProfilesLoaded = true;
      } catch (error) {
        console.error(errMsg(error));
      }
    },
    async downloadAvatarForUser(
      uid: UserId,
      url: string,
      client?: SupabaseClient<Database>,
    ) {
      if (!url || this.displayAvatarSrc(uid)) return;
      if (isAbsoluteAvatarUrl(url)) {
        this.avatarByUserId[uid] = url;
        return;
      }
      const inFlight = avatarDownloadsInFlight.get(uid);
      if (inFlight) return inFlight;

      const supabase = client ?? getProfilesClient();
      const task = (async () => {
        try {
          const { data, error } = await downloadAvatarBlob(supabase, url);
          if (error) throw error;
          if (data) this.avatarByUserId[uid] = URL.createObjectURL(data);
        } catch (error) {
          console.error(errMsg(error));
        } finally {
          avatarDownloadsInFlight.delete(uid);
        }
      })();
      avatarDownloadsInFlight.set(uid, task);
      return task;
    },
    async ensureAuthorsForPosts(
      posts: PostRow[],
      client?: SupabaseClient<Database>,
    ) {
      const supabase = client ?? getProfilesClient();
      const missing = [
        ...new Set(
          posts
            .map((post) => post.user_id)
            .filter((uid) => uid && !this.profileById(uid)),
        ),
      ];
      if (missing.length === 0) return;

      try {
        const { data, error } = await fetchProfilesByIds(supabase, missing);
        if (error) throw error;
        if (data) {
          for (const profile of data) {
            this.cacheProfile(profile);
          }
        }
      } catch (error) {
        console.error(errMsg(error));
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
