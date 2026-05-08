<script setup>
const props = defineProps({
  postList: {
    type: Array,
    required: true,
  },
  showAuthorReply: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <ul>
    <li v-for="post in props.postList" :key="post.id">
      <MainPost
        :post="post"
        :show-author-reply="props.showAuthorReply"
      />
    </li>
  </ul>
</template>
