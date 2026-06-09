<script setup>
import { usePostStore } from "~/stores/post";
import { useProfileStore } from "~/stores/profile";
const postStore = usePostStore();
const profileStore = useProfileStore();
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
    has-ring
    class="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-black p-3 tracking-wide md:border-2"
  >
    <!-- upper section -->
    <div class="flex h-min w-full">
      <!-- avatar -->
      <div class="noForward flex w-min items-center">
        <NuxtLink :to="`/${profileStore.usernameById(post?.user_id)}`">
          <UIAvatar :user_id="post.user_id" size="xsmall" />
        </NuxtLink>
      </div>
      <!-- user info -->
      <div
        class="flex h-8 w-full items-center overflow-hidden whitespace-nowrap px-2 leading-none"
      >
        <!-- name -->
        <div
          class="noForward flex w-min font-bold hover:underline"
          @mouseenter="showProfileCard($event.currentTarget, post.user_id)"
          @mouseleave="hideProfileCard()"
        >
          <NuxtLink :to="`/${profileStore.usernameById(post.user_id)}`">
            <span>
              {{ profileStore.nameById(post.user_id) }}
            </span>
          </NuxtLink>
        </div>
        &ensp;
        <div class="flex flex-grow overflow-x-scroll text-sm text-zinc-500">
          <div class="flex w-max">
            <!-- username -->
            <div class="noForward">
              <NuxtLink :to="`/${profileStore.usernameById(post.user_id)}`">
                <span> @{{ profileStore.usernameById(post.user_id) }}</span>
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
    </div>
    <!-- middle section -->
    <div class="flex w-full flex-col gap-3">
      <!-- content -->
      <div v-if="post.type !== 'repost' || post.text !== post.reply_to">
        <pre>{{ post.text }}</pre>
      </div>
      <!-- repost / quote -->
      <div v-if="post.type === 'repost'" class="noForward">
        <MainPostRefer v-bind="postStore.getPost(post.reply_to)" />
      </div>
    </div>
  </MainPostHoverClickWrapper>
</template>
