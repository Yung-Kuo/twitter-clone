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
  noHover: {
    type: Boolean,
    default: false,
  },
});
const { post } = toRefs(props);
// profile card
const { showProfileCard, hideProfileCard } = inject(profileCardKey);
const { showPopupPost, repost_pid, publishRepost } = inject(writePostKey);
const {
  showMenu,
  menu_pid,
  type: menuType,
  toggleMenu,
} = inject(togglePostMenuKey);
const bindMenuElement = inject(bindMenuElementKey);
const clickReply = inject(clickReplyKey);
const { clickLike, clickBookmark } = useLikeBookmark();

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
  if (replyStore.checkReplied(id) === null) {
    await replyStore.fetchUserReplyStatus(id);
  }
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
  <MainPostHoverClickWrapper :post="post" :no-hover="props.noHover">
    <div
      v-if="profileStore.profileById(post?.user_id)"
      class="flex h-min w-full px-3 tracking-wide text-zinc-200 transition-colors hover:cursor-pointer 2xl:px-5"
    >
      <!-- left column / avatar -->
      <div class="flex w-min cursor-default flex-col">
        <!-- avatar for show post -->
        <MainPostInteractive
          class="rounded-full"
          @mouseenter="showProfileCard($event.currentTarget, post.user_id)"
          @mouseleave="hideProfileCard()"
        >
          <NuxtLink
            :to="`/${profileStore.usernameById(post?.user_id)}`"
            @click.stop
            @mousedown.stop
          >
            <UIAvatar :user_id="post?.user_id" size="small" />
          </NuxtLink>
        </MainPostInteractive>
        <!-- thread -->
        <div class="flex w-full flex-grow justify-center">
          <span class="h-full border border-zinc-800" />
        </div>
      </div>
      <!-- right column -->
      <div class="flex w-[calc(100%-2.5rem)] flex-col">
        <!-- upper section -->
        <div class="flex h-5 w-full items-center pl-2">
          <!-- user info -->
          <div class="flex items-center overflow-x-scroll whitespace-nowrap">
            <div class="font-bold hover:underline">
              <!-- name -->
              <NuxtLink :to="`/${profileStore.usernameById(post.user_id)}`">
                <div
                  @mouseenter="
                    showProfileCard($event.currentTarget, post.user_id)
                  "
                  @mouseleave="hideProfileCard()"
                >
                  <span>
                    {{ profileStore.nameById(post.user_id) }}
                  </span>
                </div>
              </NuxtLink>
            </div>
            &ensp;
            <div class="flex text-sm text-zinc-500">
              <!-- username -->
              <NuxtLink :to="`/${profileStore.usernameById(post.user_id)}`">
                <div
                  @mouseenter="
                    showProfileCard($event.currentTarget, post.user_id)
                  "
                  @mouseleave="hideProfileCard()"
                >
                  <span> @{{ profileStore.usernameById(post.user_id) }}</span>
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
          <div class="grow" />
          <!-- post action -->
          <MainPostInteractive class="flex flex-col">
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
            <!-- <div class="relative -translate-x-52 translate-y-2"> -->
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
          </MainPostInteractive>
        </div>
        <!-- middle section -->
        <div class="flex w-full flex-col gap-2 pl-2">
          <!-- content -->
          <div v-if="post.type !== 'repost' || post.text !== post.reply_to">
            <!-- don't show text when repost  -->
            <pre>{{ post.text }}</pre>
          </div>

          <!-- repost / quote -->
          <MainPostInteractive v-if="post.type === 'repost'">
            <MainPostRefer v-bind="post" />
          </MainPostInteractive>
        </div>
        <!-- lower section -->
        <div class="flex justify-between pb-4 pt-2 text-zinc-500">
          <!-- action buttons -->
          <MainPostInteractive class="flex grow justify-between">
            <!-- Reply -->
            <div class="flex items-center">
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
            <div class="flex">
              <div class="flex items-center">
                <div
                  :ref="
                    (el) => bindMenuElement(`${post.id}_repost_menu_icon`, el)
                  "
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
                <span class="w-2">{{ postStore.getRepostCount(post.id) }}</span>
              </div>
              <!-- repost option menu -->
              <div class="relative">
                <UIPopupTransition>
                  <UIPopupRepostMenu
                    v-if="
                      showMenu && menuType === 'repost' && menu_pid === post.id
                    "
                    :pid="menu_pid"
                    :username="profileStore.usernameById(post.user_id)"
                    @repost="publishRepost(menu_pid)"
                    @quote="
                      repost_pid = menu_pid;
                      showPopupPost = true;
                    "
                  />
                </UIPopupTransition>
              </div>
            </div>
            <!-- Like -->
            <div class="flex items-center">
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
            <div class="flex items-center">
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
          </MainPostInteractive>
          <!-- Share -->
          <MainPostInteractive class="flex items-center pl-1">
            <IconsBadge size="small" color="blue">
              <IconsShare />
            </IconsBadge>
          </MainPostInteractive>
        </div>
      </div>
    </div>
  </MainPostHoverClickWrapper>
</template>
