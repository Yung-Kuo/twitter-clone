<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
import { handleClickOutsideKey, showPopupPostKey } from "~/composables/keys";

definePageMeta({
  middleware: ["auth"],
});

const profileStore = useProfileStore();
const postStore = usePostStore();
const user = useSupabaseUser();

const handleClickOutside = inject(handleClickOutsideKey);
const showPopupPost = inject(showPopupPostKey);

watchEffect(() => {
  if (!user.value) {
    navigateTo("/login");
  }
});

watchEffect(async () => {
  if (profileStore.noProfile) {
    await profileStore.fetchProfile();
  }
});

watchEffect(async () => {
  const id = user.value?.id;
  if (!id) return;
  await postStore.fetchLikes(id);
  await postStore.fetchBookmarks();
  await postStore.fetchBookmarkPosts();
});

const bookmarkList = computed(() => postStore.getBookmarkPosts);
</script>
<template>
  <div class="flex h-screen w-screen" @mousedown="handleClickOutside($event)">
    <!-- UI popup -->
    <UIPopupCollection />

    <!-- layout -->
    <MainLeft @popup-post="showPopupPost = !showPopupPost" />
    <MainBottom />
    <MainCenter>
      <template #title>Bookmarks</template>
      <template #subtitle>@{{ profileStore.usernameById(user.id) }}</template>
      <template #main>
        <MainPostList :post-list="bookmarkList" />
      </template>
    </MainCenter>
    <!-- <MainRight /> -->
  </div>
</template>
