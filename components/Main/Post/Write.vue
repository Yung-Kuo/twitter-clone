<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
const user = useSupabaseUser();
const profileStore = useProfileStore();
const postStore = usePostStore();
const emit = defineEmits(["published"]);
const { newPost, publishPost } = useWritePost();
</script>
<template>
  <MainSection>
    <div
      class="flex w-full px-3 pt-3 tracking-wide text-gray-200 transition-all"
    >
      <!-- left column / avatar -->
      <div class="flex h-max w-12 justify-start">
        <!-- avatar for writing new post -->
        <div>
          <UIAvatar :user_id="user.id" size="small"> </UIAvatar>
        </div>
      </div>
      <!-- right column -->
      <div class="flex-grow">
        <!-- upper section -->
        <div class="pl-1">
          <!-- write new post -->
          <MainSection>
            <UITextarea v-model="newPost" />
          </MainSection>
          <div class="flex h-max w-full justify-end py-3">
            <UIButton color="blue" :solid="true" @click="publishPost()"
              >Post</UIButton
            >
          </div>
        </div>
      </div>
    </div>
  </MainSection>
</template>
