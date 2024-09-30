<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
definePageMeta({
  middleware: ["auth"],
});
const user = useSupabaseUser();
const store = useProfileStore();
const postStore = usePostStore();
const handleClickOutside = inject("handleClickOutside");
const showPopupPost = inject("showPopupPost");

onMounted(async () => {
  watchEffect(() => {
    if (!user.value) {
      navigateTo("/login");
    }
  });
  activeTab.value = "For You";
  // load profile
  watchEffect(async () => {
    if (store.noProfile) {
      await store.fetchProfile();
    }
  });
  await postStore.fetchLikes(user.value.id);
  await postStore.fetchBookmarks();
});

// Load different feed
const activeTab = ref("");
watch(activeTab, async () => {
  await fetchNewPost();
});

const postList = computed(() => {
  if (activeTab.value === "Following") return postStore.getFollowingPosts;
  else if (activeTab.value === "For You") return postStore.getAllPosts;
});

// Publish new post
async function fetchNewPost() {
  if (activeTab.value === "Following") await postStore.fetchFollowingPosts();
  else if (activeTab.value === "For You") await postStore.fetchAllPosts();
}
</script>

<template>
  <div
    id="mainPage"
    class="flex h-screen w-screen transition-all"
    @mousedown="handleClickOutside($event)"
  >
    <!-- UI popup -->
    <UIPopupCollection />

    <!-- layout -->
    <MainLeft @popupPost="showPopupPost = true" />
    <MainLeftSmallScreen />
    <MainBottom />
    <MainCenter>
      <!-- header -->
      <!-- feed tab -->
      <template #nav>
        <!-- For you -->
        <UINavTab
          :isActive="activeTab === 'For You'"
          @mousedown="activeTab = 'For You'"
          >For You</UINavTab
        >
        <!-- Following -->
        <UINavTab
          :isActive="activeTab === 'Following'"
          @mousedown="activeTab = 'Following'"
          >Following</UINavTab
        >
      </template>
      <!-- main  -->
      <template #main>
        <!-- write new post -->
        <MainPostWrite class="hidden md:flex" />
        <!-- post list -->
        <ul class="pt-12 md:pt-0">
          <li v-for="post in postList" :key="post.id">
            <MainPost :post="post"></MainPost>
          </li>
        </ul>
      </template>
    </MainCenter>
  </div>
</template>
