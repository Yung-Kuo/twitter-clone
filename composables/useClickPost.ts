import type { PostRow } from "~/composables/injection-types";

function innermostPostId(el: HTMLElement | null): string | null {
  let node: HTMLElement | null = el;
  while (node) {
    if (node.classList?.contains("stopHere") && node.dataset.postId) {
      return node.dataset.postId;
    }
    node = node.parentElement;
  }
  return null;
}

export default function useClickPost() {
  const profileStore = useProfileStore();
  const target_post = ref<PostRow | null>(null);
  const hoveredPostId = ref<string | null>(null);

  function syncHoveredPost(event: MouseEvent) {
    hoveredPostId.value = innermostPostId(event.target as HTMLElement);
  }

  function handleHoverLeave(event: MouseEvent, postId: string) {
    const related = event.relatedTarget as HTMLElement | null;
    if (related?.closest?.(".stopHere")) {
      hoveredPostId.value = innermostPostId(related);
      return;
    }
    if (hoveredPostId.value === postId) {
      hoveredPostId.value = null;
    }
  }

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

  return { target_post, hoveredPostId, syncHoveredPost, handleHoverLeave, clickPost };
}
