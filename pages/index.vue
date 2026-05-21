<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
useSeoMeta({
  title: "Twitter Clone",
  description:
    "This is a Twitter Clone built by Yung Kuo Using Nuxt and Supabase.",
});
definePageMeta({
  middleware: ["auth"],
});
const user = useSupabaseUser();
const store = useProfileStore();
const postStore = usePostStore();
const handleClickOutside = inject("handleClickOutside");
const showPopupPost = inject("showPopupPost");
const mainPageShifted = inject("mainPageShifted");

const activeTab = ref("For You");

watchEffect(() => {
  if (!user.value) {
    navigateTo("/login");
  }
});

watchEffect(async () => {
  if (store.noProfile) {
    await store.fetchProfile();
  }
});

onMounted(async () => {
  const id = user.value?.id;
  if (id) {
    await postStore.fetchLikes(id);
    await postStore.fetchBookmarks();
  }
});

// Load different feed (immediate: load default "For You" on mount)
watch(
  activeTab,
  async () => {
    await fetchNewPost();
  },
  { immediate: true },
);

const postList = computed(() => {
  if (activeTab.value === "Following") return postStore.getFollowingPosts;
  if (activeTab.value === "For You") return postStore.getAllPosts;
  return [];
});

// Publish new post
async function fetchNewPost() {
  if (activeTab.value === "Following") await postStore.fetchFollowingPosts();
  else if (activeTab.value === "For You") await postStore.fetchAllPosts();
}
</script>

<template>
  <div
    class="flex h-screen w-screen transition-all"
    :class="{
      'translate-x-[20rem]': mainPageShifted,
      'md:translate-x-0': mainPageShifted,
    }"
    @mousedown="handleClickOutside($event)"
  >
    <!-- UI popup -->
    <UIPopupCollection />

    <!-- layout -->
    <MainLeft @popup-post="showPopupPost = true" />
    <MainLeftSmallScreen />
    <MainBottom />
    <MainCenter>
      <!-- header -->
      <!-- feed tab -->
      <template #nav>
        <!-- For you -->
        <UINavTab
          :is-active="activeTab === 'For You'"
          @mousedown="activeTab = 'For You'"
          >For You</UINavTab
        >
        <!-- Following -->
        <UINavTab
          :is-active="activeTab === 'Following'"
          @mousedown="activeTab = 'Following'"
          >Following</UINavTab
        >
      </template>
      <!-- main  -->
      <template #main>
        <!-- write new post -->
        <MainPostWrite class="hidden md:flex" />
        <!-- post list -->
        <MainPostList :post-list="postList" class="pt-12 md:pt-0" />
      </template>
    </MainCenter>
  </div>
</template>
