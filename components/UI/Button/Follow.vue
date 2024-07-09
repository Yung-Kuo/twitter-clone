<script setup>
import { useFollowingStore } from "~/stores/following";
const followingStore = useFollowingStore();
const user = useSupabaseUser();
const props = defineProps(["uid"]);
const following_hover = ref(false);
onMounted(async () => {
  await followCheck();
});
watch(
  () => props.uid,
  async () => {
    await followCheck();
  }
);
async function followCheck() {
  if (props.uid) {
    if (props.uid != user.value.id) {
      await followingStore.checkIsFollowing(props.uid);
    }
  }
}
</script>
<template>
  <!-- self -->
  <NuxtLink to="/profile" v-if="props.uid === user.id">
    <UIButton color="white" :solid="false"> Edit Profile </UIButton>
  </NuxtLink>
  <!-- following -->
  <UIButton
    v-else-if="followingStore.getFollowingStatus(props.uid)"
    @click="followingStore.unfollowUser(props.uid)"
    @mouseenter="following_hover = true"
    @mouseleave="following_hover = false"
    color="white"
    :solid="false"
    :turnRed="true"
  >
    <div class="grid grid-cols-1 grid-rows-1">
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
  </UIButton>
  <!-- stranger -->
  <UIButton
    v-else-if="!followingStore.getFollowingStatus(props.uid)"
    @click="followingStore.followUser(props.uid)"
    color="white"
    :solid="true"
    >Follow</UIButton
  >
</template>
