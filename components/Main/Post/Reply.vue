<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
const user = useSupabaseUser();
const profileStore = useProfileStore();
const postStore = usePostStore();
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
const date = computed(() => {
  const dt = new Date(post.created_at);
  // Format the date portion
  const date = dt.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
  });
  return `${date}`;
});

// click post
const { target_post, clickPost, hoverPost } = inject("clickPost");
</script>
<template>
  <MainPostHoverClickWrapper :post="post" noHover class="gap-2">
    <!-- left column / avatar -->
    <div class="flex w-10 flex-col">
      <!-- avatar for show post -->
      <div class="h-min w-min">
        <NuxtLink :to="`/${postStore.getUsername(post?.user_id)}`">
          <UIAvatar :user_id="post?.user_id" size="small"> </UIAvatar>
        </NuxtLink>
      </div>
      <!-- thread -->
      <div class="noForward flex w-full grow cursor-default justify-center">
        <span class="h-full border border-zinc-800"></span>
      </div>
    </div>
    <!-- right column -->
    <div class="flex w-[calc(100%-3rem)] flex-col">
      <!-- upper section -->
      <div class="flex h-5 w-full items-center whitespace-nowrap">
        <!-- user info -->
        <!-- name -->
        <div class="noForward font-bold hover:underline">
          <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
            <span>
              {{ postStore.getName(post.user_id) }}
            </span>
          </NuxtLink>
        </div>
        &ensp;
        <div class="flex w-max text-zinc-500">
          <!-- username -->
          <div class="noForward">
            <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
              <span> @{{ postStore.getUsername(post.user_id) }}</span>
            </NuxtLink>
          </div>
          <!-- post time -->
          <pre> · {{ date }}</pre>
          <!-- edited -->
          <pre v-if="post.edited"> · edited</pre>
        </div>
      </div>
      <!-- middle section -->
      <div class="flex max-h-[18rem] w-full flex-col gap-3 overflow-y-scroll">
        <!-- content -->
        <div v-if="post.type !== 'repost && post.text !== repost'">
          <pre>{{ post.text }}</pre>
        </div>
        <!-- repost / quote -->
        <div v-if="post.type === 'repost'" class="w-full">
          <MainPostRefer
            v-bind="postStore.getPost(post.reply_to)"
          ></MainPostRefer>
        </div>
      </div>
      <!-- lower section -->
      <div class="noForward cursor-default pb-4 pt-2">
        <!-- replying to -->
        <span class="text-zinc-500">Replying to </span>
        <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
          <span class="text-sky-500"
            >@{{ postStore.getUsername(post.user_id) }}</span
          >
        </NuxtLink>
      </div>
    </div>
  </MainPostHoverClickWrapper>
</template>
