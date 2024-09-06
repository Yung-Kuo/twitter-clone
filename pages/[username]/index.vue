<script setup>
import { storeToRefs } from "pinia";
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
import { useReplyStore } from "~/stores/reply";
import { useFollowingStore } from "~/stores/following";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const store = useProfileStore();
const postStore = usePostStore();
const replyStore = useReplyStore();
const followingStore = useFollowingStore();
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

// storing non-self user profile
const userProfile = ref("");
onMounted(async () => {
  watchEffect(() => {
    if (!user.value) {
      navigateTo("/login");
    }
  });
  if (store.noProfile) await store.fetchProfile();
  if (route.params.username === store.getUsername) {
    // check if is current user
    userProfile.value = store.getProfile;
    await followingStore.fetchFollowing();
    await followingStore.fetchFollowers();
  } else {
    // other user
    userProfile.value = await store.fetchOtherProfile(route.params.username);
    if (!userProfile.value) navigateTo("/");
    await postStore.fetchUserProfile(userProfile.value.id);
    await followingStore.checkIsFollowing(userProfile.value.id);
  }
  activeTab.value = "Posts";
  await postStore.fetchLikes(user.value.id);
  await postStore.fetchBookmarks();
  await postStore.fetchBookmarkPosts();
  // following
  await followingStore.fetchUserFollowing(userProfile.value.id);
  await followingStore.fetchUserFollowers(userProfile.value.id);

  //
  window.addEventListener("mousedown", (event) => handleClickOutside(event));
});
onBeforeUnmount(() => {
  window.removeEventListener("mousedown", handleClickOutside);
});

watch(
  () => userProfile.value.id,
  async () => {
    if (route.params.username != store.getUsername) {
      await followingStore.checkIsFollowing(userProfile.value.id);
    }
  }
);

// Load different feed
const activeTab = ref("");
watch(activeTab, async () => {
  await fetchNewPost();
});
async function fetchNewPost() {
  console.log("activeTab: ", activeTab.value);
  if (activeTab.value === "Posts") {
    await postStore.fetchUserPosts(userProfile.value.id);
  } else if (activeTab.value === "Likes") {
    await postStore.fetchLikes(userProfile.value.id);
    await postStore.fetchLikePosts(userProfile.value.id);
  } else if (activeTab.value === "Replies") {
    await replyStore.fetchUserReplies(userProfile.value.id);
  }
}
const postList = computed(() => {
  if (activeTab.value === "Posts") {
    return postStore.getUserPosts(userProfile.value.id);
  } else if (activeTab.value === "Likes") {
    return postStore.getLikePosts(userProfile.value.id);
  } else if (activeTab.value === "Replies") {
    return replyStore.getUserReplies(userProfile.value.id);
  }
});
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
    <MainLeft @popupPost="showPopupPost = !showPopupPost" />
    <MainBottom />
    <MainCenter userPage>
      <template #banner>
        <h1 class="h-1/2 text-lg font-bold text-gray-200 md:h-min md:text-xl">
          {{ userProfile?.first_name }} {{ userProfile?.last_name }}
        </h1>
        <span class="h-1/2 text-sm text-gray-500 md:h-min">
          {{ postStore.getUserPosts(userProfile.id).length }}
          {{
            postStore.getUserPosts(userProfile.id).length > 1 ? "posts" : "post"
          }}
        </span>
      </template>
      <template #main>
        <!-- user profile -->
        <MainSection>
          <!-- profile background image -->
          <div class="h-60 w-full bg-zinc-800"></div>
          <!-- avatar -->
          <div
            class="relative -top-16 left-5 z-10 h-min w-min rounded-full ring-4 ring-black"
          >
            <UIAvatar :user_id="userProfile.id" size="large"></UIAvatar>
          </div>
          <!-- lower section -->
          <div class="relative -top-32 w-full p-5 text-gray-200">
            <!-- action buttons -->
            <div class="relative -top-4 flex h-10 w-full justify-end">
              <UIButtonFollow :uid="userProfile?.id"></UIButtonFollow>
            </div>
            <!-- user info -->
            <div class="relative top-6 w-full">
              <!-- full name -->
              <h1 class="text-xl font-bold text-zinc-200">
                {{ userProfile?.first_name }} {{ userProfile?.last_name }}
              </h1>
              <!-- username -->
              <h3 v-show="userProfile" class="text-sm text-zinc-500">
                @{{ userProfile?.username }}
              </h3>
              <!-- description -->
              <div class="py-3">
                <pre class="text-gray-200">{{ userProfile?.description }}</pre>
              </div>
              <!-- following -->
              <span>{{ followingStore.getUserFollowing.length }}&nbsp</span>
              <span class="pr-5 text-gray-500">Following</span>
              <!-- follower -->
              <span>{{ followingStore.getUserFollowers.length }}&nbsp</span>
              <span class="text-gray-500">Follower</span>
            </div>
          </div>
          <!-- tab navigation -->
          <div
            class="flex h-12 w-full justify-between overflow-x-scroll text-gray-200 md:h-16"
          >
            <!-- Posts -->
            <UINavTab
              :isActive="activeTab === 'Posts'"
              @mousedown="activeTab = 'Posts'"
              >Posts
            </UINavTab>
            <!-- Replies -->
            <UINavTab
              :isActive="activeTab === 'Replies'"
              @mousedown="activeTab = 'Replies'"
              >Replies
            </UINavTab>
            <!-- Highlights -->
            <UINavTab
              :isActive="activeTab === 'Highlights'"
              @mousedown="activeTab = 'Highlights'"
            >
              Highlights</UINavTab
            >
            <!-- Articles -->
            <UINavTab
              :isActive="activeTab === 'Articles'"
              @mousedown="activeTab = 'Articles'"
              >Articles
            </UINavTab>
            <!-- Media -->
            <UINavTab
              :isActive="activeTab === 'Media'"
              @mousedown="activeTab = 'Media'"
              >Media
            </UINavTab>
            <!-- Likes -->
            <UINavTab
              :isActive="activeTab === 'Likes'"
              @mousedown="activeTab = 'Likes'"
              >Likes
            </UINavTab>
          </div>
        </MainSection>
        <!-- post list -->
        <div class="min-h-[40rem]">
          <ul>
            <li v-for="post in postList" :key="post.id">
              <MainPost :post="post"></MainPost>
            </li>
          </ul>
        </div>
      </template>
    </MainCenter>
    <!-- <MainRight /> -->
  </div>
</template>
