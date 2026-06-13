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

const { hoveredPostId, syncHoveredPost, handleHoverLeave, navigateToPost } =
  inject(clickPostKey);
</script>
<template>
  <article
    :data-post-id="post.id"
    :class="[
      props.hasRing ? null : '!ring-0',
      !props.noHover && hoveredPostId === post.id
        ? 'bg-zinc-800 bg-opacity-30 ring-1 ring-zinc-800'
        : null,
    ]"
    class="flex w-full cursor-pointer text-zinc-200 transition-colors"
    @mouseover="!props.noHover && syncHoveredPost($event)"
    @mouseleave="!props.noHover && handleHoverLeave($event, post.id)"
    @click="navigateToPost(post)"
  >
    <slot />
  </article>
</template>
