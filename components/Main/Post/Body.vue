<script setup lang="ts">
type PostBodyPost = {
  type?: string;
  text?: string;
  reply_to?: string;
  created_at?: string;
  edited?: boolean;
};

const props = withDefaults(
  defineProps<{
    post: PostBodyPost;
    textSize?: "default" | "large";
    showTimestamp?: boolean;
  }>(),
  { textSize: "default", showTimestamp: false },
);

const time = computed(() => {
  if (!props.post.created_at) return "";
  const dt = new Date(props.post.created_at);
  return dt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
});

const date = computed(() => {
  if (!props.post.created_at) return "";
  const dt = new Date(props.post.created_at);
  return dt.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});
</script>

<template>
  <div
    class="flex w-full flex-col"
    :class="{
      'pl-2': !showTimestamp,
      'gap-3 py-3': showTimestamp,
      'h-full': showTimestamp,
    }"
  >
    <div
      v-if="post.type !== 'repost' || post.text !== post.reply_to"
      class="w-full"
      :class="{ 'text-lg': textSize === 'large' }"
    >
      <pre>{{ post.text }}</pre>
    </div>
    <slot />
    <div v-if="showTimestamp" class="flex text-zinc-500">
      <div class="hover:underline">
        <pre>{{ time }} · {{ date }}</pre>
      </div>
      <pre v-if="post.edited"> · edited</pre>
    </div>
  </div>
</template>
