<script setup>
import { clickPostKey } from "~/composables/keys";

const props = defineProps({
  post: Object,
  noHover: {
    type: Boolean,
    default: false,
  },
  hasRing: {
    type: Boolean,
    default: false,
  },
});
const { post } = toRefs(props);

const { target_post, hoveredPostId, syncHoveredPost, handleHoverLeave, clickPost } =
  inject(clickPostKey);
</script>
<template>
  <article
    :data-post-id="post.id"
    :class="[
      post.id,
      props.hasRing ? null : '!ring-0',
      !props.noHover && hoveredPostId === post.id
        ? 'bg-zinc-800 bg-opacity-30 ring-1 ring-zinc-800'
        : null,
    ]"
    class="stopHere flex w-full cursor-pointer text-zinc-200 transition-all"
    @mouseover="!props.noHover && syncHoveredPost($event)"
    @mouseleave="
      !props.noHover && handleHoverLeave($event, post.id);
      target_post?.id === post.id && (target_post = null);
    "
    @mousedown="((target_post = post), clickPost($event))"
  >
    <slot />
  </article>
</template>
