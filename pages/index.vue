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
  menu_uid,
  type,
  icon_id,
  toggleMenu,
  handleClickOutside,
  menuGetRect,
} = useToggleMenu();
provide("useToggleMenu", {
  showMenu,
  menu_pid,
  menu_uid,
  type,
  icon_id,
  toggleMenu,
  handleClickOutside,
  menuGetRect,
});
provide("toggleMenu", toggleMenu);
provide("menuGetRect", menuGetRect);
provide("toggleAccountMenu", { showMenu, type, menuGetRect });
watch(icon_id, () => {
  nextTick();
  if (!showMenu.value) {
    toggleMenu(menu_pid.value, menu_uid.value, type.value);
  }
});
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
provide("repost_pid", repost_pid);
// reply
const { showPopupReply, pid, reply, clickReply, publishReply } = useReply();
provide("clickReply", clickReply);
provide("popupReply", { pid, reply, publishReply });
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
  activeTab.value = "Following";
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
  //
  window.addEventListener("mousedown", (event) => handleClickOutside(event));
});
onBeforeUnmount(() => {
  window.removeEventListener("mousedown", handleClickOutside);
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
  <div class="flex h-screen w-screen bg-black">
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
          "
        />
      </UIPopupTransition>
      <!-- Reply -->
      <UIPopupTransition>
        <UIPopupReply
          v-if="showPopupReply"
          @close="
            showPopupReply = false;
            reply = null;
          "
        />
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
    <MainCenter>
      <!-- header -->
      <template #mainBanner>
        <!-- feed tab -->
        <div class="grid h-full flex-grow grid-cols-2">
          <!-- For you -->
          <NuxtLink>
            <UINavTab
              tabName="For You"
              :activeTab="activeTab"
              @changeTab="(tab) => (activeTab = tab)"
              >For You</UINavTab
            >
          </NuxtLink>
          <!-- Following -->
          <NuxtLink>
            <UINavTab
              tabName="Following"
              :activeTab="activeTab"
              @changeTab="(tab) => (activeTab = tab)"
              >Following</UINavTab
            >
          </NuxtLink>
        </div>
        <!-- settings -->
        <div class="flex h-full w-14 items-center justify-center">
          <NuxtLink>
            <IconsBadge size="small" class="text-xl text-zinc-200">
              <IconsSettings></IconsSettings>
            </IconsBadge>
          </NuxtLink>
        </div>
      </template>
      <!-- main  -->
      <template #main>
        <!-- write new post -->
        <MainPostWrite />
        <!-- post list -->
        <ul>
          <li v-for="post in postList" :key="post.id">
            <MainPost :post="post"></MainPost>
          </li>
        </ul>
      </template>
    </MainCenter>
    <MainRight />
  </div>
</template>
