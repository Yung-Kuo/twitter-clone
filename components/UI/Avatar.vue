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

onMounted(() => {
  if (!size.value) imgSize.value = small;
  else if (size.value === "xsmall") imgSize.value = xsmall;
  else if (size.value === "small") imgSize.value = small;
  else if (size.value === "medium") imgSize.value = medium;
  else if (size.value === "large") imgSize.value = large;
  scheduleAvatarLoad(user_id.value);
});

watch(user_id, (uid) => {
  scheduleAvatarLoad(uid);
});

function scheduleAvatarLoad(uid: string | null | undefined) {
  if (!uid) return;
  if (profileStore.displayAvatarSrc(uid)) return;
  if (!profileStore.profileById(uid)) {
    void profileStore.fetchUserProfile(uid).then(() => {
      deferStorageAvatarDownload(uid);
    });
    return;
  }
  deferStorageAvatarDownload(uid);
}

function deferStorageAvatarDownload(uid: string) {
  if (profileStore.displayAvatarSrc(uid)) return;
  const path = profileStore.avatarUrlById(uid);
  if (!path) return;
  const run = () => void profileStore.downloadAvatarForUser(uid, path);
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(run, { timeout: 3000 });
  } else {
    setTimeout(run, 50);
  }
}

const avatar_src = computed(() => {
  const uid = user_id.value;
  return uid ? profileStore.displayAvatarSrc(uid) : undefined;
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
