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
  noHover: {
    type: Boolean,
    default: false,
  },
});
const { post } = toRefs(props);
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

onMounted(async () => {
  watchEffect(async () => {
    await replyStore.fetchReplies(post.value?.id);
    await replyStore.fetchReplyCount(post.value?.id);
    await postStore.fetchLikeCount(post.value?.id);
    await postStore.fetchBookmarkCount(post.value?.id);
    await replyStore.fetchUserReplyStatus(post.value?.id);
  });
});
// timestamp
const date = computed(() => {
  const dt = new Date(post.value?.created_at);
  // Format the date portion
  const date = dt.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
  });
  return `${date}`;
});
</script>
<template>
  <MainPostHoverClickWrapper :post="post" :noHover="props.noHover">
    <div
      v-if="postStore.getProfile(post?.user_id)"
      class="flex h-min w-full text-zinc-200 transition-all hover:cursor-pointer"
    >
      <!-- left column / avatar -->
      <div class="flex w-min cursor-default flex-col">
        <!-- avatar for show post -->
        <div
          :id="`${post.id}_avatar`"
          @mouseenter="showProfileCard($event.target.id, post.user_id)"
          @mouseleave="hideProfileCard()"
          class="noForward rounded-full"
        >
          <NuxtLink :to="`/${postStore.getUsername(post?.user_id)}`">
            <UIAvatar :user_id="post?.user_id" size="small"> </UIAvatar>
          </NuxtLink>
        </div>
        <!-- thread -->
        <div class="noForward flex w-full flex-grow justify-center">
          <span class="h-full border border-zinc-800"></span>
        </div>
      </div>
      <!-- right column -->
      <div class="flex w-[calc(100%-2.5rem)] flex-col">
        <!-- upper section -->
        <div class="flex h-5 w-full items-center pl-2">
          <!-- user info -->
          <div
            class="noForward flex items-center overflow-x-scroll whitespace-nowrap"
          >
            <div class="font-bold hover:underline">
              <!-- name -->
              <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
                <div
                  :id="`${post.id}_name`"
                  @mouseenter="showProfileCard($event.target.id, post.user_id)"
                  @mouseleave="hideProfileCard()"
                >
                  <span>
                    {{ postStore.getName(post.user_id) }}
                  </span>
                </div>
              </NuxtLink>
            </div>
            &ensp;
            <div class="flex text-sm text-zinc-500">
              <!-- username -->
              <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
                <div
                  :id="`${post.id}_username`"
                  @mouseenter="showProfileCard($event.target.id, post.user_id)"
                  @mouseleave="hideProfileCard()"
                >
                  <span> @{{ postStore.getUsername(post.user_id) }}</span>
                </div>
              </NuxtLink>
              <!-- timestamp -->
              <div class="flex w-max">
                <pre> · {{ date }}</pre>
                <pre v-if="post.edited"> · edited</pre>
              </div>
            </div>
          </div>
          <!-- spacing -->
          <div class="grow"></div>
          <!-- post action -->
          <div class="flex flex-col">
            <!-- icon -->
            <div class="flex h-min items-center text-zinc-500">
              <IconsBadge
                size="small"
                color="blue"
                :clicked="menu_pid === post.id && type === 'post_action'"
                :id="`${post.id}_menu_icon`"
                @mousedown="toggleMenu(post.id, post.user_id, 'post_action')"
                class="noForward"
              >
                <IconsMore />
              </IconsBadge>
            </div>
            <!-- menu -->
            <!-- <div class="relative -translate-x-52 translate-y-2"> -->
            <UIPopupTransition>
              <UIPopupMenu
                v-if="
                  showMenu && type === 'post_action' && menu_pid === post.id
                "
                :pid="menu_pid"
                :uid="menu_uid"
                class="noForward"
              ></UIPopupMenu>
            </UIPopupTransition>
            <!-- </div> -->
          </div>
        </div>
        <!-- middle section -->
        <div class="flex w-full flex-col gap-2 pl-2">
          <!-- content -->
          <div v-if="post.type !== 'repost && post.text !== repost'">
            <!-- don't show text when repost  -->
            <pre>{{ post.text }}</pre>
          </div>

          <!-- repost / quote -->
          <div v-if="post.type === 'repost'">
            <MainPostRefer v-bind="post"></MainPostRefer>
          </div>
        </div>
        <!-- lower section -->
        <div class="flex justify-between pb-4 pt-2 text-zinc-500">
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
                  :clicked="menu_pid === post.id && type === 'repost'"
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
                @click="clickLike(post.id)"
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
                @click="clickBookmark(post.id)"
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
  </MainPostHoverClickWrapper>
</template>
