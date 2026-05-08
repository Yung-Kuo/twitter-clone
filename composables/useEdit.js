export default function () {
  const postStore = usePostStore();
  const showPopupEdit = ref(false);
  const editPost = ref(null);
  const newText = ref("");

  function selectEditPost(pid) {
    editPost.value = postStore.getPost(pid);
    if (
      editPost.value.type === "repost" &&
      editPost.value.text === editPost.value.reply_to
    ) {
      newText.value = "";
    } else {
      newText.value = editPost.value.text;
    }
    showPopupEdit.value = true;
  }
  async function publishEdit() {
    if (newText.value) {
      return await postStore.updatePost({
        id: editPost.value.id,
        text: newText.value,
      });
    } else {
      return;
    }
  }

  return { showPopupEdit, editPost, newText, selectEditPost, publishEdit };
}
