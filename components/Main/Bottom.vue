<script setup>
import { useProfileStore } from "~/stores/profile";
import {
  layoutRefsKey,
  scrollChromeKey,
  showPopupPostKey,
  useSearchKey,
} from "~/composables/keys";

const store = useProfileStore();

const layoutRefs = inject(layoutRefsKey);
const scrollChrome = inject(scrollChromeKey);

function bindBottom(el) {
  layoutRefs.bottom.value = el;
}

// Supabase
const route = useRoute();
const showPopupPost = inject(showPopupPostKey);
const { showSearch, toggleSearch } = useSearch();
provide(useSearchKey, { showSearch, toggleSearch });
</script>
<template>
  <div
    :ref="bindBottom"
    class="absolute bottom-0 left-0 z-20 flex h-14 w-full justify-between border-t border-zinc-800 bg-black bg-opacity-20 text-zinc-200 transition-[opacity,backdrop-filter] duration-500 md:hidden"
    :class="
      scrollChrome.bottomMuted
        ? 'backdrop-blur-0 opacity-50'
        : 'backdrop-blur-md'
    "
  >
    <!-- Search -->
    <Teleport to="body">
      <UIPopupSearch />
    </Teleport>
    <NuxtLink to="/">
      <div class="flex h-full w-min items-center px-3">
        <IconsBadge no-hover>
          <IconsHome :solid="route.path === '/'" />
        </IconsBadge>
      </div>
    </NuxtLink>
    <div class="flex h-full w-min items-center px-3">
      <IconsBadge no-hover @mousedown="toggleSearch()">
        <IconsSearch />
      </IconsBadge>
    </div>
    <NuxtLink :to="`/${store.getUsername}`">
      <div class="flex h-full w-min items-center px-3">
        <IconsBadge no-hover>
          <IconsProfile :solid="route.path === `/${store.getUsername}`" />
        </IconsBadge>
      </div>
    </NuxtLink>
    <div class="flex h-full w-min items-center px-3">
      <IconsBadge no-hover>
        <IconsNotification />
      </IconsBadge>
    </div>
    <div class="flex h-full w-min items-center px-3">
      <IconsBadge no-hover>
        <IconsMessage />
      </IconsBadge>
    </div>

    <div class="relative z-10">
      <!-- new post gadget -->
      <IconsBadge
        size="medium"
        class="absolute -translate-x-16 -translate-y-16"
        @mousedown="showPopupPost = true"
      >
        <div
          class="flex h-full w-full items-center justify-center rounded-full bg-sky-500 transition-colors hover:bg-sky-600"
        >
          <pre class="text-4xl leading-none text-zinc-200">+</pre>
        </div>
      </IconsBadge>
    </div>
  </div>
</template>
