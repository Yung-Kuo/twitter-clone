<script setup>
const user = useSupabaseUser();
const profileStore = useProfileStore();
const followingStore = useFollowingStore();

onMounted(async () => {
  if (!followingStore.getFollowing(user.value.id)) {
    await followingStore.fetchFollowing(user.value.id);
    await followingStore.fetchFollowers(user.value.id);
  }
});
</script>
<template>
  <div
    class="absolute -left-3/4 top-0 flex h-screen w-3/4 flex-col p-5 md:hidden"
  >
    <div class="flex h-min w-full flex-col gap-2 p-4">
      <NuxtLink :to="`/${profileStore.getUsername}`" class="w-min rounded-full">
        <UIAvatar :user_id="user.id" size="small" />
      </NuxtLink>
      <!-- user info -->
      <NuxtLink :to="`/${profileStore.getUsername}`" class="w-max max-w-full">
        <span class="text-lg text-zinc-200">{{ profileStore.getName }}</span>
        <div
          class="h-5 w-full overflow-y-hidden overflow-x-scroll whitespace-nowrap text-zinc-500"
        >
          <span>@{{ profileStore.getUsername }}</span>
        </div>
      </NuxtLink>
      <!-- following status -->
      <div>
        <!-- following -->
        <span class="text-zinc-200"
          >{{ followingStore.getFollowing(user.id)?.length }}&nbsp</span
        >
        <span class="pr-5 text-gray-500">Following</span>
        <!-- follower -->
        <span class="text-zinc-200"
          >{{ followingStore.getFollowers(user.id)?.length }}&nbsp</span
        >
        <span class="text-gray-500">Follower</span>
      </div>
    </div>
    <!-- profile -->
    <NuxtLink :to="`/${profileStore.getUsername}`">
      <MainMenuEntry>
        <template #smMenu>
          <IconsProfile />
        </template>
        <template #title>Profile</template>
      </MainMenuEntry>
    </NuxtLink>
    <!-- bookmark -->
    <NuxtLink to="/bookmarks">
      <MainMenuEntry>
        <template #smMenu>
          <IconsBookmark />
        </template>
        <template #title>Bookmarks</template>
      </MainMenuEntry>
    </NuxtLink>
  </div>
</template>
