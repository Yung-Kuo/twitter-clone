<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";

const postStore = usePostStore();
const props = defineProps({
  file: String,
  size: {
    type: String,
    default: "small",
  },
  user_id: {
    type: String,
    default: null,
  },
});
const { file, size, user_id } = toRefs(props);

const imgSize = ref(small);
const xsmall = "h-6 w-6";
const small = "h-10 w-10";
const medium = "h-16 w-16";
const large = "h-40 w-40";

onMounted(async () => {
  if (!size.value) imgSize.value = small;
  else if (size.value == "xsmall") imgSize.value = xsmall;
  else if (size.value == "small") imgSize.value = small;
  else if (size.value == "medium") imgSize.value = medium;
  else if (size.value == "large") imgSize.value = large;
  // load url and image
  if (user_id.value && !postStore.getAvatarUrl(user_id.value))
    await postStore.fetchUserProfile(user_id.value);
  await loadAvatar(postStore.getAvatarUrl(user_id.value));
});
watch(user_id, async (uid) => {
  if (!postStore.getAvatarUrl(uid)) await postStore.fetchUserProfile(uid);
  await loadAvatar(postStore.getAvatarUrl(uid));
});
async function loadAvatar(newPath) {
  if (newPath) {
    await postStore.downloadAvatar(user_id.value, newPath);
  }
}
const avatar_src = computed(() => {
  return postStore.getAvatar(user_id.value);
});
</script>

<template>
  <div class="rounded-full bg-gray-400" :class="imgSize">
    <img
      v-if="file || user_id"
      :src="file ? file : avatar_src"
      class="h-full w-full rounded-full object-cover object-top"
    />
  </div>
</template>
