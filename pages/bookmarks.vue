<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";

definePageMeta({
  middleware: ["auth"],
});

const profileStore = useProfileStore();
const postStore = usePostStore();
const user = useSupabaseUser();
const router = useRouter();
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
// post action menu
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
  watchEffect(async () => {
    if (!user.value) {
      navigateTo("/login");
    }
    if (profileStore.noProfile) {
      await profileStore.fetchProfile();
    }
    await postStore.fetchLikes(user.value.id);
    await postStore.fetchBookmarks();
    await postStore.fetchBookmarkPosts();
  });

  window.addEventListener("mousedown", (event) => handleClickOutside(event));
});
onBeforeUnmount(() => {
  window.removeEventListener("mousedown", handleClickOutside);
});

const bookmarkList = computed(() => postStore.getBookmarkPosts);
</script>
<template>
  <div class="flex h-screen w-screen bg-black">
    <!-- UI popup -->
    <div>
      <!-- Alert -->
      <UIAlert :mode="alertMode" :message="alertMessage" />
      <!-- Profile Card -->
      <UIPopupTransition>
        <UIProfileCard
          v-show="profileCardVis"
          id="profileCard"
          :userId="hoveredUserId"
          @mouseenter="showProfileCard(null, null)"
          @mouseleave="hideProfileCard()"
        >
        </UIProfileCard>
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
        ></UIPopupPost>
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
    <MainLeft @popupPost="showPopupPost = !showPopupPost" />
    <MainCenter>
      <template #banner>
        <div class="flex flex-col">
          <h1 class="h-1/2 text-xl font-bold text-gray-200">Bookmarks</h1>
          <span class="text-zinc-500"
            >@{{ postStore.getUsername(user.id) }}</span
          >
        </div>
      </template>
      <template #main>
        <ul>
          <li v-for="post in bookmarkList" :key="post.id">
            <MainPost :post="post"></MainPost>
          </li>
        </ul>
      </template>
    </MainCenter>
    <MainRight />
  </div>
</template>
