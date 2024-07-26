<script setup>
import { usePostStore } from "~/stores/post";
const user = useSupabaseUser();
const postStore = usePostStore();
const emit = defineEmits(["close"]);

// edit
const { showPopupEdit, editPost, newText, selectEditPost, publishEdit } =
  inject("useEdit");
// reply
const replyPost = computed(() => {
  if (editPost.value?.type === "reply" && editPost.value?.reply_to) {
    return postStore.getPost(editPost.value?.reply_to);
  } else {
    return "";
  }
});
</script>
<template>
  <UIPopupDraft @close="emit('close')">
    <template #center>
      <div class="flex grow">
        <!-- post/repost avatar -->
        <div
          v-if="editPost?.type === 'repost' || editPost?.type === 'post'"
          class="w-min"
        >
          <UIAvatar :user_id="user.id" size="small" />
        </div>

        <!-- main content -->
        <div
          class="flex grow flex-col justify-between"
          :class="
            editPost?.type === 'repost' || editPost?.type === 'post'
              ? 'pl-2'
              : ''
          "
        >
          <!-- replying post -->
          <MainPostReply
            v-if="editPost?.type === 'reply'"
            v-bind="replyPost"
          ></MainPostReply>
          <!-- your post / reply -->
          <div class="flex gap-2">
            <div v-if="editPost?.type === 'reply'" class="w-min">
              <UIAvatar :user_id="user.id" size="small" />
            </div>
            <div
              class="max-h-[20em] min-h-[8em] grow overflow-y-scroll rounded-xl border-2 border-zinc-800"
            >
              <MainPostTextarea v-model="newText" mode="edit" />
            </div>
          </div>
          <!-- refer post -->
          <div
            v-if="editPost?.type === 'repost' && editPost?.reply_to"
            class="grow overflow-y-scroll pt-3"
          >
            <MainPostRefer
              v-bind="postStore.getPost(editPost?.reply_to)"
            ></MainPostRefer>
          </div>
        </div>
      </div>
    </template>
    <template #button>
      <div class="flex w-full flex-col">
        <MainSection class="w-full" />
        <!-- action buttons -->
        <div class="flex justify-between pt-4">
          <div></div>
          <UIButton
            color="blue"
            :solid="true"
            @mousedown="emit('close', publishEdit())"
            >Post</UIButton
          >
        </div>
      </div>
    </template>
  </UIPopupDraft>
</template>
