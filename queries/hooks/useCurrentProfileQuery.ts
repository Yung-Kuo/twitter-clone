import { useQuery } from "@tanstack/vue-query";
import { qk } from "~/queries/keys";
import {
  fetchProfileById,
  getProfilesClient,
} from "~/queries/api/profiles";
import { useProfileStore } from "~/stores/profile";

export function useCurrentProfileQuery() {
  const user = useSupabaseUser();

  return useQuery({
    queryKey: computed(() =>
      user.value?.id ? qk.profiles.byId(user.value.id) : ["profiles", "none"],
    ),
    queryFn: async () => {
      const uid = user.value?.id;
      if (!uid) return null;
      const { data, error } = await fetchProfileById(getProfilesClient(), uid);
      if (error) throw error;
      return data;
    },
    enabled: computed(() => !!user.value?.id),
  });
}

export function useCurrentProfileQueryWithStore() {
  const profileStore = useProfileStore();
  const query = useCurrentProfileQuery();
  watch(
    () => query.data.value,
    (data) => {
      if (data) {
        profileStore.profile = data;
        profileStore.cacheProfile(data);
      }
    },
    { immediate: true },
  );
  return query;
}
