import { useLikeMutation } from "~/queries/hooks/useLikeMutation";
import { useBookmarkMutation } from "~/queries/hooks/useBookmarkMutation";
import { usePostStore } from "~/stores/post";

export default function useLikeBookmark() {
  const user = useSupabaseUser();
  const postStore = usePostStore();
  const likeMutation = useLikeMutation();
  const bookmarkMutation = useBookmarkMutation();

  function clickLike(pid: string) {
    if (!user.value?.id) return;
    likeMutation.mutate({
      postId: pid,
      liked: postStore.checkLike(pid),
    });
  }

  function clickBookmark(pid: string) {
    bookmarkMutation.mutate({
      postId: pid,
      bookmarked: postStore.checkBookmark(pid),
    });
  }

  return { clickLike, clickBookmark };
}
