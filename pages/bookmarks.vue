<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";

definePageMeta({
  middleware: ["auth"],
});

const profileStore = useProfileStore();
const postStore = usePostStore();
const user = useSupabaseUser();

const handleClickOutside = inject("handleClickOutside");
const showPopupPost = inject("showPopupPost");

onMounted(async () => {
  watchEffect(async () => {
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
    await postStore.fetchLikes(user.value.id);
    await postStore.fetchBookmarks();
    await postStore.fetchBookmarkPosts();
  });
});

const bookmarkList = computed(() => postStore.getBookmarkPosts);
</script>
<template>
  <div class="flex h-screen w-screen" @mousedown="handleClickOutside($event)">
    <!-- UI popup -->
    <UIPopupCollection />

    <!-- layout -->
    <MainLeft @popupPost="showPopupPost = !showPopupPost" />
    <MainBottom />
    <MainCenter>
      <template #title>Bookmarks</template>
      <template #subtitle>@{{ postStore.getUsername(user.id) }}</template>
      <template #main>
        <ul>
          <li v-for="post in bookmarkList" :key="post.id">
            <MainPost :post="post"></MainPost>
          </li>
        </ul>
      </template>
    </MainCenter>
    <!-- <MainRight /> -->
  </div>
</template>
