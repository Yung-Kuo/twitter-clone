<script setup>
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
const user = useSupabaseUser();
const profileStore = useProfileStore();
const postStore = usePostStore();
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
const date = computed(() => {
  const dt = new Date(post.created_at);
  // Format the date portion
  const date = dt.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
  });
  return `${date}`;
});

// click post
const { target_post, clickPost, hoverPost } = inject("clickPost");
</script>
<template>
  <MainPostHoverClickWrapper :post="post" noHover class="flex hover:!bg-black">
    <!-- left column / avatar -->
    <div class="flex w-min flex-col">
      <!-- avatar for show post -->
      <div class="h-min w-min">
        <NuxtLink :to="`/${postStore.getUsername(post?.user_id)}`">
          <UIAvatar :user_id="post?.user_id" size="small"> </UIAvatar>
        </NuxtLink>
      </div>
      <!-- thread -->
      <div
        class="noForward flex w-full flex-grow cursor-default justify-center"
      >
        <span class="h-full border border-zinc-800"></span>
      </div>
    </div>
    <!-- right column -->
    <div class="w-[calc(100%-2.5rem)] px-2">
      <!-- upper section -->
      <div class="flex flex-col">
        <!-- user info -->
        <div class="flex w-max items-center">
          <div class="font-bold hover:underline">
            <!-- name -->
            <div class="noForward">
              <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
                <span>
                  {{ postStore.getName(post.user_id) }}
                </span>
              </NuxtLink>
            </div>
          </div>
          &ensp;
          <div class="flex text-zinc-500">
            <!-- username -->
            <div class="noForward">
              <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
                <span> @{{ postStore.getUsername(post.user_id) }}</span>
              </NuxtLink>
            </div>
            <span class="flex w-3 justify-center">·</span>
            <!-- post time -->
            <pre>{{ date }}</pre>
            <!-- edited -->
            <pre v-if="post.edited"> · edited</pre>
          </div>
        </div>
        <!-- content -->
        <div class="flex max-h-[18rem] flex-col gap-3 overflow-y-scroll pt-2">
          <pre
            v-if="post.type !== 'repost && post.text !== repost'"
            class="w-full"
            >{{ post.text }}</pre
          >
          <!-- repost / quote -->
          <div v-if="post.type === 'repost'">
            <MainPostRefer
              v-bind="postStore.getPost(post.reply_to)"
            ></MainPostRefer>
          </div>
        </div>
      </div>
      <!-- lower section -->
      <div class="noForward cursor-default pb-4 pt-2">
        <!-- replying to -->
        <span class="text-zinc-500">Replying to </span>
        <NuxtLink :to="`/${postStore.getUsername(post.user_id)}`">
          <span class="text-sky-500"
            >@{{ postStore.getUsername(post.user_id) }}</span
          >
        </NuxtLink>
      </div>
    </div>
  </MainPostHoverClickWrapper>
</template>
