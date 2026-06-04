export default function useWritePost() {
  const profileStore = useProfileStore();
  const postStore = usePostStore();
  const route = useRoute();
  const showPopupPost = ref(false);
  const newPost = ref("");
  const repost_pid = ref("");

  async function publishPost() {
    const trimmed = newPost.value.trim();
    if (!trimmed) {
      return;
    }
    const address = await postStore.uploadPost({
      text: trimmed,
      pictures: [],
      reply_to: null,
      type: "post",
    });
    if (address) {
      newPost.value = "";
      if (
        route.fullPath !== "/" &&
        route.fullPath !== `/${profileStore.getUsername}`
      )
        navigateTo(address);
      return true;
    }
    return false;
  }

  async function publishRepost(pid: string) {
    const address = await postStore.uploadPost({
      text: pid,
      pictures: [],
      reply_to: pid,
      type: "repost",
    });
    if (address) {
      newPost.value = "";
      repost_pid.value = "";
      if (
        route.fullPath !== "/" &&
        route.fullPath !== `/${profileStore.getUsername}`
      )
        navigateTo(address);
    }
  }

  async function publishQuote() {
    const address = await postStore.uploadPost({
      text: newPost.value,
      pictures: [],
      reply_to: repost_pid.value,
      type: "repost",
    });
    if (address) {
      newPost.value = "";
      repost_pid.value = "";
      if (
        route.fullPath !== "/" &&
        route.fullPath !== `/${profileStore.getUsername}`
      )
        navigateTo(address);
    }
  }

  return {
    showPopupPost,
    newPost,
    repost_pid,
    publishPost,
    publishRepost,
    publishQuote,
  };
}
