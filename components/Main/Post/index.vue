<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
import { useReplyStore } from "~/stores/reply";
const user = useSupabaseUser();
const profileStore = useProfileStore();
const postStore = usePostStore();
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
  showAuthorReply: {
    type: Boolean,
    default: false,
  },
});

const authorReplyId = ref(null);
onMounted(async () => {
  watchEffect(async () => {
    await replyStore.fetchReplies(post?.id);
    await replyStore.fetchReplyCount(post?.id);
    await postStore.fetchLikeCount(post?.id);
    await postStore.fetchBookmarkCount(post?.id);
    await replyStore.fetchUserReplyStatus(post?.id);
    if (post.showAuthorReply) {
      authorReplyId.value = await replyStore.fetchAuthorReplyStatus(post?.id);
    }
    // for quote tweet
    if (post?.reply_to && post?.type === "repost") {
      await postStore.fetchOnePost(post?.reply_to);
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
const { clickLike, clickBookmark } = useLikeBookmark();

// timestamp
const date = computed(() => {
  const dt = new Date(post.created_at);
  // Format the date portion
  const date = dt.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
  });
  return `${date}`;
});
</script>
<template>
  <MainSection
    v-if="postStore.getProfile(post?.user_id)"
    @mouseenter="
      target_post = post;
      hoverPost($event);
    "
    @mouseover="!target_post ? ((target_post = post), hoverPost($event)) : null"
    @mouseleave="
      hoverPost($event, target_post === post ? (target_post = null) : null)
    "
    @mousedown="clickPost($event)"
    class="stopHere flex w-full cursor-pointer flex-col px-5 pt-5 text-zinc-200 !ring-0 transition-all"
    :class="post.id"
  >
    <div class="flex">
      <!-- left column / avatar -->
      <div class="flex w-min flex-col">
        <!-- avatar for show post -->
        <div
          :id="`${post.id}_avatar`"
          @mouseenter="showProfileCard($event.target.id, post.user_id)"
          @mouseleave="hideProfileCard()"
          class="noForward rounded-full"
        >
          <NuxtLink :to="`/${postStore.getUsername(post?.user_id)}`">
            <UIAvatar :user_id="post?.user_id" size="small" class="noForward">
            </UIAvatar>
          </NuxtLink>
        </div>
        <!-- thread -->
        <div
          v-if="post.showAuthorReply && authorReplyId"
          class="flex w-full flex-grow justify-center"
        >
          <span class="h-full border border-zinc-800"></span>
        </div>
      </div>
      <!-- right column -->
      <div class="h-min flex-grow">
        <!-- upper section -->
        <div class="pl-2">
          <!-- user info -->
          <div class="flex">
            <div class="flex items-center">
              <!-- name -->
              <div
                :id="`${post.id}_name`"
                @mouseenter="showProfileCard($event.target.id, post.user_id)"
                @mouseleave="hideProfileCard()"
                class="noForward font-bold hover:underline"
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
                  class="noForward"
                >
                  <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
                    <span> @{{ postStore.getUsername(post.user_id) }}</span>
                  </NuxtLink>
                </div>
                <!-- timestamp -->
                <div>
                  <pre> · {{ date }}</pre>
                </div>
                <!-- edited -->
                <div>
                  <pre v-if="post.edited"> · edited</pre>
                </div>
              </div>
            </div>
            <!-- spacing -->
            <div class="grow"></div>
            <!-- post action -->
            <div class="flex flex-col">
              <!-- icon -->
              <div class="flex h-full items-center text-zinc-500">
                <IconsBadge
                  size="small"
                  color="blue"
                  :id="`${post.id}_menu_icon`"
                  @mousedown="toggleMenu(post.id, post.user_id, 'post_action')"
                  class="noForward"
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
                    class="noForward"
                  ></UIPopupMenu>
                </UIPopupTransition>
              </div>
            </div>
          </div>
          <!-- content -->
          <div
            v-if="post.type !== 'repost' || post.text !== post.reply_to"
            class="w-min"
          >
            <!-- text -->
            <pre>{{ post.text }}</pre>
          </div>

          <!-- repost / quote -->
          <div v-if="post.type === 'repost'" class="noForward pt-3">
            <MainPostRefer
              v-bind="postStore.getPost(post.reply_to)"
            ></MainPostRefer>
          </div>
        </div>

        <!-- lower section -->
        <div class="flex justify-between py-2 text-zinc-500">
          <!-- action buttons -->
          <div class="flex grow justify-between">
            <!-- Reply -->
            <div class="noForward flex w-10 items-center">
              <IconsBadge
                size="small"
                color="blue"
                :clicked="replyStore.checkReplied(post.id)"
                @mousedown="clickReply(post.id)"
              >
                <IconsReply />
              </IconsBadge>
              <span
                class="w-2"
                :class="{ 'text-sky-500': replyStore.checkReplied(post.id) }"
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
                    v-if="showMenu && type === 'repost' && menu_pid === post.id"
                    :id="`${post.id}_repost_menu`"
                    :pid="menu_pid"
                    @repost="publishRepost()"
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
                :class="{ 'text-sky-500': postStore.checkBookmark(post.id) }"
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
    <!-- if author has replied -->
    <UIPopupTransition class="duration-500">
      <div v-if="post.showAuthorReply && authorReplyId">
        <MainPostReplyThread
          v-bind="postStore.getPost(authorReplyId)"
          noForward
        />
        <div class="flex">
          <!-- left column -->
          <div class="flex w-10 flex-col items-center gap-2 py-2">
            <span class="w-0 border border-zinc-800" />
            <span class="w-0 border border-zinc-800" />
            <span class="w-0 border border-zinc-800" />
          </div>
          <!-- right column -->
          <div class="flex grow items-center">
            <span class="text-sky-500">Show replies</span>
          </div>
        </div>
      </div>
    </UIPopupTransition>
  </MainSection>
</template>
