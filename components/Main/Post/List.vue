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
        :showAuthorReply="props.showAuthorReply"
      ></MainPost>
    </li>
  </ul>
</template>
