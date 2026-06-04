import type { PostRow } from "~/composables/injection-types";

export default function useClickPost() {
  const profileStore = useProfileStore();
  const target_post = ref<PostRow | null>(null);

  async function clickPost(event: MouseEvent) {
    const post = target_post.value;
    if (!post) return;

    let el = event.target as HTMLElement | null;
    while (el?.parentElement) {
      if (el.classList?.contains("noForward")) return;
      else if (el.classList?.contains(post.id)) break;
      el = el.parentElement;
    }
    navigateTo(
      `/${profileStore.usernameById(post.user_id)}/post/${post.id}`,
    );
  }

  function hoverPost(event: MouseEvent) {
    const post = target_post.value;
    if (!post) return;

    let element = event.target as HTMLElement | null;
    while (element?.parentElement) {
      if (element.classList?.contains(post.id)) {
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
