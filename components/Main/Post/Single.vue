<script setup>
import { usePostStore } from "~/stores/post";
import { useProfileStore } from "~/stores/profile";
import { useReplyStore } from "~/stores/reply";
import {
  bindMenuElementKey,
  clickReplyKey,
  popupReplyKey,
  profileCardKey,
  togglePostMenuKey,
  writePostKey,
} from "~/composables/keys";

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
  if (!replyStore.getReplyCount(post.id)) {
    await replyStore.fetchReplyCount(post.id);
  }
  if (!postStore.getLikeCount(post.id)) {
    await postStore.fetchLikeCount(post.id);
  }
  if (!postStore.getBookmarkCount(post.id)) {
    await postStore.fetchBookmarkCount(post.id);
  }
  if (!postStore.getRepostCount(post.id)) {
    await postStore.fetchRepostCount(post.id);
  }
  await replyStore.fetchUserReplyStatus(post.id);
});

watchEffect(async () => {
  if (post.reply_to && post.type === "repost") {
    await postStore.fetchOnePost(post.reply_to);
  }
});

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
const { publishReply } = inject(popupReplyKey);
const reply = ref("");
// action button
const { clickLike, clickBookmark } = useLikeBookmark();

// timestamp
const time = computed(() => {
  const dt = new Date(post.created_at);
  // Format the time portion
  const time = dt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return time;
});
const date = computed(() => {
  const dt = new Date(post.created_at);
  // Format the date portion
  const date = dt.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return date;
});
</script>
<template>
  <div
    v-if="profileStore.profileById(post?.user_id)"
    class="w-full px-3 tracking-wide text-zinc-200 2xl:px-5"
  >
    <MainSection>
      <article>
        <!-- upper section -->
        <div class="flex h-min w-full items-start">
          <!-- avatar -->
          <div
            class="flex items-center"
            @mouseenter="
              showProfileCard($event.currentTarget, post.user_id)
            "
            @mouseleave="hideProfileCard()"
          >
            <NuxtLink :to="`/${profileStore.usernameById(post?.user_id)}`">
              <UIAvatar :user_id="post.user_id" size="small" class=""/>
            </NuxtLink>
          </div>
          <!-- user info -->
          <div class="flex flex-col px-2 leading-tight">
            <!-- name -->
            <div
              class="font-bold hover:underline"
              @mouseenter="
                showProfileCard($event.currentTarget, post.user_id)
              "
              @mouseleave="hideProfileCard()"
            >
              <NuxtLink :to="`/${profileStore.usernameById(post.user_id)}`">
                <span>
                  {{ profileStore.nameById(post.user_id) }}
                </span>
              </NuxtLink>
            </div>
            <!-- username -->
            <div
              class="text-sm text-zinc-500"
              @mouseenter="
                showProfileCard($event.currentTarget, post.user_id)
              "
              @mouseleave="hideProfileCard()"
            >
              <NuxtLink :to="`/${profileStore.usernameById(post.user_id)}`">
                <span>@{{ profileStore.usernameById(post.user_id) }}</span>
              </NuxtLink>
            </div>
          </div>
          <!-- spacing -->
          <div class="grow"/>
          <!-- post action -->
          <div class="flex flex-col">
            <!-- icon -->
            <div class="flex h-full items-center text-zinc-500">
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
          </div>
        </div>
        <!-- middle section -->
        <div class="flex h-full w-full flex-col gap-3 py-3">
          <!-- content -->
          <div
            v-if="post.type !== 'repost' || post.text !== post.reply_to"
            class="w-full text-lg"
          >
            <pre>{{ post.text }}</pre>
          </div>
          <!-- repost / quote -->
          <div v-if="post.type === 'repost'">
            <MainPostRefer
              v-bind="postStore.getPost(post.reply_to)"
            />
          </div>
          <div class="flex text-zinc-500">
            <!-- timestamp -->
            <div class="hover:underline">
              <pre>{{ time }} · {{ date }}</pre>
            </div>
            <!-- edited -->
            <div>
              <pre v-if="post.edited"> · edited</pre>
            </div>
          </div>
        </div>
      </article>
    </MainSection>
    <!-- lower section -->
    <!-- action buttons -->
    <MainSection>
      <div class="flex h-full items-center justify-between py-2 text-zinc-500">
        <!-- Reply -->
        <div class="flex items-center">
          <IconsBadge
            size="smallPlus"
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
          <!-- replyStore.getReplyCount(post.id) -->
        </div>
        <!-- Repost -->
        <div class="flex">
          <div class="flex items-center">
            <div
              :ref="(el) => bindMenuElement(`${post.id}_repost_menu_icon`, el)"
              class="flex"
            >
              <IconsBadge
                size="smallPlus"
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
                v-if="showMenu && menuType === 'repost' && menu_pid === post.id"
                :pid="post.id"
                :username="profileStore.usernameById(post.user_id)"
                class="noForward"
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
        <div class="flex items-center">
          <IconsBadge
            size="smallPlus"
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
        <div class="flex items-center">
          <IconsBadge
            size="smallPlus"
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
        <!-- Share -->
        <div class="flex translate-x-1 items-center">
          <IconsBadge size="smallPlus" color="blue">
            <IconsShare />
          </IconsBadge>
        </div>
      </div>
    </MainSection>
    <!-- reply -->
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
          >Reply</UIButton
        >
      </div>
    </div>
  </div>
</template>
