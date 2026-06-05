<script setup>
import { usePostStore } from "~/stores/post";
import { useProfileStore } from "~/stores/profile";
import { useReplyStore } from "~/stores/reply";
import {
  bindMenuElementKey,
  clickReplyKey,
  profileCardKey,
  togglePostMenuKey,
  writePostKey,
} from "~/composables/keys";

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

// profile card
const { showProfileCard, hideProfileCard } = inject(profileCardKey);
const {
  showPopupPost,
  repost_pid,
  publishRepost,
} = inject(writePostKey);
const { showMenu, menu_pid, type: menuType, toggleMenu } = inject(togglePostMenuKey);
const bindMenuElement = inject(bindMenuElementKey);
const clickReply = inject(clickReplyKey);
const { clickLike, clickBookmark } = useLikeBookmark();

const authorReplyId = computed(() =>
  replyStore.checkAuthorReplied(post.value?.id)
);
const authorReplyPost = computed(() => postStore.getPost(authorReplyId.value));
watchEffect(async () => {
  const id = post.value?.id;
  if (!id) return;
  if (replyStore.getReplyCount(id) == null) {
    await replyStore.fetchReplyCount(id);
  }
  if (postStore.getLikeCount(id) == null) {
    await postStore.fetchLikeCount(id);
  }
  if (postStore.getBookmarkCount(id) == null) {
    await postStore.fetchBookmarkCount(id);
  }
  if (postStore.getRepostCount(id) == null) {
    await postStore.fetchRepostCount(id);
  }
});

watchEffect(async () => {
  if (
    props.showAuthorReply &&
    replyStore.checkAuthorReplied(post.value?.id) === null
  ) {
    await replyStore.fetchAuthorReplyStatus(post.value?.id);
  }
});

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
  <MainSection class="w-full tracking-wide">
    <!-- post -->
    <MainPostHoverClickWrapper :post="post">
      <div class="flex w-full p-3 pb-0 text-zinc-200 2xl:p-5 2xl:pb-0">
        <!-- left column / avatar -->
        <div class="flex w-min flex-col">
          <!-- avatar for show post -->
          <NuxtLink :to="`/${profileStore.usernameById(post?.user_id)}`">
            <span
              class="inline-flex noForward"
              @mouseenter="
                showProfileCard($event.currentTarget, post.user_id)
              "
              @mouseleave="hideProfileCard()"
            >
              <UIAvatar
                :user_id="post?.user_id"
                size="small"
                class="noForward"
              />
            </span>
          </NuxtLink>
          <!-- thread -->
          <div
            v-if="props.showAuthorReply && authorReplyId"
            class="flex w-full grow justify-center"
          >
            <span class="h-full border border-zinc-800"/>
          </div>
        </div>
        <!-- right column -->
        <div class="flex h-min w-[calc(100%-2.5rem)] flex-col pb-2">
          <!-- upper section -->
          <div class="flex h-5 w-full items-center pl-2">
            <!-- user info -->
            <div
              class="flex h-min w-min items-center overflow-x-scroll whitespace-nowrap leading-none"
            >
              <!-- name -->
              <div
                class="noForward h-full w-max font-bold hover:underline"
                @mouseenter="
                  showProfileCard($event.currentTarget, post.user_id)
                "
                @mouseleave="hideProfileCard()"
              >
                <NuxtLink :to="`/${profileStore.usernameById(post.user_id)}`">
                  <span class="noForward">
                    {{ profileStore.nameById(post.user_id) }}
                  </span>
                </NuxtLink>
              </div>
              &ensp;
              <!-- username -->
              <div class="flex h-full items-end text-sm text-zinc-500">
                <div
                  class="noForward w-max"
                  @mouseenter="
                    showProfileCard($event.currentTarget, post.user_id)
                  "
                  @mouseleave="hideProfileCard()"
                >
                  <NuxtLink :to="`/${profileStore.usernameById(post.user_id)}`">
                    <span> @{{ profileStore.usernameById(post.user_id) }}</span>
                  </NuxtLink>
                </div>
              </div>
              <!-- others -->
              <div class="flex h-full items-end text-sm text-zinc-500">
                <div class="flex w-max">
                  <!-- timestamp -->
                  <pre> · {{ date }}</pre>
                  <!-- edited -->
                  <pre v-if="post.edited"> · edited</pre>
                </div>
              </div>
            </div>
            <!-- spacing -->
            <div class="grow"/>
            <!-- post action -->
            <div class="noForward flex flex-col">
              <!-- icon -->
              <div class="flex h-min items-center text-zinc-500">
                <div
                  :ref="(el) => bindMenuElement(`${post.id}_menu_icon`, el)"
                  class="flex"
                >
                  <IconsBadge
                    size="small"
                    color="blue"
                    :clicked="menu_pid === post.id && menuType === 'post_action'"
                    @mousedown="toggleMenu(post.id, 'post_action')"
                  >
                    <IconsMore />
                  </IconsBadge>
                </div>
              </div>
              <!-- menu -->
              <UIPopupTransition>
                <UIPopupMenu
                  v-if="
                    showMenu && menuType === 'post_action' && menu_pid === post.id
                  "
                  :pid="post.id"
                  :uid="post.user_id"
                />
              </UIPopupTransition>
              <!-- </div> -->
            </div>
          </div>

          <!-- middle section -->
          <div class="flex w-full flex-col pl-2">
            <!-- content -->
            <div
              v-if="post.type !== 'repost' || post.text !== post.reply_to"
              class="w-full"
            >
              <pre>{{ post.text }}</pre>
            </div>

            <!-- repost / quote -->
            <div v-if="post.type === 'repost'" class="noForward mt-3 w-full">
              <MainPostRefer v-bind="postStore.getPost(post.reply_to)" />
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
              <div class="noForward flex items-center">
                <IconsBadge
                  size="small"
                  color="blue"
                  :clicked="!!replyStore.checkReplied(post.id)"
                  @mousedown="clickReply(post.id)"
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
                <div class="flex items-center">
                  <div
                    :ref="(el) => bindMenuElement(`${post.id}_repost_menu_icon`, el)"
                    class="flex"
                  >
                    <IconsBadge
                      size="small"
                      color="green"
                      :clicked="menu_pid === post.id && menuType === 'repost'"
                      @mousedown="toggleMenu(post.id, 'repost')"
                    >
                      <IconsRepost />
                    </IconsBadge>
                  </div>
                  <span class="w-2">{{
                    postStore.getRepostCount(post.id)
                  }}</span>
                </div>
                <!-- repost option menu -->
                <div class="relative">
                  <UIPopupTransition>
                    <UIPopupRepostMenu
                      v-if="
                        showMenu && menuType === 'repost' && menu_pid === post.id
                      "
                      :pid="post.id"
                      :username="profileStore.usernameById(post.user_id)"
                      @repost="publishRepost(post.id)"
                      @quote="
                        repost_pid = post.id;
                        showPopupPost = true;
                      "
                    />
                  </UIPopupTransition>
                </div>
              </div>
              <!-- Like -->
              <div class="noForward flex items-center">
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
              <div class="noForward flex items-center">
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
/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
