<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
import { useReplyStore } from "~/stores/reply";
const user = useSupabaseUser();
const profileStore = useProfileStore();
const postStore = usePostStore();
const replyStore = useReplyStore();
// const emit = defineEmits(["reply"]);
const post = defineProps({
  id: String,
  created_at: String,
  text: String,
  pictures: Array,
  user_id: String,
  reply_to: String,
  type: String,
  edited: Boolean,
});
// click post
const { target_post, clickPost, hoverPost } = inject("clickPost");

onMounted(async () => {
  watchEffect(async () => {
    // target_post.value = post;
    if (post.type === "repost" && post.reply_to) {
      await postStore.fetchOnePost(post.reply_to);
    }
  });
});

// timestamp
const time = computed(() => {
  const dt = new Date(post.created_at);
  // Format the time portion
  const time = dt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return time;
});
// timestamp
const date = computed(() => {
  const dt = new Date(post.created_at);
  // Format the date portion
  const date = dt.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
  });
  return `${date}`;
});
</script>
<template>
  <div
    v-if="postStore.getProfile(post?.user_id)"
    @mouseenter="
      target_post = post;
      hoverPost($event);
    "
    @mouseover="!target_post ? ((target_post = post), hoverPost($event)) : null"
    @mouseleave="
      hoverPost($event, target_post === post ? (target_post = null) : null)
    "
    @mousedown="clickPost($event)"
    class="stopHere cursor-pointer rounded-xl border-2 border-zinc-800 bg-black p-3 transition-all"
    :class="post.id"
  >
    <div class="w-full text-zinc-200">
      <!-- upper section -->
      <div class="flex h-max w-full">
        <!-- avatar -->
        <div class="noForward flex items-center">
          <NuxtLink :to="`/${postStore.getUsername(post?.user_id)}`">
            <UIAvatar :user_id="post.user_id" size="xsmall" class="">
            </UIAvatar>
          </NuxtLink>
        </div>
        <!-- user info -->
        <div class="flex items-center px-2 leading-tight">
          <!-- name -->
          <div class="noForward font-bold hover:underline">
            <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
              <span class="noForward">
                {{ postStore.getName(post.user_id) }}
              </span>
            </NuxtLink>
          </div>
          &ensp;
          <!-- username -->
          <div class="noForward text-sm text-zinc-500">
            <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
              <span class="noForward">
                @{{ postStore.getUsername(post.user_id) }}</span
              >
            </NuxtLink>
          </div>
          <div class="flex text-sm text-zinc-500">
            <!-- timestamp -->
            <div>
              <pre> · {{ date }}</pre>
            </div>
            <!-- edited -->
            <div>
              <pre v-if="post.edited"> · edited</pre>
            </div>
          </div>
        </div>
      </div>
      <!-- middle section -->
      <div class="h-full flex-col pt-3">
        <!-- content -->
        <div
          v-if="post.type !== 'repost' || post.text !== post.reply_to"
          class="w-full text-base leading-tight"
        >
          <pre>{{ post.text }}</pre>
        </div>
        <!-- repost / quote -->
        <div v-if="post.type === 'repost'" class="noForward pt-3">
          <MainPostRefer
            v-bind="postStore.getPost(post.reply_to)"
          ></MainPostRefer>
        </div>
      </div>
    </div>
  </div>
</template>
