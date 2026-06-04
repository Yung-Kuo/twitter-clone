import type { PostRow } from "~/composables/injection-types";

export default function useEdit() {
  const postStore = usePostStore();
  const showPopupEdit = ref(false);
  const editPost = ref<PostRow | null>(null);
  const newText = ref("");

  function selectEditPost(pid: string) {
    editPost.value = postStore.getPost(pid);
    if (!editPost.value) return;
    if (
      editPost.value.type === "repost" &&
      editPost.value.text === editPost.value.reply_to
    ) {
      newText.value = "";
    } else {
      newText.value = editPost.value.text ?? "";
    }
    showPopupEdit.value = true;
  }

  async function publishEdit() {
    if (newText.value && editPost.value) {
      return await postStore.updatePost({
        id: editPost.value.id,
        text: newText.value,
      });
    }
  }

  return { showPopupEdit, editPost, newText, selectEditPost, publishEdit };
}
