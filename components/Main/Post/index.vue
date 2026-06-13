<script setup>
import { usePostStore } from "~/stores/post";
import { useProfileStore } from "~/stores/profile";
import { useReplyStore } from "~/stores/reply";
import { profileCardKey } from "~/composables/keys";

const postStore = usePostStore();
const profileStore = useProfileStore();
const replyStore = useReplyStore();
const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
  showAuthorReply: {
    type: Boolean,
    default: false,
  },
});
const { post } = toRefs(props);

const { showProfileCard, hideProfileCard } = inject(profileCardKey);

const authorReplyId = computed(() =>
  replyStore.checkAuthorReplied(post.value?.id),
);
const authorReplyPost = computed(() => postStore.getPost(authorReplyId.value));

const quotedPost = computed(() => {
  if (!post.value || post.value.type !== "repost" || !post.value.reply_to) {
    return null;
  }
  return postStore.getPost(post.value.reply_to) ?? null;
});

watchEffect(async () => {
  if (
    props.showAuthorReply &&
    replyStore.checkAuthorReplied(post.value?.id) === null
  ) {
    await replyStore.fetchAuthorReplyStatus(post.value?.id);
  }
});
</script>
<template>
  <MainSection class="w-full tracking-wide">
    <MainPostHoverClickWrapper :post="post">
      <div class="flex w-full p-3 pb-0 text-zinc-200 2xl:p-5 2xl:pb-0">
        <div class="flex w-min flex-col">
          <NuxtLink
            :to="`/${profileStore.usernameById(post?.user_id)}`"
            @click.stop
            @mousedown.stop
          >
            <span
              class="inline-flex"
              @mouseenter="showProfileCard($event.currentTarget, post.user_id)"
              @mouseleave="hideProfileCard()"
            >
              <UIAvatar :user_id="post?.user_id" size="small" />
            </span>
          </NuxtLink>
          <div
            v-if="props.showAuthorReply && authorReplyId"
            class="flex w-full grow justify-center"
          >
            <span class="h-full border border-zinc-800" />
          </div>
        </div>
        <div class="flex h-min w-[calc(100%-2.5rem)] flex-col pb-2">
          <MainPostHeader :post="post" variant="feed" />
          <MainPostBody :post="post">
            <MainPostInteractive v-if="quotedPost" class="mt-3 w-full">
              <MainPostRefer v-bind="quotedPost" />
            </MainPostInteractive>
          </MainPostBody>
          <MainPostActionBar
            :post-id="post.id"
            :user-id="post.user_id"
            badge-size="small"
            :show-author-reply="props.showAuthorReply"
            :author-reply-id="authorReplyId"
            thread-padding
          />
        </div>
      </div>
    </MainPostHoverClickWrapper>
    <MainPostReplyThread
      v-if="props.showAuthorReply && authorReplyId"
      :post="authorReplyPost"
    />
    <MainPostHoverClickWrapper
      v-if="props.showAuthorReply && authorReplyId"
      :post="post"
    >
      <div class="flex px-3 md:px-5">
        <div class="flex w-10 flex-col items-center gap-2 py-2">
          <span class="w-0 border border-zinc-800" />
          <span class="w-0 border border-zinc-800" />
          <span class="w-0 border border-zinc-800" />
        </div>
        <div class="flex grow items-center">
          <span class="text-sky-500">Show replies</span>
        </div>
      </div>
    </MainPostHoverClickWrapper>
  </MainSection>
</template>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  height: 0;
}
.list-leave-active {
  position: absolute;
}
</style>
