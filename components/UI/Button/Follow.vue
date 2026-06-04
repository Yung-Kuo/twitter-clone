<script setup lang="ts">
import { useFollowMutation } from "~/queries/hooks/useFollowMutation";
import { useFollowingStore } from "~/stores/following";

const followingStore = useFollowingStore();
const followMutation = useFollowMutation();
const user = useSupabaseUser();

const props = defineProps<{
  uid?: string;
}>();

const following_hover = ref(false);
</script>
<template>
  <div v-if="props?.uid" class="min-w-max">
    <!-- self -->
    <NuxtLink v-if="props.uid === user?.id" to="/profile">
      <UIButton color="white"> Edit Profile </UIButton>
    </NuxtLink>
    <!-- other user -->
    <UIButton
      v-else
      color="white"
      :solid="!followingStore.getFollowingStatus(props?.uid)"
      :turn-red="followingStore.getFollowingStatus(props?.uid)"
      @click="
        followMutation.mutate({
          targetUid: props.uid,
          following: Boolean(followingStore.getFollowingStatus(props.uid)),
        })
      "
      @mouseenter="following_hover = true"
      @mouseleave="following_hover = false"
    >
      <!-- already followed -->
      <div
        v-if="followingStore.getFollowingStatus(props?.uid)"
        class="grid grid-cols-1 grid-rows-1"
      >
        <span
          class="col-start-1 row-start-1"
          :class="following_hover ? 'invisible z-0' : 'visible z-10'"
          >Following</span
        >
        <span
          class="col-start-1 row-start-1"
          :class="following_hover ? 'visible z-10' : 'invisible z-0'"
          >Unfollow</span
        >
      </div>
      <!-- stranger -->
      <div v-else>
        <span>Follow</span>
      </div>
    </UIButton>
  </div>
</template>
