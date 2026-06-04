import { useReplyStore } from "~/stores/reply";

export default function useReply() {
  const replyStore = useReplyStore();
  const showPopupReply = ref(false);
  const pid = ref("");

  function clickReply(post_id: string) {
    pid.value = post_id;
    showPopupReply.value = true;
  }

  async function publishReply(post_id: string, text: string) {
    const temp = text.trim();
    if (!temp) {
      return false;
    }
    const success = await replyStore.uploadReply({
      text,
      pictures: [],
      reply_to: post_id,
      type: "reply",
    });
    return !!success;
  }

  return { showPopupReply, pid, clickReply, publishReply };
}
