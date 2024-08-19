<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
import { useReplyStore } from "~/stores/reply";
const user = useSupabaseUser();
const profileStore = useProfileStore();
const postStore = usePostStore();
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

const authorReplyId = computed(() =>
  replyStore.checkAuthorReplied(post.value?.id)
);
const authorReplyPost = computed(() => postStore.getPost(authorReplyId.value));
onMounted(async () => {
  watchEffect(async () => {
    await replyStore.fetchReplies(post.value?.id);
    await replyStore.fetchReplyCount(post.value?.id);
    await postStore.fetchLikeCount(post.value?.id);
    await postStore.fetchBookmarkCount(post.value?.id);
    await replyStore.fetchUserReplyStatus(post.value?.id);
    if (props.showAuthorReply) {
      await replyStore.fetchAuthorReplyStatus(post.value?.id);
    }
    // for quote tweet
    if (
      post.value?.reply_to &&
      post.value?.type === "repost" &&
      !postStore.getPost(post.value.reply_to)
    ) {
      await postStore.fetchOnePost(post.value?.reply_to);
    }
  });
});

// profile card
const { showProfileCard, hideProfileCard } = inject("profileCard");
// write post
const {
  showPopupPost,
  newPost,
  repost_pid,
  publishPost,
  publishRepost,
  publishQuote,
} = inject("writePost");
// toggle menu
const {
  showMenu,
  menu_pid,
  menu_uid,
  type,
  icon_id,
  toggleMenu,
  handleClickOutside,
  menuGetRect,
} = inject("useToggleMenu");
// click post
const { target_post, clickPost, hoverPost } = inject("clickPost");
// action buttons
const clickReply = inject("clickReply");
const { pid, reply, publishReply } = inject("popupReply");
const { clickLike, clickBookmark } = useLikeBookmark();

