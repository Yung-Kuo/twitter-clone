<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
import { useReplyStore } from "~/stores/reply";
definePageMeta({
  middleware: ["auth"],
});
const user = useSupabaseUser();
const profileStore = useProfileStore();
const postStore = usePostStore();
const replyStore = useReplyStore();
const route = useRoute();
//
// composables
//
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
// toggle menu
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
  watchEffect(async () => {
    if (!user.value) {
      navigateTo("/login");
    }
    if (profileStore.noProfile) {
      await profileStore.fetchProfile();
      await postStore.fetchUserProfile(user.value.id);
    }
    if (!post.value) await postStore.fetchOnePost(route.params.id);
    if (!replyList.value) await replyStore.fetchReplies(post.value.id);
    pid.value = post.value.id;
    // reply thread
    if (post.value.type === "reply" && post.value.reply_to) {
      if (await traverseThread()) scrollToTarget();
    }
    if (!postStore.getLikes(user.value.id)) {
      await postStore.fetchLikes(user.value.id);
    }
    if (!postStore.getBookmarks.length) {
      await postStore.fetchBookmarks();
    }
  });
  // mousedown
  window.addEventListener("mousedown", (event) => handleClickOutside(event));
});
onBeforeUnmount(() => {
  window.removeEventListener("mousedown", handleClickOutside);
});

//
const post = computed(() => postStore.getPost(route.params.id));
// reply list
const replyList = computed(() => replyStore.getReplies(post.value?.id));

const thread = ref([]);
async function traverseThread() {
  let current = null;
  let reply_to = post.value?.reply_to;
  while (reply_to) {
    // if (!postStore.getPost(reply_to)) {
    await postStore.fetchOnePost(reply_to);
    // }
    current = postStore.getPost(reply_to);
    if (current && !thread.value.find((post) => post.id === current.id)) {
      thread.value.unshift(current);
      // stop the traverse if the root post is a repost.
      if (current.type === "repost") break;
      reply_to = current.reply_to;
    } else break;
  }
  return true;
}
function scrollToTarget() {
  nextTick();
  const target = document.getElementById("target");
  if (target) {
    target.scrollIntoView({ block: "start", behavior: "instant" });
  }
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
    <MainLeft @popupPost="showPopupPost = !showPopupPost" />
    <MainCenter>
      <template #banner>
        <h1 class="h-1/2 text-xl font-bold text-gray-200">Post</h1>
      </template>
      <template #main>
        <!-- upper section -->
        <MainSection class="px-5 py-2">
          <!-- reply thread -->
          <ul v-if="thread.length">
            <li v-for="threadPost in thread" :key="threadPost.id">
              <MainPostReplyThread v-bind="threadPost" />
            </li>
          </ul>
          <div id="target" class="scroll-mt-14"></div>
          <!-- main post -->
          <MainPostSingle v-bind="post"></MainPostSingle>
        </MainSection>
        <!-- lower section -->
        <div class="h-2/3">
          <!-- replies -->
          <ul>
            <li v-for="post in replyList" :key="post.id">
              <MainPost :post="post" showAuthorReply />
            </li>
          </ul>
        </div>
      </template>
    </MainCenter>
    <MainRight />
  </div>
</template>
