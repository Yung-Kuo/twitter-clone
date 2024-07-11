<script setup>
import { usePostStore } from "~/stores/post";
import { useFollowingStore } from "~/stores/following";
const postStore = usePostStore();
const followingStore = useFollowingStore();
const user = useSupabaseUser();
const props = defineProps(["pid", "uid"]);
const route = useRoute();

const toggleMenu = inject("toggleMenu");
// edit
const { editMode, editPost, selectEditPost } = inject("useEdit");

const actionList = ref("");
const edit = {
  name: "Edit",
  function: () => {
    selectEditPost(props.pid);
    toggleMenu(props.pid, null, "post_action");
  },
};
const deletePost = {
  name: "Delete",
  function: async () =>
    (await postStore.deletePost(props.pid)) && route.params.id === props.pid
      ? navigateTo("/")
      : toggleMenu(props.pid, null, "post_action"),
};
const follow = {
  name: "Follow",
  function: async () => {
    await followingStore.followUser(props.uid);
    toggleMenu(props.pid, null, "post_action");
  },
};
const unfollow = {
  name: "Unfollow",
  function: async () => {
    await followingStore.unfollowUser(props.uid);
    toggleMenu(props.pid, null, "post_action");
  },
};
const muteThread = {
  name: "Mute this thread",
  function: null,
};
const muteUser = {
  name: "Mute this user",
  function: null,
};
const block = {
  name: "Block",
  function: null,
};
const currentUser = [edit, deletePost, muteThread];
const followedUser = [unfollow, muteUser, block];
const stranger = [follow, muteUser, block];
onMounted(() => {
  followingStore.checkIsFollowing(props.uid);
  assignActionList();
});
watch(
  () => followingStore.getFollowingStatus(props.uid),
  () => {
    assignActionList();
  }
);
function assignActionList() {
  if (props.uid === user.value.id) actionList.value = currentUser;
  else if (followingStore.getFollowingStatus(props.uid))
    actionList.value = followedUser;
  else actionList.value = stranger;
}
</script>
<template>
  <!-- relative -left-60 top-10 -->
  <div
    class="absolute z-10 mb-5 flex h-max w-60 flex-col rounded-xl bg-black text-zinc-200 shadow-3xl shadow-zinc-700"
  >
    <ul>
      <li
        v-for="action in actionList"
        @mousedown="action.function"
        class="flex h-10 w-full cursor-pointer items-center px-5 first:rounded-t-xl last:rounded-b-xl hover:bg-zinc-700 hover:bg-opacity-30 active:bg-opacity-40"
      >
        {{ action.name }}
      </li>
    </ul>
  </div>
</template>
