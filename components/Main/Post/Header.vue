<script setup lang="ts">
import { useProfileStore } from "~/stores/profile";
import {
  bindMenuElementKey,
  profileCardKey,
  togglePostMenuKey,
} from "~/composables/keys";

type PostHeaderPost = {
  id: string;
  user_id: string;
  created_at: string;
  edited?: boolean;
};

const props = defineProps<{
  post: PostHeaderPost;
  variant: "feed" | "refer" | "single";
}>();

const profileStore = useProfileStore();
const { showProfileCard, hideProfileCard } = inject(profileCardKey)!;
const { showMenu, menu_pid, type: menuType, toggleMenu } =
  inject(togglePostMenuKey)!;
const bindMenuElement = inject(bindMenuElementKey)!;

const date = computed(() => {
  const dt = new Date(props.post.created_at);
  const monthDay = dt.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
  });
  if (props.variant === "single") {
    const year = dt.toLocaleString("en-US", { year: "numeric" });
    return { monthDay, year };
  }
  return { monthDay, year: "" };
});

const usernamePath = computed(
  () => `/${profileStore.usernameById(props.post.user_id)}`,
);
</script>

<template>
  <!-- refer: compact inline header -->
  <div
    v-if="variant === 'refer'"
    class="flex h-min w-full items-center gap-2"
  >
    <MainPostInteractive
      @mouseenter="showProfileCard($event.currentTarget as HTMLElement, post.user_id)"
      @mouseleave="hideProfileCard()"
    >
      <NuxtLink :to="usernamePath" @click.stop @mousedown.stop>
        <UIAvatar :user_id="post.user_id" size="xsmall" />
      </NuxtLink>
    </MainPostInteractive>
    <div
      class="flex h-min w-min items-center overflow-x-scroll whitespace-nowrap leading-none"
    >
      <MainPostInteractive
        class="h-full w-max font-bold hover:underline"
        @mouseenter="showProfileCard($event.currentTarget as HTMLElement, post.user_id)"
        @mouseleave="hideProfileCard()"
      >
        <NuxtLink :to="usernamePath">
          <span>{{ profileStore.nameById(post.user_id) }}</span>
        </NuxtLink>
      </MainPostInteractive>
      &ensp;
      <div class="flex h-full items-end text-sm text-zinc-500">
        <MainPostInteractive
          class="w-max"
          @mouseenter="showProfileCard($event.currentTarget as HTMLElement, post.user_id)"
          @mouseleave="hideProfileCard()"
        >
          <NuxtLink :to="usernamePath">
            <span>@{{ profileStore.usernameById(post.user_id) }}</span>
          </NuxtLink>
        </MainPostInteractive>
      </div>
      <div class="flex h-full items-end text-sm text-zinc-500">
        <pre> · {{ date.monthDay }}</pre>
        <pre v-if="post.edited"> · edited</pre>
      </div>
    </div>
  </div>

  <!-- feed: row with menu -->
  <div v-else-if="variant === 'feed'" class="flex h-5 w-full items-center pl-2">
    <div
      class="flex h-min w-min items-center overflow-x-scroll whitespace-nowrap leading-none"
    >
      <MainPostInteractive
        class="h-full w-max font-bold hover:underline"
        @mouseenter="showProfileCard($event.currentTarget as HTMLElement, post.user_id)"
        @mouseleave="hideProfileCard()"
      >
        <NuxtLink :to="usernamePath">
          <span>{{ profileStore.nameById(post.user_id) }}</span>
        </NuxtLink>
      </MainPostInteractive>
      &ensp;
      <div class="flex h-full items-end text-sm text-zinc-500">
        <MainPostInteractive
          class="w-max"
          @mouseenter="showProfileCard($event.currentTarget as HTMLElement, post.user_id)"
          @mouseleave="hideProfileCard()"
        >
          <NuxtLink :to="usernamePath">
            <span> @{{ profileStore.usernameById(post.user_id) }}</span>
          </NuxtLink>
        </MainPostInteractive>
      </div>
      <div class="flex h-full items-end text-sm text-zinc-500">
        <pre> · {{ date.monthDay }}</pre>
        <pre v-if="post.edited"> · edited</pre>
      </div>
    </div>
    <div class="grow" />
    <MainPostInteractive class="flex flex-col">
      <div class="flex h-min items-center text-zinc-500">
        <div
          :ref="(el) => bindMenuElement(`${post.id}_menu_icon`, el as HTMLElement | null)"
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
      <UIPopupTransition>
        <UIPopupMenu
          v-if="showMenu && menuType === 'post_action' && menu_pid === post.id"
          :pid="post.id"
          :uid="post.user_id"
        />
      </UIPopupTransition>
    </MainPostInteractive>
  </div>

  <!-- single: stacked name + menu -->
  <div v-else class="flex h-min w-full items-start">
    <MainPostInteractive
      class="flex items-center"
      @mouseenter="showProfileCard($event.currentTarget as HTMLElement, post.user_id)"
      @mouseleave="hideProfileCard()"
    >
      <NuxtLink :to="usernamePath" @click.stop @mousedown.stop>
        <UIAvatar :user_id="post.user_id" size="small" />
      </NuxtLink>
    </MainPostInteractive>
    <div class="flex flex-col px-2 leading-tight">
      <div
        class="font-bold hover:underline"
        @mouseenter="showProfileCard($event.currentTarget as HTMLElement, post.user_id)"
        @mouseleave="hideProfileCard()"
      >
        <NuxtLink :to="usernamePath">
          <span>{{ profileStore.nameById(post.user_id) }}</span>
        </NuxtLink>
      </div>
      <div
        class="text-sm text-zinc-500"
        @mouseenter="showProfileCard($event.currentTarget as HTMLElement, post.user_id)"
        @mouseleave="hideProfileCard()"
      >
        <NuxtLink :to="usernamePath">
          <span>@{{ profileStore.usernameById(post.user_id) }}</span>
        </NuxtLink>
      </div>
    </div>
    <div class="grow" />
    <MainPostInteractive class="flex flex-col">
      <div class="flex h-full items-center text-zinc-500">
        <div
          :ref="(el) => bindMenuElement(`${post.id}_menu_icon`, el as HTMLElement | null)"
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
      <UIPopupTransition>
        <UIPopupMenu
          v-if="showMenu && menuType === 'post_action' && menu_pid === post.id"
          :pid="post.id"
          :uid="post.user_id"
        />
      </UIPopupTransition>
    </MainPostInteractive>
  </div>
</template>
