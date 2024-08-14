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
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
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
      <div class="flex w-min flex-col leading-tight">
        <!-- name -->
        <NuxtLink :to="`/${postStore.getUsername(props.user_id)}`">
          <span
            :id="`${props.user_id}_user_info_name`"
            class="text-zinc-200 hover:underline"
            @mouseenter="showProfileCard($event.target.id, props.user_id)"
            @mouseleave="hideProfileCard()"
            >{{ postStore.getName(props.user_id) }}</span
          >
        </NuxtLink>
        <!-- username -->
        <NuxtLink :to="`/${postStore.getUsername(props.user_id)}`">
          <span
            :id="`${props.user_id}_user_info_username`"
            class="text-sm text-zinc-500"
            @mouseenter="showProfileCard($event.target.id, props.user_id)"
            @mouseleave="hideProfileCard()"
            >@{{ postStore.getUsername(props.user_id) }}</span
          >
        </NuxtLink>
      </div>
      <div class="grow" />
      <UIButtonFollow :uid="props.user_id" />
    </div>
    <div class="flex gap-2 leading-tight">
      <div class="w-10"></div>
      <!-- description -->
      <div class="w-[calc(100%-3rem)]">
        <NuxtLink :to="`/${postStore.getUsername(props.user_id)}`">
          <pre class="whitespace-normal break-words">{{
            userProfile?.description
          }}</pre>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
