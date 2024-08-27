<script setup>
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

// click post
const { target_post, clickPost, hoverPost } = inject("clickPost");
</script>
<template>
  <div
    :class="[post.id, props.hasRing ? null : '!ring-0']"
    class="stopHere flex w-full cursor-pointer text-zinc-200 transition-all"
    @mouseenter="
      target_post = post;
      props.noHover ? null : hoverPost($event);
    "
    @mouseover="
      target_post
        ? null
        : ((target_post = post), props.noHover ? null : hoverPost($event))
    "
    @mouseleave="
      target_post?.id === post.id ? (target_post = null) : null;
      props.noHover ? null : hoverPost($event);
    "
    @mousedown="target_post?.id === post.id ? clickPost($event) : null"
  >
    <slot />
  </div>
</template>
