<script setup>
import { usePostStore } from "~/stores/post";
import { writePostKey } from "~/composables/keys";

const user = useSupabaseUser();
const postStore = usePostStore();
const emit = defineEmits(["close"]);
const { newPost, repost_pid, publishPost, publishQuote } = inject(writePostKey);

onMounted(() => {
  newPost.value = "";
});
</script>
<template>
  <UIPopupDraft class="min-h-[40%]" @close="emit('close')">
    <template #center>
      <div class="flex w-full gap-2">
        <!-- left column -->
        <div class="w-10">
          <div class="w-min">
            <UIAvatar :user_id="user.id" size="small" />
          </div>
        </div>
        <!-- right column -->
        <div class="flex w-[calc(100%-3rem)] flex-col gap-3">
          <!-- post -->
          <div class="min-h-[5rem] w-full overflow-y-scroll">
            <UITextarea v-model="newPost" placeholder="What is happening?!" />
          </div>
          <!-- repost -->
          <!-- refer post -->
          <MainPostInteractive v-if="repost_pid" class="w-full">
            <MainPostRefer v-bind="postStore.getPost(repost_pid)" />
          </MainPostInteractive>
        </div>
      </div>
    </template>
    <template #button>
      <MainSection class="w-full" />
      <!-- action buttons -->
      <div class="flex justify-between">
        <div/>
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