// timestamp
const date = computed(() => {
  const dt = new Date(post.value.created_at);
  // Format the date portion
  const date = dt.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
  });
  return `${date}`;
});
</script>
<template>
  <MainSection class="w-full">
    <!-- post -->
    <MainPostHoverClickWrapper :post="post">
      <div class="flex w-full p-3 pb-0 text-zinc-200 md:p-5 md:pb-0">
        <!-- left column / avatar -->
        <div class="flex w-min flex-col">
          <!-- avatar for show post -->
          <NuxtLink :to="`/${postStore.getUsername(post?.user_id)}`">
            <UIAvatar
              :id="`${post.id}_avatar`"
              :user_id="post?.user_id"
              size="small"
              class="noForward"
              @mouseenter="showProfileCard($event.target.id, post.user_id)"
              @mouseleave="hideProfileCard()"
            />
          </NuxtLink>
          <!-- thread -->
          <div
            v-if="props.showAuthorReply && authorReplyId"
            class="flex w-full flex-grow justify-center"
          >
            <span class="h-full border border-zinc-800"></span>
          </div>
        </div>
        <!-- right column -->
        <div class="flex h-min w-[calc(100%-2.5rem)] flex-col pb-2">
          <!-- upper section -->
          <div class="flex h-5 w-full items-center pl-2">
            <!-- user info -->
            <div
              class="flex items-center overflow-x-scroll whitespace-nowrap leading-tight"
            >
              <!-- name -->
              <div
                :id="`${post.id}_name`"
                @mouseenter="showProfileCard($event.target.id, post.user_id)"
                @mouseleave="hideProfileCard()"
                class="noForward w-max font-bold hover:underline"
              >
                <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
                  <span class="noForward">
                    {{ postStore.getName(post.user_id) }}
                  </span>
                </NuxtLink>
              </div>
              &ensp;
              <div class="flex text-sm text-zinc-500">
                <!-- username -->
                <div
                  :id="`${post.id}_username`"
                  @mouseenter="showProfileCard($event.target.id, post.user_id)"
                  @mouseleave="hideProfileCard()"
                  class="noForward w-max"
                >
                  <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
                    <span> @{{ postStore.getUsername(post.user_id) }}</span>
                  </NuxtLink>
                </div>
                <div class="flex w-max">
                  <!-- timestamp -->
                  <pre> · {{ date }}</pre>
                  <!-- edited -->
                  <pre v-if="post.edited"> · edited</pre>
                </div>
              </div>
            </div>
            <!-- spacing -->
            <div class="grow"></div>
            <!-- post action -->
            <div class="noForward flex flex-col">
              <!-- icon -->
              <div class="flex h-min items-center text-zinc-500">
                <IconsBadge
                  size="small"
                  color="blue"
                  :id="`${post.id}_menu_icon`"
                  @mousedown="toggleMenu(post.id, post.user_id, 'post_action')"
                >
                  <IconsMore />
                </IconsBadge>
              </div>
              <!-- menu -->
              <div class="relative -translate-x-52 translate-y-2">
                <UIPopupTransition>
                  <UIPopupMenu
                    v-if="
                      showMenu && type === 'post_action' && menu_pid === post.id
                    "
                    :id="`${post.id}_post_action_menu`"
                    :pid="menu_pid"
                    :uid="menu_uid"
                  ></UIPopupMenu>
                </UIPopupTransition>
              </div>
            </div>
          </div>

          <!-- middle section -->
          <div class="flex w-full flex-col gap-3 pl-2">
            <!-- content -->
            <div
              v-if="post.type !== 'repost' || post.text !== post.reply_to"
              class="w-full whitespace-pre-line break-words"
            >
              <!-- text -->
              <pre>{{ post.text }}</pre>
            </div>

            <!-- repost / quote -->
            <div v-if="post.type === 'repost'" class="noForward">
              <MainPostRefer
                v-bind="postStore.getPost(post.reply_to)"
              ></MainPostRefer>
            </div>
          </div>

          <!-- lower section -->
          <div
            class="flex justify-between pt-2 text-zinc-500"
            :class="{ 'pb-2': props.showAuthorReply && authorReplyId }"
          >
            <!-- action buttons -->
            <div class="flex grow justify-between">
              <!-- Reply -->
              <div class="noForward flex w-10 items-center">
                <IconsBadge
                  size="small"
                  color="blue"
                  :clicked="replyStore.checkReplied(post.id)"
                  @mousedown="
                    pid = post.id;
                    clickReply(post.id);
                  "
                >
                  <IconsReply />
                </IconsBadge>
                <span
                  class="w-2"
                  :class="{
                    'text-sky-500': replyStore.checkReplied(post.id),
                  }"
                  >{{ replyStore.getReplyCount(post.id) }}</span
                >
              </div>
              <!-- Repost -->
              <div class="noForward flex">
                <div class="flex w-10 items-center">
                  <IconsBadge
                    size="small"
                    color="green"
                    :id="`${post.id}_repost_menu_icon`"
                    @mousedown="toggleMenu(post.id, post.user_id, 'repost')"
                  >
                    <IconsRepost />
                  </IconsBadge>
                  <span class="w-2"></span>
                </div>
                <!-- repost option menu -->
                <div class="relative">
                  <UIPopupTransition>
                    <UIPopupRepostMenu
                      v-if="
                        showMenu && type === 'repost' && menu_pid === post.id
                      "
                      :id="`${post.id}_repost_menu`"
                      :pid="menu_pid"
                      @repost="publishRepost(menu_pid)"
                      @quote="
                        repost_pid = menu_pid;
                        showPopupPost = true;
                      "
                    ></UIPopupRepostMenu>
                  </UIPopupTransition>
                </div>
              </div>
              <!-- Like -->
              <div class="noForward flex w-10 items-center">
                <IconsBadge
                  size="small"
                  color="red"
                  :clicked="postStore.checkLike(post.id)"
                  @mousedown="clickLike(post.id)"
                >
                  <IconsLike :solid="postStore.checkLike(post.id)" />
                </IconsBadge>
                <span
                  class="w-2"
                  :class="{ 'text-pink-600': postStore.checkLike(post.id) }"
                  >{{ postStore.getLikeCount(post.id) }}</span
                >
              </div>

              <!-- Bookmark -->
              <div class="noForward flex w-10 items-center">
                <IconsBadge
                  size="small"
                  color="blue"
                  :clicked="postStore.checkBookmark(post.id)"
                  @mousedown="clickBookmark(post.id)"
                >
                  <IconsBookmark :solid="postStore.checkBookmark(post.id)" />
                </IconsBadge>
                <span
                  class="w-2"
                  :class="{
                    'text-sky-500': postStore.checkBookmark(post.id),
                  }"
                  >{{ postStore.getBookmarkCount(post.id) }}</span
                >
              </div>
            </div>
            <!-- Share -->
            <div class="noForward flex items-center pl-1">
              <IconsBadge size="small" color="blue">
                <IconsShare />
              </IconsBadge>
            </div>
          </div>
        </div>
      </div>
    </MainPostHoverClickWrapper>
    <!-- if the author has replied -->
    <MainPostReplyThread
      :post="authorReplyPost"
      v-if="props.showAuthorReply && authorReplyId"
      class="noForward px-2 md:px-5"
    />
    <MainPostHoverClickWrapper
      v-if="props.showAuthorReply && authorReplyId"
      :post="post"
    >
      <div class="flex px-2 md:px-5">
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
/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
