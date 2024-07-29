export default function () {
  const profileStore = useProfileStore();
  const postStore = usePostStore();
  const route = useRoute();
  const showPopupPost = ref(false);
  // write new post
  const newPost = ref("");
  // for repost
  const repost_pid = ref("");

  // post
  async function publishPost() {
    const temp = newPost.value;
    newPost.value = newPost.value.trim();
    if (newPost.value) newPost.value = temp;
    if (!newPost.value) {
      console.log("empty!");
      return;
    }
    const address = await postStore.uploadPost({
      text: newPost.value,
      pictures: [],
      reply_to: null,
      type: "post",
    });
    if (address) {
      newPost.value = "";
      // navigate to post page if not at home page
      if (
        route.fullPath !== "/" &&
        route.fullPath !== `/${profileStore.getUsername}`
      )
        navigateTo(address);
      return true;
    } else return false;
  }
  // retweet
  async function publishRepost(pid) {
    const address = await postStore.uploadPost({
      text: pid,
      reply_to: pid,
      type: "repost",
    });
    if (address) {
      newPost.value = "";
      repost_pid.value = "";
      console.log("address: ", address);
      // navigate to post page if not at home page
      if (
        route.fullPath !== "/" &&
        route.fullPath !== `/${profileStore.getUsername}`
      )
        navigateTo(address);
    }
  }
  // quote tweet
  async function publishQuote() {
    const address = await postStore.uploadPost({
      text: newPost.value,
      reply_to: repost_pid.value,
      type: "repost",
    });
    if (address) {
      newPost.value = "";
      repost_pid.value = "";
      console.log("address: ", address);
      // navigate to post page if not at home page
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
