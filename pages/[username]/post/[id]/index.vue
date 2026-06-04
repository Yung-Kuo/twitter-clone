<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
import { useReplyStore } from "~/stores/reply";
import { useFollowingStore } from "~/stores/following";
import { handleClickOutsideKey, showPopupPostKey } from "~/composables/keys";

definePageMeta({
  middleware: ["auth"],
});
const user = useSupabaseUser();
const profileStore = useProfileStore();
const postStore = usePostStore();
const replyStore = useReplyStore();
const followingStore = useFollowingStore();
const route = useRoute();

const handleClickOutside = inject(handleClickOutsideKey);
const showPopupPost = inject(showPopupPostKey);

onMounted(async () => {
  watchEffect(async () => {
    if (!user.value) {
      navigateTo("/login");
    }
    if (profileStore.noProfile) {
      await profileStore.fetchProfile();
      await profileStore.fetchUserProfile(user.value.id);
    }
  });
  watchEffect(async () => {
    if (!post.value) await postStore.fetchOnePost(route.params.id);
    if (!post.value) navigateTo("/");
    // if (!replyList.value) await replyStore.fetchReplies(post.value.id);
    await replyStore.fetchReplies(post.value?.id);
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
        // await nextTick();
        // scrollToTarget();
        setTimeout(() => {
          scrollToTarget();
        }, 500);
        initialScroll.value = false;
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
  target.value.scrollIntoView({ block: "start", behavior: "instant" });
  // initialScroll.value = false;
}
</script>
<template>
  <div class="flex h-screen w-screen" @mousedown="handleClickOutside($event)">
    <!-- UI popup -->
    <UIPopupCollection />
    <!-- layout -->
    <MainLeft @popup-post="showPopupPost = true" />
    <MainBottom />
    <MainCenter :initial-scroll="initialScroll">
      <template #title>Post</template>
      <template #main>
        <!-- upper section -->
        <MainSection class="noForward">
          <!-- reply thread -->
          <!-- <ul v-if="thread.length > 0">
            <li v-for="threadPost in thread" :key="threadPost.id">
              <MainPostReplyThread :post="threadPost" noHover />
            </li>
          </ul> -->
          <MainPostList v-if="thread.length > 0" :post-list="thread" />
          <div ref="target" class="scroll-mt-12 md:scroll-mt-14"/>
          <!-- main post -->
          <MainPostSingle v-bind="post"/>
        </MainSection>
        <!-- lower section -->
        <div class="min-h-[40rem]">
          <!-- replies -->
          <!-- <ul>
            <li v-for="post in replyList" :key="post.id">
              <MainPost :post="post" showAuthorReply />
            </li>
          </ul> -->
          <MainPostList :post-list="replyList" show-author-reply />
        </div>
      </template>
    </MainCenter>
  </div>
</template>
