<script setup>
import { usePostStore } from "~/stores/post";
const user = useSupabaseUser();
const postStore = usePostStore();
const emit = defineEmits(["close"]);

// reply
const { pid, publishReply } = inject("popupReply");
const reply = ref("");

const post = computed(() => postStore.getPost(pid.value));
</script>
<template>
  <UIPopupDraft @close="emit('close')">
    <template #center>
      <!-- replying post -->
      <MainPostReply v-bind="post"></MainPostReply>
      <!-- reply -->
      <div class="flex">
        <div class="h-min w-min">
          <UIAvatar :user_id="user.id" size="small"></UIAvatar>
        </div>
        <div class="grow">
          <UITextarea v-model="reply" placeholder="Post your reply" />
        </div>
      </div>
    </template>

    <template #button>
      <!-- action buttons -->
      <div class="flex justify-between">
        <div></div>
        <UIButton
          color="blue"
          :solid="true"
          @mousedown="emit('close', publishReply(pid, reply))"
          >Reply</UIButton
        >
      </div>
    </template>
  </UIPopupDraft>
</template>
