<script setup>
import { usePostStore } from "~/stores/post";
import { useFollowingStore } from "~/stores/following";
const props = defineProps(["userId"]);
const { userId } = toRefs(props);
const user = useSupabaseUser();
const postStore = usePostStore();
const followingStore = useFollowingStore();
const userProfile = computed(() => postStore.getProfile(userId?.value));
onMounted(async () => {
  watchEffect(async () => {
    if (userId?.value) {
      await followingStore.fetchUserFollowing(userId?.value);
      await followingStore.fetchUserFollowers(userId?.value);
    }
  });
});
</script>
<template>
  <div
    class="absolute z-30 hidden h-80 w-72 rounded-2xl bg-black p-4 text-white shadow-3xl shadow-zinc-700 transition-all duration-100 md:block"
  >
    <div class="flex justify-between">
      <NuxtLink :to="`/${userProfile?.username}`">
        <UIAvatar
          :path="userProfile?.avatar_url"
          :user_id="userId"
          size="medium"
        ></UIAvatar>
      </NuxtLink>
      <!-- Extra layer of div to avoid following/follow button filling the full height because of flex -->
      <div class="h-min">
        <UIButtonFollow :uid="userProfile?.id"></UIButtonFollow>
      </div>
    </div>
    <!-- name / username -->
    <div class="py-2">
      <NuxtLink :to="`/${userProfile?.username}`">
        <span class="font-extrabold leading-none hover:underline"
          >{{ userProfile?.first_name }} {{ userProfile?.last_name }}</span
        >
      </NuxtLink>
      <br />
      <NuxtLink :to="`/${userProfile?.username}`">
        <span class="text-sm leading-none text-gray-500"
          >@{{ userProfile?.username }}</span
        >
      </NuxtLink>
    </div>
    <!-- description -->
    <div class="py-2">
      <pre>{{ userProfile?.description }}</pre>
    </div>
    <!-- following / followers -->
    <div class="pt-2 text-sm">
      <!-- following -->
      <span>{{ followingStore.getUserFollowing.length }}&nbsp</span>
      <span class="pr-5 text-gray-500">Following</span>
      <!-- follower -->
      <span>{{ followingStore.getUserFollowers.length }}&nbsp</span>
      <span class="text-gray-500">Follower</span>
    </div>
  </div>
</template>
