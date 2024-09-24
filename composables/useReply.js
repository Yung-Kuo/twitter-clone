import { useReplyStore } from "~/stores/reply";
export default function () {
  const replyStore = useReplyStore();
  const showPopupReply = ref(false);
  const pid = ref("");

  function clickReply(post_id) {
    pid.value = post_id;
    showPopupReply.value = true;
  }
  async function publishReply(post_id, text) {
    // check if text is empty
    let temp = text.trim();
    if (!temp) {
      console.log("empty!");
      return;
    }
    const success = replyStore.uploadReply({
      text: text,
      pictures: [],
      reply_to: post_id,
      type: "reply",
    });
    if (success) {
      console.log("success!!!");
      return true;
    } else {
      console.log("reply failed :(");
      return false;
    }
  }

  return { showPopupReply, pid, clickReply, publishReply };
}
