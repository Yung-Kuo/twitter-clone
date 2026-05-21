import type { Database } from "#build/types/supabase-database";
import { PROFILE_COLUMNS } from "~/types/supabase-select";
import { errMsg } from "~/utils/errMsg";
import { usePostStore } from "~/stores/post";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type ProfileUpdatePayload = Pick<
  ProfileRow,
  "first_name" | "last_name" | "username" | "avatar_url" | "description"
>;

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profile: null as ProfileRow | null,
    avatar_src: "",
    loading: false,
    error: null as string | null,
  }),
  getters: {
    getUsername: (state) => {
      if (!state.profile) return null;
      return state.profile.username;
    },
    getName: (state) => {
      if (!state.profile) return null;
      return `${state.profile.first_name} ${state.profile.last_name}`;
    },
    getProfile: (state) => {
      return state.profile;
    },
    noProfile: (state) => {
      return !state.profile;
    },
    getAvatar: (state) => {
      if (!state.avatar_src) return null;
      return state.avatar_src;
    },
    getAvatarUrl: (state) => {
      return state.profile?.avatar_url ?? null;
    },
    isLoading: (state) => {
      return state.loading;
    },
    getError: (state) => {
      return state.error;
    },
  },
  actions: {
    async fetchOtherProfile(username: string | null = null) {
      if (username == null) return;
      const client = useSupabaseClient<Database>();
      this.loading = true;
      try {
        const { error, data } = await client
          .from("profiles")
          .select(PROFILE_COLUMNS)
          .eq("username", username)
          .single();

        if (error) throw error;
        if (data) {
          const postStore = usePostStore();
          postStore.setProfile(data);
          return data;
        }
      } catch (error) {
        this.error = errMsg(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchProfile() {
      const client = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const uid = user.value?.id;
      if (!uid) return;
      this.loading = true;
      try {
        const { error, data } = await client
          .from("profiles")
          .select(PROFILE_COLUMNS)
          .eq("id", uid)
          .single();
        if (error) throw error;
        else this.profile = data;
      } catch (error) {
        this.error = errMsg(error);
      } finally {
        this.loading = false;
      }
    },
    async updateProfile(data: ProfileUpdatePayload) {
      const client = useSupabaseClient<Database>();
      const user = useSupabaseUser();
      const postStore = usePostStore();
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
        const { error } = await client
          .from("profiles")
          .upsert(this.profile)
          .eq("id", uid)
          .single();
        if (error) throw error;
      } catch (error) {
        this.error = errMsg(error);
      } finally {
        this.loading = false;
        postStore.setProfile(this.profile);
      }
    },
    async downloadAvatar(avatarUrl: string) {
      const client = useSupabaseClient<Database>();
      try {
        const { data, error } = await client.storage
          .from("avatars")
          .download(avatarUrl);
        if (error) throw error;
        if (data) this.avatar_src = URL.createObjectURL(data);
      } catch (error) {
        this.error = errMsg(error);
      } finally {
        this.loading = false;
      }
    },
    async uploadAvatar(file: File, filePath: string) {
      const client = useSupabaseClient<Database>();

      this.loading = true;
      try {
        const { error: uploadError } = await client.storage
          .from("avatars")
          .upload(filePath, file);
        if (uploadError) {
          throw uploadError;
        }
      } catch (error) {
        this.error = errMsg(error);
        console.error("uploadAvatar error:", errMsg(error));
      } finally {
        this.loading = false;
      }
    },
    async deleteOldAvatar(filePath: string) {
      const client = useSupabaseClient<Database>();
      this.loading = true;
      try {
        const { error: deleteError } = await client.storage
          .from("avatars")
          .remove([filePath]);
        if (deleteError) throw deleteError;
      } catch (error) {
        console.error("deleteOldAvatar failed:", errMsg(error));
        this.error = errMsg(error);
      } finally {
        this.loading = false;
      }
    },
    clearProfile() {
      this.profile = null;
      this.avatar_src = "";
      this.loading = false;
      this.error = null;
    },
  },
});
