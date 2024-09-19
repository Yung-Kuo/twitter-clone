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
});

onMounted(async () => {
  watchEffect(async () => {
    // await replyStore.fetchReplies(post.id);
    // await replyStore.fetchReplyCount(post.id);
    await postStore.fetchLikeCount(post.id);
    await postStore.fetchBookmarkCount(post.id);
    await replyStore.fetchUserReplyStatus(post.id);
  });
  watchEffect(async () => {
    if (post.reply_to && post.type === "repost") {
      await postStore.fetchOnePost(post.reply_to);
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
// reply
const { pid, reply, publishReply } = inject("popupReply");
// action button
const clickReply = inject("clickReply");
const showPopupReply = inject("showPopupReply");
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
  <div class="w-full text-zinc-200" v-if="postStore.getProfile(post?.user_id)">
    <MainSection>
      <article>
        <!-- upper section -->
        <div class="flex h-min w-full items-start">
          <!-- avatar -->
          <div
            :id="`${post.id}_avatar`"
            @mouseenter="showProfileCard($event.target.id, post.user_id)"
            @mouseleave="hideProfileCard()"
            class="flex items-center"
          >
            <NuxtLink :to="`/${postStore.getUsername(post?.user_id)}`">
              <UIAvatar :user_id="post.user_id" size="small" class="">
              </UIAvatar>
            </NuxtLink>
          </div>
          <!-- user info -->
          <div class="flex flex-col px-2 leading-tight">
            <!-- name -->
            <div
              :id="`${post.id}_name`"
              @mouseenter="showProfileCard($event.target.id, post.user_id)"
              @mouseleave="hideProfileCard()"
              class="font-bold hover:underline"
            >
              <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
                <span>
                  {{ postStore.getName(post.user_id) }}
                </span>
              </NuxtLink>
            </div>
            <!-- username -->
            <div
              :id="`${post.id}_username`"
              @mouseenter="showProfileCard($event.target.id, post.user_id)"
              @mouseleave="hideProfileCard()"
              class="text-sm text-zinc-500"
            >
              <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
                <span>@{{ postStore.getUsername(post.user_id) }}</span>
              </NuxtLink>
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
                :clicked="menu_pid === post.id && type === 'post_action'"
                :id="`${post.id}_menu_icon`"
                @mousedown="toggleMenu(post.id, post.user_id, 'post_action')"
              >
                <IconsMore />
              </IconsBadge>
            </div>
            <!-- menu -->
            <!-- <div class="relative z-10 -translate-x-52 translate-y-2"> -->
            <UIPopupTransition>
              <UIPopupMenu
                v-if="
                  showMenu && type === 'post_action' && menu_pid === post.id
                "
                :pid="menu_pid"
                :uid="menu_uid"
              ></UIPopupMenu>
            </UIPopupTransition>
            <!-- </div> -->
          </div>
        </div>
        <!-- middle section -->
        <div class="flex h-full w-full flex-col gap-3 py-3">
          <!-- content -->
          <div
            v-if="post.type !== 'repost' || post.text !== post.reply_to"
            class="w-full break-all text-lg"
          >
            <pre>{{ post.text }}</pre>
          </div>
          <!-- repost / quote -->
          <div v-if="post.type === 'repost'">
            <MainPostRefer
              v-bind="postStore.getPost(post.reply_to)"
            ></MainPostRefer>
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
        <div class="flex -translate-x-0 items-center">
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
            >{{ replyStore.getReplies(post.id)?.length }}</span
          >
          <!-- replyStore.getReplyCount(post.id) -->
        </div>
        <!-- Repost -->
        <div class="flex">
          <div class="flex items-center">
            <IconsBadge
              size="smallPlus"
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
                @repost="publishRepost()"
                @quote="
                  repost_pid = menu_pid;
                  showPopupPost = true;
                "
                class="noForward"
              ></UIPopupRepostMenu>
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
        <div class="relative z-0 flex translate-x-1 items-center">
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
      <div class="grow" @mousedown="pid = post.id">
        <MainPostTextarea
          v-model="reply"
          placeholder="Post your reply"
          :freeze="pid !== post.id || showPopupReply"
        />
      </div>
      <div>
        <UIButton color="blue" :solid="true" @mousedown="publishReply(post.id)"
          >Reply</UIButton
        >
      </div>
    </div>
  </div>
</template>
