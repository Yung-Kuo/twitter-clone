<script setup>
import { usePostStore } from "~/stores/post";
import { useFeedQueryWithStore } from "~/queries/hooks/useFeedQuery";
import { useMyEngagementQueryWithStore } from "~/queries/hooks/useMyEngagementQuery";
import {
  handleClickOutsideKey,
  mainPageShiftedKey,
  showPopupPostKey,
} from "~/composables/keys";

useSeoMeta({
  title: "Twitter Clone",
  description:
    "This is a Twitter Clone built by Yung Kuo Using Nuxt and Supabase.",
});
definePageMeta({
  middleware: ["auth"],
});
const user = useSupabaseUser();
const postStore = usePostStore();

const handleClickOutside = inject(handleClickOutsideKey);
const showPopupPost = inject(showPopupPostKey);
const mainPageShifted = inject(mainPageShiftedKey);

const activeTab = ref("For You");

watchEffect(() => {
  if (!user.value) {
    navigateTo("/login");
  }
});

useMyEngagementQueryWithStore();

const feedKind = computed(() =>
  activeTab.value === "Following" ? "following" : "all",
);
useFeedQueryWithStore(feedKind);

const postList = computed(() => {
  if (activeTab.value === "Following") {
    return postStore.getFollowingPosts ?? [];
  }
  if (activeTab.value === "For You") {
    return postStore.getAllPosts ?? [];
  }
  return [];
});
</script>

<template>
  <div
    class="flex h-screen w-screen transition-transform"
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
