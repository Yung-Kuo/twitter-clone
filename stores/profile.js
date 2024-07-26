export const useProfileStore = defineStore({
  id: "profile",
  state: () => ({
    profile: "",
    avatar_src: "",
    loading: "",
    error: "",
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
      return state.profile.avatar_url;
    },
    getAvatar: (state) => {
      return state.avatar_src;
    },
    isLoading: (state) => {
      return state.loading;
    },
    getError: (state) => {
      return state.error;
    },
  },
  actions: {
    async fetchOtherProfile(username = null) {
      const client = useSupabaseClient();
      this.loading = true;
      try {
        const { error, data } = await client
          .from("profiles")
          .select()
          .eq("username", username)
          // .or(`username.eq.${username}, id.eq.${id}`)
          .single();
        if (error) throw error;
        else return data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchProfile() {
      const client = useSupabaseClient();
      const user = useSupabaseUser();
      this.loading = true;
      try {
        const { error, data } = await client
          .from("profiles")
          .select()
          .eq("id", user.value.id)
          .single();
        if (error) throw error;
        else this.profile = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateProfile(data) {
      const client = useSupabaseClient();
      const user = useSupabaseUser();

      this.profile.id = user.value.id;
      this.profile.first_name = data.first_name;
      this.profile.last_name = data.last_name;
      this.profile.username = data.username;
      this.profile.avatar_url = data.avatar_url;
      this.profile.description = data.description;
      this.profile.updated_at = new Date();

      this.loading = true;
      try {
        const { error } = await client
          .from("profiles")
          .upsert(this.profile)
          .eq("id", user.value.id)
          .single();
        if (error) throw error;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async downloadAvatar(avatarUrl) {
      // download avatar from url store in supabase
      const client = useSupabaseClient();
      try {
        const { data, error } = await client.storage
          .from("avatars")
          .download(avatarUrl);
        if (error) throw error;
        this.avatar_src = URL.createObjectURL(data);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async uploadAvatar(file, filePath) {
      const client = useSupabaseClient();

      this.loading = true;
      try {
        const { error: uploadError } = await client.storage
          .from("avatars")
          .upload(filePath, file);
        if (uploadError) {
          console.log("uploadAvatar has error!!!");
          throw uploadError;
        }
      } catch (error) {
        this.error = error.message;
        console.log("uploadAvatar error: ", error.message);
      } finally {
        this.loading = false;
      }
    },
    async deleteOldAvatar(filePath) {
      const client = useSupabaseClient();
      this.loading = true;
      try {
        const { error: deleteError } = await client.storage
          .from("avatars")
          .remove([filePath]);
        if (deleteError) throw deleteError;
        else console.log("delete success!!");
      } catch (error) {
        console.log("delete failed!!");
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    clearProfile() {
      this.profile = "";
      this.avatar_src = "";
      this.loading = "";
      this.error = "";
    },
  },
  // persist: true,
});
