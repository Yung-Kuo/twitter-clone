export default function () {
  const postStore = usePostStore();
  const target_post = ref(null);

  async function clickPost(event) {
    let el = event.target;
    while (el?.parentElement) {
      if (el?.classList?.contains("noForward")) return;
      else if (el?.classList?.contains(target_post.value.id)) break;
      el = el.parentElement;
    }
    navigateTo(
      `/${postStore.getUsername(target_post.value.user_id)}/post/${
        target_post.value.id
      }`,
    );
  }

  function hoverPost(event) {
    let element = event.target;
    while (element?.parentElement) {
      if (element.classList?.contains(target_post.value?.id)) {
        element.classList.add(
          "bg-zinc-800",
          "bg-opacity-30",
          "ring-1",
          "ring-zinc-800",
        );
      } else if (element.classList.contains("stopHere")) {
        element.classList.remove(
          "bg-zinc-800",
          "bg-opacity-30",
          "ring-1",
          "ring-zinc-800",
        );
      }
      element = element.parentElement;
    }
  }

  return { target_post, clickPost, hoverPost };
}
