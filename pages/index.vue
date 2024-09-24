<script setup>
import { storeToRefs } from "pinia";
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
// import { useReplyStore } from "~/stores/reply";
definePageMeta({
  middleware: ["auth"],
});
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const store = useProfileStore();
const postStore = usePostStore();
// const replyStore = useReplyStore();
const { getError } = storeToRefs(store);
// composables
const { alertMode, alertMessage, errorTimeout, hasError } = useAlert();
// wheel sync
const { handleWheelEvent } = useWheelSync();
provide("handleWheelEvent", handleWheelEvent);
// scroll
const { handleScroll } = useScroll();
provide("handleScroll", handleScroll);
// profile card
const {
  profileCardVis,
  hoveredElement,
  hoveredUserId,
  getRect,
  showProfileCard,
  hideProfileCard,
} = useProfileCard();
provide("profileCard", { showProfileCard, hideProfileCard });
provide("getRect", getRect);
// post action menu / repost menu
const {
  showMenu,
  menu_pid,
  type,
  toggleMenu,
  handleClickOutside,
  menuGetRect,
} = useToggleMenu();
provide("toggleMenu", toggleMenu);
provide("menuGetRect", menuGetRect);
provide("togglePostMenu", { showMenu, menu_pid, type, toggleMenu });
provide("toggleAccountMenu", { showMenu, type, toggleMenu, menuGetRect });
// write post & quote
const {
  showPopupPost,
  newPost,
  repost_pid,
  publishPost,
  publishRepost,
  publishQuote,
} = useWritePost();
provide("writePost", {
  showPopupPost,
  newPost,
  repost_pid,
  publishPost,
  publishRepost,
  publishQuote,
});
provide("showPopupPost", showPopupPost);
provide("repost_pid", repost_pid);
// reply
const { showPopupReply, pid, clickReply, publishReply } = useReply();
provide("clickReply", clickReply);
provide("popupReply", { pid, publishReply });
// edit
const { showPopupEdit, editPost, newText, selectEditPost, publishEdit } =
  useEdit();
provide("useEdit", {
  showPopupEdit,
  editPost,
  newText,
  selectEditPost,
  publishEdit,
});
// click post
const { target_post, clickPost, hoverPost } = useClickPost();
provide("clickPost", { target_post, clickPost, hoverPost });

onMounted(async () => {
  watchEffect(() => {
    if (!user.value) {
      navigateTo("/login");
    }
  });
  activeTab.value = "For You";
  // load profile
  if (store.noProfile) {
    await store.fetchProfile();
    if (getError.value) {
      alertMode.value = "error";
      alertMessage.value = getError.value;
      hasError();
    }
  }
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
    class="flex h-screen w-screen bg-black transition-all duration-300"
    @mousedown="handleClickOutside($event)"
  >
    <!-- UI popup -->
    <div>
      <!-- Alert -->
      <UIAlert :mode="alertMode" :message="alertMessage" />
      <!-- Profile Card -->
      <UIPopupTransition leave-active-class="delay-200">
        <UIPopupProfileCard
          v-show="profileCardVis"
          id="profileCard"
          :userId="hoveredUserId"
          @mouseenter="showProfileCard(null, null)"
          @mouseleave="hideProfileCard()"
        >
        </UIPopupProfileCard>
      </UIPopupTransition>
      <!-- Backdrop -->
      <UIPopupTransition>
        <UIPopupBackdrop
          v-show="showPopupPost || showPopupReply || showPopupEdit"
          @mousedown="
            showPopupPost = false;
            showPopupReply = false;
            showPopupEdit = false;
            newPost = null;
            repost_pid = null;
            reply = null;
            editPost = null;
          "
        />
      </UIPopupTransition>
      <!-- Post -->
      <UIPopupTransition>
        <UIPopupPost
          v-if="showPopupPost"
          @close="
            showPopupPost = false;
            repost_pid = null;
            newPost = null;
          "
        />
      </UIPopupTransition>
      <!-- Reply -->
      <UIPopupTransition>
        <UIPopupReply v-if="showPopupReply" @close="showPopupReply = false" />
      </UIPopupTransition>
      <!-- Edit -->
      <UIPopupTransition>
        <UIPopupEdit
          v-if="showPopupEdit"
          @close="
            showPopupEdit = false;
            editPost = null;
          "
        />
      </UIPopupTransition>
    </div>

    <!-- layout -->
    <MainLeft @popupPost="showPopupPost = true" />
    <MainLeftSmallScreen />
    <MainBottom />
    <MainCenter>
      <!-- header -->
      <template #mainBanner>
        <div class="flex w-full">
          <!-- feed tab -->
          <div class="grid h-12 grow grid-cols-2 md:h-14">
            <!-- For you -->
            <NuxtLink>
              <UINavTab
                :isActive="activeTab === 'For You'"
                @mousedown="activeTab = 'For You'"
                >For You</UINavTab
              >
            </NuxtLink>
            <!-- Following -->
            <NuxtLink>
              <UINavTab
                :isActive="activeTab === 'Following'"
                @mousedown="activeTab = 'Following'"
                >Following</UINavTab
              >
            </NuxtLink>
          </div>
          <!-- settings -->
          <div
            class="hidden h-full w-6 items-center justify-center md:flex md:w-14"
          >
            <NuxtLink>
              <IconsBadge size="small" class="text-xl text-zinc-200">
                <IconsSettings />
              </IconsBadge>
            </NuxtLink>
          </div>
        </div>
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
