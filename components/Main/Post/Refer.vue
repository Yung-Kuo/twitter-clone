<script setup>
import { usePostStore } from "~/stores/post";

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

const quotedPost = computed(() => {
  if (post.type !== "repost" || !post.reply_to) return null;
  return postStore.getPost(post.reply_to) ?? null;
});
</script>
<template>
  <MainPostHoverClickWrapper
    v-if="post.id"
    :post="post"
    has-ring
    class="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-black p-3 tracking-wide md:border-2"
  >
    <MainPostHeader :post="post" variant="refer" />
    <MainPostBody :post="post">
      <MainPostInteractive v-if="quotedPost" class="mt-3 w-full">
        <MainPostRefer v-bind="quotedPost" />
      </MainPostInteractive>
    </MainPostBody>
  </MainPostHoverClickWrapper>
</template>
