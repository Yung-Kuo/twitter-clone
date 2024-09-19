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

// profile card
const { showProfileCard, hideProfileCard } = inject("profileCard");
</script>
<template>
  <div class="flex h-min w-full items-center gap-2">
    <!-- avatar -->
    <NuxtLink :to="`/${postStore.getUsername(props.user_id)}`">
      <UIAvatar
        :id="`${props.user_id}_user_info_avatar`"
        size="small"
        :user_id="props.user_id"
        @mouseenter="showProfileCard($event.target.id, props.user_id)"
        @mouseleave="hideProfileCard()"
      />
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
          :id="`${props.user_id}_user_info_name`"
          class="text-zinc-200 hover:underline"
          @mouseenter="showProfileCard($event.target.id, props.user_id)"
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
          :id="`${props.user_id}_user_info_username`"
          class="text-sm text-zinc-500"
          @mouseenter="showProfileCard($event.target.id, props.user_id)"
          @mouseleave="hideProfileCard()"
          >@{{ postStore.getUsername(props.user_id) }}</span
        >
      </NuxtLink>
    </div>
    <UIButtonFollow :uid="props.user_id" />
  </div>
</template>
