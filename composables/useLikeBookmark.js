export default function () {
  const user = useSupabaseUser();
  const postStore = usePostStore();
  async function clickLike(pid) {
    if (!postStore.checkLike(pid)) {
      await postStore.likePost(pid);
      await postStore.fetchLikePosts(user.value.id);
    } else await postStore.unlikePost(pid);
  }
  async function clickBookmark(pid) {
    if (!postStore.checkBookmark(pid)) {
      await postStore.bookmarkPost(pid);
      await postStore.fetchBookmarkPosts();
    } else await postStore.unbookmarkPost(pid);
  }

  return { clickLike, clickBookmark };
}
