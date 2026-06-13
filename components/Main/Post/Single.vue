<script setup>
import { usePostStore } from "~/stores/post";
import { useProfileStore } from "~/stores/profile";
import { useReplyStore } from "~/stores/reply";
import { popupReplyKey } from "~/composables/keys";

const user = useSupabaseUser();
const postStore = usePostStore();
const profileStore = useProfileStore();
const replyStore = useReplyStore();
const post = defineProps({
  id: String,
  created_at: String,
  text: String,
  pictures: Array,
  user_id: String,
  reply_to: String,
  type: String,
  edited: Boolean,
});

watchEffect(async () => {
  if (replyStore.getReplyCount(post.id) == null) {
    await replyStore.fetchReplyCount(post.id);
  }
  if (postStore.getLikeCount(post.id) == null) {
    await postStore.fetchLikeCount(post.id);
  }
  if (postStore.getBookmarkCount(post.id) == null) {
    await postStore.fetchBookmarkCount(post.id);
  }
  if (postStore.getRepostCount(post.id) == null) {
    await postStore.fetchRepostCount(post.id);
  }
  await replyStore.fetchUserReplyStatus(post.id);
});

const quotedPost = computed(() => {
  if (post.type !== "repost" || !post.reply_to) return null;
  return postStore.getPost(post.reply_to) ?? null;
});

const { publishReply } = inject(popupReplyKey);
const reply = ref("");
</script>
<template>
  <div
    v-if="profileStore.profileById(post?.user_id)"
    class="w-full px-3 tracking-wide text-zinc-200 2xl:px-5"
  >
    <MainSection>
      <article>
        <MainPostHeader :post="post" variant="single" />
        <MainPostBody :post="post" text-size="large" show-timestamp>
          <MainPostInteractive v-if="quotedPost">
            <MainPostRefer v-bind="quotedPost" />
          </MainPostInteractive>
        </MainPostBody>
      </article>
    </MainSection>
    <MainSection>
      <MainPostActionBar
        :post-id="post.id"
        :user-id="post.user_id"
        badge-size="smallPlus"
        share-offset
      />
    </MainSection>
    <div class="flex w-full gap-2 py-5">
      <div class="h-min">
        <UIAvatar :user_id="user.id" size="small" />
      </div>
      <div class="grow">
        <UITextarea v-model="reply" placeholder="Post your reply" />
      </div>
      <div>
        <UIButton
          color="blue"
          :solid="true"
          @mousedown="publishReply(post.id, reply) ? (reply = '') : null"
        >
          Reply
        </UIButton>
      </div>
    </div>
  </div>
</template>
