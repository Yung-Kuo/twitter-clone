export default function () {
  const postStore = usePostStore();
  const target_post = ref(null);
  // process click post noForward
  async function clickPost(event) {
    const element = ref(null);
    element.value = event.target;
    while (element.value && element.value !== document.body) {
      console.log("run click post");
      if (element?.value.classList.contains("noForward")) return;
      else if (element?.value.classList.contains(target_post.value.id)) break;
      element.value = element.value.parentElement;
    }
    console.log(
      `/${postStore.getUsername(target_post.value.user_id)}/post/${
        target_post.value.id
      }`
    );
    navigateTo(
      `/${postStore.getUsername(target_post.value.user_id)}/post/${
        target_post.value.id
      }`
    );
  }
  function hoverPost(event) {
    const element = ref(null);
    element.value = event.target;
    while (element.value && element.value !== document.body) {
      if (element.value.classList.contains(target_post.value?.id)) {
        element.value.classList.add(
          "bg-zinc-800",
          "bg-opacity-30",
          "ring-1",
          "ring-zinc-800"
        );
      } else if (element.value.classList.contains("stopHere")) {
        element.value.classList.remove(
          "bg-zinc-800",
          "bg-opacity-30",
          "ring-1",
          "ring-zinc-800"
        );
      }
      element.value = element.value.parentElement;
    }
  }

  return { target_post, clickPost, hoverPost };
}
