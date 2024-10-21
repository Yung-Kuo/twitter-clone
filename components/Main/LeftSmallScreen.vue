<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();
const profileStore = useProfileStore();
const postStore = usePostStore();
const replyStore = useReplyStore();
const followingStore = useFollowingStore();

onMounted(async () => {
  if (!followingStore.getFollowing(user.value.id)) {
    await followingStore.fetchFollowing(user.value.id);
  }
  if (!followingStore.getFollowers(user.value.id)) {
    await followingStore.fetchFollowers(user.value.id);
  }
});

async function signOut() {
  const { error } = await client.auth.signOut();
  profileStore.clearProfile();
  postStore.clearBookmarks();
  replyStore.clearReplies();
  followingStore.clearFollowing();
}
</script>
<template>
  <div
    class="absolute -left-[20rem] top-0 flex h-full w-[20rem] flex-col p-5 text-zinc-200 md:hidden"
  >
    <!-- user info -->
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
        <span class="pr-5 text-zinc-500">Following</span>
        <!-- follower -->
        <span class="text-zinc-200"
          >{{ followingStore.getFollowers(user.id)?.length }}&nbsp</span
        >
        <span class="text-zinc-500">Follower</span>
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
          <IconsBookmark class="text-zinc-200" />
        </template>
        <template #title>Bookmarks</template>
      </MainMenuEntry>
    </NuxtLink>
    <!-- space filler -->
    <div class="grow"></div>
    <!-- logout -->
    <MainMenuEntry @mousedown="signOut()">
      <template #smMenu>
        <IconsLogout class="text-zinc-200" />
      </template>
      <template #title>Logout</template>
    </MainMenuEntry>
    <!-- space filler -->
    <div class="grow"></div>
  </div>
</template>
