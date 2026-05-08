<script setup>
import { usePostStore } from "~/stores/post";
const postStore = usePostStore();
const props = defineProps({
  user_id: {
    type: String,
    default: null,
  },
});
const { showProfileCard, hideProfileCard } = inject("profileCard");
</script>
<template>
  <div class="flex h-min w-full items-center gap-2">
    <!-- avatar -->
    <NuxtLink :to="`/${postStore.getUsername(props.user_id)}`">
      <span
        class="inline-flex"
        @mouseenter="showProfileCard($event.currentTarget, props.user_id)"
        @mouseleave="hideProfileCard()"
      >
        <UIAvatar size="small" :user_id="props.user_id" />
      </span>
    </NuxtLink>
    <div
      class="flex h-10 grow flex-col overflow-hidden whitespace-nowrap leading-none"
    >
      <!-- name -->
      <NuxtLink
        :to="`/${postStore.getUsername(props.user_id)}`"
        class="h-1/2 w-full overflow-y-hidden overflow-x-scroll"
      >
        <span
          class="text-zinc-200 hover:underline"
          @mouseenter="
            showProfileCard($event.currentTarget, props.user_id)
          "
          @mouseleave="hideProfileCard()"
          >{{ postStore.getName(props.user_id) }}</span
        >
      </NuxtLink>
      <!-- username -->
      <NuxtLink
        :to="`/${postStore.getUsername(props.user_id)}`"
        class="h-1/2 overflow-y-hidden overflow-x-scroll"
      >
        <span
          class="text-sm text-zinc-500"
          @mouseenter="
            showProfileCard($event.currentTarget, props.user_id)
          "
          @mouseleave="hideProfileCard()"
          >@{{ postStore.getUsername(props.user_id) }}</span
        >
      </NuxtLink>
    </div>
    <UIButtonFollow :uid="props.user_id" />
  </div>
</template>
