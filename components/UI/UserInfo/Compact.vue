<script setup>
import { usePostStore } from "~/stores/post";

const postStore = usePostStore();
const props = defineProps({
  user_id: {
    type: String,
    default: null,
  },
});
const userProfile = computed(() => postStore.getProfile(props.user_id));
</script>
<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <!-- avatar -->
      <NuxtLink :to="`/${postStore.getUsername(props.user_id)}`">
        <UIAvatar size="small" :user_id="props.user_id" />
      </NuxtLink>
      <div class="flex w-min flex-col leading-tight">
        <!-- name -->
        <NuxtLink :to="`/${postStore.getUsername(props.user_id)}`">
          <span class="text-zinc-200 hover:underline">{{
            postStore.getName(props.user_id)
          }}</span>
        </NuxtLink>
        <!-- username -->
        <NuxtLink :to="`/${postStore.getUsername(props.user_id)}`">
          <span class="text-sm text-zinc-500"
            >@{{ postStore.getUsername(props.user_id) }}</span
          >
        </NuxtLink>
      </div>
      <div class="grow" />
      <UIButtonFollow :uid="props.user_id" />
    </div>
  </div>
</template>
