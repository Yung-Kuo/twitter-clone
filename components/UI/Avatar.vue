<script setup lang="ts">
import { useProfileStore } from "~/stores/profile";

type AvatarSize = "xsmall" | "small" | "medium" | "large";

const profileStore = useProfileStore();

const props = withDefaults(
  defineProps<{
    file?: string;
    size?: AvatarSize;
    user_id?: string | null;
  }>(),
  {
    size: "small",
    user_id: null,
  },
);

const { file, size, user_id } = toRefs(props);

const imgSize = ref<string | null>(null);
const xsmall = "h-8 w-8";
const small = "h-10 w-10";
const medium = "h-16 w-16";
const large = "h-36 w-36";

onMounted(async () => {
  if (!size.value) imgSize.value = small;
  else if (size.value === "xsmall") imgSize.value = xsmall;
  else if (size.value === "small") imgSize.value = small;
  else if (size.value === "medium") imgSize.value = medium;
  else if (size.value === "large") imgSize.value = large;
  const uid = user_id.value;
  if (uid && !profileStore.avatarUrlById(uid))
    await profileStore.fetchUserProfile(uid);
  await loadAvatar(profileStore.avatarUrlById(uid ?? ""));
});

watch(user_id, async (uid) => {
  if (!uid) return;
  if (!profileStore.avatarUrlById(uid)) await profileStore.fetchUserProfile(uid);
  await loadAvatar(profileStore.avatarUrlById(uid));
});

async function loadAvatar(newPath: string | null | undefined) {
  const uid = user_id.value;
  if (newPath && uid) {
    await profileStore.downloadAvatarForUser(uid, newPath);
  }
}

const avatar_src = computed(() => {
  return user_id.value ? profileStore.avatarById(user_id.value) : undefined;
});
</script>

<template>
  <div class="rounded-full bg-gray-400" :class="imgSize">
    <img
      v-if="file || avatar_src"
      :src="file || avatar_src"
      class="h-full w-full rounded-full object-cover object-top"
    >
  </div>
</template>
