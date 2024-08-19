<script setup>
import { usePostStore } from "~/stores/post";
const user = useSupabaseUser();
const postStore = usePostStore();
const emit = defineEmits(["close"]);
const { newPost, repost_pid, publishPost, publishRepost, publishQuote } =
  inject("writePost");
</script>
<template>
  <UIPopupDraft @close="emit('close')" class="min-h-[40%]">
    <template #center>
      <div class="flex grow gap-2">
        <!-- left column -->
        <div class="w-min">
          <div class="w-min">
            <UIAvatar :user_id="user.id" size="small" />
          </div>
        </div>
        <!-- right column -->
        <div class="flex w-[calc(100%-2rem)] flex-col justify-between gap-3">
          <!-- post -->
          <div class="grow overflow-y-scroll">
            <MainPostTextarea
              v-model="newPost"
              placeholder="What is happening?!"
            />
          </div>
          <!-- repost -->
          <!-- refer post -->
          <div v-if="repost_pid" class="noForward">
            <MainPostRefer
              v-bind="postStore.getPost(repost_pid)"
            ></MainPostRefer>
          </div>
        </div>
      </div>
    </template>
    <template #button>
      <MainSection class="w-full" />
      <!-- action buttons -->
      <div class="flex justify-between">
        <div></div>
        <UIButton
          color="blue"
          :solid="true"
          @mousedown="
            emit('close', repost_pid ? publishQuote() : publishPost())
          "
          >Post</UIButton
        >
      </div>
    </template>
  </UIPopupDraft>
</template>
