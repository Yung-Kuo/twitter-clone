<script setup>
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
</script>
<template>
  <div
    :class="post.id"
    class="stopHere cursor-pointer !ring-0 transition-all"
    @mouseenter="
      target_post = post;
      hoverPost($event);
    "
    @mouseover="!target_post ? ((target_post = post), hoverPost($event)) : null"
    @mouseleave="
      hoverPost(
        $event,
        target_post?.id === post.id ? (target_post = null) : null
      )
    "
    @mousedown="clickPost($event)"
  >
    <slot />
  </div>
</template>
