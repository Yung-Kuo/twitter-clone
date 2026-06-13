import type { PostRow } from "~/composables/injection-types";

function innermostPostId(el: HTMLElement | null): string | null {
  const node = el?.closest?.("[data-post-id]");
  return node?.getAttribute("data-post-id") ?? null;
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
    const relatedId = innermostPostId(related);
    if (relatedId) {
      hoveredPostId.value = relatedId;
      return;
    }
    if (hoveredPostId.value === postId) {
      hoveredPostId.value = null;
    }
  }

  async function navigateToPost(post: PostRow) {
    const username = profileStore.usernameById(post.user_id);
    if (!username) return;
    await navigateTo(`/${username}/post/${post.id}`);
  }

  return {
    target_post,
    hoveredPostId,
    syncHoveredPost,
    handleHoverLeave,
    navigateToPost,
  };
}
