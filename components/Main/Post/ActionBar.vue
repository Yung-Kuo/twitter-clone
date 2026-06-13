<script setup lang="ts">
import { usePostStore } from "~/stores/post";
import { useProfileStore } from "~/stores/profile";
import { useReplyStore } from "~/stores/reply";
import {
  bindMenuElementKey,
  clickReplyKey,
  togglePostMenuKey,
  writePostKey,
} from "~/composables/keys";

withDefaults(
  defineProps<{
    postId: string;
    userId: string;
    badgeSize?: "small" | "smallPlus";
    shareOffset?: boolean;
    threadPadding?: boolean;
    showAuthorReply?: boolean;
    authorReplyId?: string | null;
  }>(),
  {
    badgeSize: "small",
    shareOffset: false,
    threadPadding: false,
    showAuthorReply: false,
    authorReplyId: null,
  },
);

const postStore = usePostStore();
const profileStore = useProfileStore();
const replyStore = useReplyStore();
const { showMenu, menu_pid, type: menuType, toggleMenu } =
  inject(togglePostMenuKey)!;
const bindMenuElement = inject(bindMenuElementKey)!;
const { showPopupPost, repost_pid, publishRepost } = inject(writePostKey)!;
const { clickLike, clickBookmark } = useLikeBookmark();
const clickReply = inject(clickReplyKey)!;
</script>

<template>
  <div
    class="flex justify-between pt-2 text-zinc-500"
    :class="{ 'pb-2': threadPadding && showAuthorReply && authorReplyId }"
  >
    <MainPostInteractive class="flex grow justify-between">
      <div class="flex items-center">
        <IconsBadge
          :size="badgeSize"
          color="blue"
          :clicked="!!replyStore.checkReplied(postId)"
          @mousedown="clickReply(postId)"
        >
          <IconsReply />
        </IconsBadge>
        <span
          class="w-2"
          :class="{ 'text-sky-500': replyStore.checkReplied(postId) }"
        >
          {{ replyStore.getReplyCount(postId) }}
        </span>
      </div>
      <div class="flex">
        <div class="flex items-center">
          <div
            :ref="(el) => bindMenuElement(`${postId}_repost_menu_icon`, el as HTMLElement | null)"
            class="flex"
          >
            <IconsBadge
              :size="badgeSize"
              color="green"
              :clicked="menu_pid === postId && menuType === 'repost'"
              @mousedown="toggleMenu(postId, 'repost')"
            >
              <IconsRepost />
            </IconsBadge>
          </div>
          <span class="w-2">{{ postStore.getRepostCount(postId) }}</span>
        </div>
        <div class="relative">
          <UIPopupTransition>
            <UIPopupRepostMenu
              v-if="showMenu && menuType === 'repost' && menu_pid === postId"
              :pid="postId"
              :username="profileStore.usernameById(userId) ?? ''"
              @repost="publishRepost(postId)"
              @quote="
                repost_pid = postId;
                showPopupPost = true;
              "
            />
          </UIPopupTransition>
        </div>
      </div>
      <div class="flex items-center">
        <IconsBadge
          :size="badgeSize"
          color="red"
          :clicked="postStore.checkLike(postId)"
          @mousedown="clickLike(postId)"
        >
          <IconsLike :solid="postStore.checkLike(postId)" />
        </IconsBadge>
        <span
          class="w-2"
          :class="{ 'text-pink-600': postStore.checkLike(postId) }"
        >
          {{ postStore.getLikeCount(postId) }}
        </span>
      </div>
      <div class="flex items-center">
        <IconsBadge
          :size="badgeSize"
          color="blue"
          :clicked="postStore.checkBookmark(postId)"
          @mousedown="clickBookmark(postId)"
        >
          <IconsBookmark :solid="postStore.checkBookmark(postId)" />
        </IconsBadge>
        <span
          class="w-2"
          :class="{ 'text-sky-500': postStore.checkBookmark(postId) }"
        >
          {{ postStore.getBookmarkCount(postId) }}
        </span>
      </div>
    </MainPostInteractive>
    <MainPostInteractive
      class="flex items-center pl-1"
      :class="{ 'translate-x-1': shareOffset }"
    >
      <IconsBadge :size="badgeSize" color="blue">
        <IconsShare />
      </IconsBadge>
    </MainPostInteractive>
  </div>
</template>
