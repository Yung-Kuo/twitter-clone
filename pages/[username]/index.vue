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

const handleClickOutside = inject("handleClickOutside");
const showPopupPost = inject("showPopupPost");

// storing non-self user profile
const userProfile = computed(() => {
  if (route.params.username === store.getUsername) {
    // check if is current user
    return store.getProfile;
  } else {
    return otherUser.value;
  }
});
const otherUser = ref("");
onMounted(async () => {
  watchEffect(() => {
    if (!user.value) {
      navigateTo("/login");
    }
  });
  // fetch profile
  watchEffect(async () => {
    if (store.noProfile) await store.fetchProfile();
    if (route.params.username !== store.getUsername) {
      // other user
      otherUser.value = await store.fetchOtherProfile(route.params.username);
      if (!otherUser.value) navigateTo("/");
      if (!followingStore.getFollowing(userProfile.value?.id)) {
        await followingStore.checkIsFollowing(userProfile.value?.id);
      }
    }
  });

  // load feed
  watchEffect(async () => {
    if (activeTab.value === "Posts") {
      if (!postStore.getUserPosts(userProfile.value.id)) {
        await postStore.fetchUserPosts(userProfile.value?.id);
      }
    } else if (activeTab.value === "Likes") {
      if (!postStore.getLikes(userProfile.value?.id)) {
        await postStore.fetchLikes(userProfile.value?.id);
        await postStore.fetchLikePosts(userProfile.value?.id);
      }
    } else if (activeTab.value === "Replies") {
      if (!replyStore.getUserReplies(userProfile.value.id)) {
        await replyStore.fetchUserReplies(userProfile.value?.id);
      }
    }
  });

  watchEffect(async () => {
    if (!postStore.getBookmarks) {
      await postStore.fetchBookmarks();
    }
  });
  // following
  watchEffect(async () => {
    if (!followingStore.getFollowing(user.value?.id)) {
      await followingStore.fetchFollowing(userProfile.value?.id);
      await followingStore.fetchFollowers(userProfile.value?.id);
    }
  });
});

// Load different feed
const activeTab = ref("Posts");
const postList = computed(() => {
  if (!userProfile.value) return null;
  if (activeTab.value === "Posts") {
    console.log("load posts");
    return postStore.getUserPosts(userProfile.value.id);
  } else if (activeTab.value === "Likes") {
    console.log("load likes");
    return postStore.getLikePosts(userProfile.value.id);
  } else if (activeTab.value === "Replies") {
    console.log("load replies");
    return replyStore.getUserReplies(userProfile.value.id);
  } else return null;
});
</script>
<template>
  <div class="flex h-screen w-screen" @mousedown="handleClickOutside($event)">
    <!-- UI popup -->
    <UIPopupCollection />

    <!-- layout -->
    <MainLeft @popupPost="showPopupPost = !showPopupPost" />
    <MainBottom />
    <MainCenter userPage>
      <template #title>
        {{ userProfile?.first_name }} {{ userProfile?.last_name }}
      </template>
      <template #subtitle>
        {{ postStore.getUserPosts(userProfile.id)?.length || 0 }}
        {{
          postStore.getUserPosts(userProfile.id)?.length > 1 ? "posts" : "post"
        }}
      </template>
      <template #main>
        <!-- user profile -->
        <MainSection>
          <!-- profile background image -->
          <div class="h-60 w-full bg-zinc-800 2xl:h-96"></div>
          <!-- avatar -->
          <div
            class="relative -top-20 left-5 z-10 mt-2 h-min w-min rounded-full ring-4 ring-black"
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
              <span
                @mousedown="
                  console.log(followingStore.getFollowing(userProfile.id))
                "
                >{{
                  followingStore.getFollowing(userProfile.id)?.length
                }}&nbsp</span
              >
              <span class="pr-5 text-gray-500">Following</span>
              <!-- follower -->
              <span
                >{{
                  followingStore.getFollowers(userProfile.id)?.length
                }}&nbsp</span
              >
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
        <div class="min-h-[40rem] w-full">
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
