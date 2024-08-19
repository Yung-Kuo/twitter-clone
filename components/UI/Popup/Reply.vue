<script setup>
import { usePostStore } from "~/stores/post";
const user = useSupabaseUser();
const postStore = usePostStore();
const emit = defineEmits(["close"]);

// reply
const { pid, reply, publishReply } = inject("popupReply");

const post = computed(() => postStore.getPost(pid.value));
</script>
<template>
  <UIPopupDraft @close="emit('close')">
    <template #center>
      <!-- replying post -->
      <!-- <div class="max-h-[40rem] min-h-full overflow-y-scroll"> -->
      <MainPostReply v-bind="post"></MainPostReply>
      <!-- </div> -->
      <!-- reply -->
      <div class="flex">
        <div class="h-min w-min">
          <UIAvatar :user_id="user.id" size="small"></UIAvatar>
        </div>
        <div class="grow">
          <MainPostTextarea v-model="reply" placeholder="Post your reply" />
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
          @mousedown="emit('close', publishReply(pid.value))"
          >Reply</UIButton
        >
      </div>
    </template>
  </UIPopupDraft>
</template>
