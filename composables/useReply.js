import { useReplyStore } from "~/stores/reply";
export default function () {
  const replyStore = useReplyStore();
  const showPopupReply = ref(false);
  const pid = ref("");
  const reply = ref("");

  watch(pid, () => {
    reply.value = "";
  });

  function clickReply(post_id) {
    pid.value = post_id;
    showPopupReply.value = true;
  }
  async function publishReply() {
    const temp = reply.value;
    reply.value = reply.value.trim();
    if (reply.value) reply.value = temp;
    if (!reply.value || !pid.value) {
      console.log("empty!");
      return;
    }
    const success = replyStore.uploadReply({
      text: reply.value,
      pictures: [],
      reply_to: pid.value,
      type: "reply",
    });
    if (success) {
      reply.value = "";
      console.log("success!!!");
      return true;
    } else {
      console.log("reply failed :(");
      return false;
    }
  }

  return { showPopupReply, pid, reply, clickReply, publishReply };
}
