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
  <MainPostHoverClickWrapper
    :post="post"
    hasRing
    class="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-black p-3 md:border-2"
  >
    <!-- upper section -->
    <div class="flex h-min w-full">
      <!-- avatar -->
      <div class="noForward flex w-min items-center">
        <NuxtLink :to="`/${postStore.getUsername(post?.user_id)}`">
          <UIAvatar :user_id="post.user_id" size="xsmall"> </UIAvatar>
        </NuxtLink>
      </div>
      <!-- user info -->
      <div
        class="flex h-8 grow items-center overflow-x-scroll whitespace-nowrap px-2 leading-none"
      >
        <!-- name -->
        <div class="noForward flex h-5 items-center font-bold hover:underline">
          <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
            <span class="noForward">
              {{ postStore.getName(post.user_id) }}
            </span>
          </NuxtLink>
        </div>
        &ensp;
        <div class="flex items-center text-sm text-zinc-500">
          <!-- username -->
          <div class="noForward">
            <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
              <span class="noForward">
                @{{ postStore.getUsername(post.user_id) }}</span
              >
            </NuxtLink>
          </div>
          <div class="flex w-max">
            <!-- timestamp -->
            <pre> · {{ date }}</pre>
            <!-- edited -->
            <pre v-if="post.edited"> · edited</pre>
          </div>
        </div>
      </div>
    </div>
    <!-- middle section -->
    <div class="flex w-full flex-col gap-3">
      <!-- content -->
      <div v-if="post.type !== 'repost' || post.text !== post.reply_to">
        <pre>{{ post.text }}</pre>
      </div>
      <!-- repost / quote -->
      <div v-if="post.type === 'repost'" class="noForward">
        <MainPostRefer
          v-bind="postStore.getPost(post.reply_to)"
        ></MainPostRefer>
      </div>
    </div>
  </MainPostHoverClickWrapper>
</template>
