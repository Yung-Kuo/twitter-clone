<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
import { useReplyStore } from "~/stores/reply";
import { useFollowingStore } from "~/stores/following";
definePageMeta({
  middleware: ["auth"],
});
const user = useSupabaseUser();
const profileStore = useProfileStore();
const postStore = usePostStore();
const replyStore = useReplyStore();
const followingStore = useFollowingStore();
const route = useRoute();
//
// composables
//
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
provide("toggleAccountMenu", { showMenu, type, toggleMenu, menuGetRect });
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
provide("showPopupPost", showPopupPost);
provide("repost_pid", repost_pid);
// reply
const { showPopupReply, pid, reply, clickReply, publishReply } = useReply();
provide("clickReply", clickReply);
provide("showPopupReply", showPopupReply);
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
  });
  watchEffect(async () => {
    if (!post.value) await postStore.fetchOnePost(route.params.id);
    if (!replyList.value) await replyStore.fetchReplies(post.value.id);
    if (!followingStore.getFollowing(user.value.id)) {
      await followingStore.fetchFollowing(user.value.id);
    }
    if (!postStore.getLikes(user.value.id)) {
      await postStore.fetchLikes(user.value.id);
    }
    if (!postStore.getBookmarks) {
      await postStore.fetchBookmarks();
    }
  });
  watchEffect(async () => {
    if (post.value?.type === "reply") {
      await buildThread(post.value);
      if (thread.value.length > 0) {
        await nextTick();
        scrollToTarget();
        setTimeout(() => {
          scrollToTarget();
        }, 500);
      }
    }
  });
});

//
const post = computed(() => postStore.getPost(route.params.id));
// reply list
const replyList = computed(() => replyStore.getReplies(post.value?.id));
// thread
const thread = ref([]);
async function buildThread(currentPost) {
  let current = currentPost;
  while (current?.reply_to) {
    if (!postStore.getPost(current.reply_to)) {
      await postStore.fetchOnePost(current.reply_to);
    }

    current = postStore.getPost(current.reply_to);
    if (!current) break;

    if (thread.value.find((post) => post.id === current.id)) continue;
    thread.value.unshift(current);

    if (current.type !== "reply") break;
  }
}

const target = ref(null);
const initialScroll = ref(false);
function scrollToTarget() {
  if (initialScroll.value) return;
  initialScroll.value = true;
  console.log("scroll");
  target.value.scrollIntoView({ block: "start", behavior: "instant" });
  initialScroll.value = false;
}
</script>
<template>
  <div
    class="flex h-screen w-screen bg-black"
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
    <MainBottom />
    <MainCenter :initialScroll="initialScroll">
      <template #banner>
        <h1 class="h-1/2 text-lg font-bold text-gray-200 md:text-xl">Post</h1>
      </template>
      <template #main>
        <!-- upper section -->
        <MainSection class="noForward pt-2">
          <!-- reply thread -->
          <ul v-if="thread.length > 0">
            <li v-for="threadPost in thread" :key="threadPost.id">
              <MainPostReplyThread
                :post="threadPost"
                noHover
                class="px-3 md:px-5"
              />
            </li>
          </ul>
          <div ref="target" class="scroll-mt-12 md:scroll-mt-14"></div>
          <!-- main post -->
          <div class="px-3 md:px-5">
            <MainPostSingle v-bind="post"></MainPostSingle>
          </div>
        </MainSection>
        <!-- lower section -->
        <div class="min-h-[40rem]">
          <!-- replies -->
          <ul>
            <li v-for="post in replyList" :key="post.id">
              <MainPost :post="post" showAuthorReply />
            </li>
          </ul>
        </div>
      </template>
    </MainCenter>
    <!-- <MainRight :user_id="post.user_id" /> -->
  </div>
</template>
