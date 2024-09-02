<script setup>
import { useProfileStore } from "~/stores/profile";
const store = useProfileStore();

// Supabase
const user = useSupabaseUser();
const client = useSupabaseClient();
const emit = defineEmits(["popupPost"]);
const route = useRoute();
const showPopupPost = inject("showPopupPost");
async function signOut() {
  const { error } = await client.auth.signOut();
  store.clearProfile();
}
</script>
<template>
  <div
    id="bottom"
    class="absolute bottom-0 left-0 z-20 flex h-14 w-full justify-between border-t border-zinc-800 bg-black bg-opacity-20 text-zinc-200 backdrop-blur-md transition-all duration-500 md:hidden"
  >
    <NuxtLink to="/">
      <div class="flex h-full w-min items-center px-3">
        <IconsBadge noHover>
          <IconsHome :solid="route.path === '/'" class="backdrop-blur-lg" />
        </IconsBadge>
      </div>
    </NuxtLink>
    <div class="flex h-full w-min items-center px-3">
      <IconsBadge noHover>
        <IconsSearch />
      </IconsBadge>
    </div>
    <NuxtLink :to="`/${store.getUsername}`">
      <div class="flex h-full w-min items-center px-3">
        <IconsBadge noHover>
          <IconsProfile :solid="route.path === `/${store.getUsername}`" />
        </IconsBadge>
      </div>
    </NuxtLink>
    <div class="flex h-full w-min items-center px-3">
      <IconsBadge noHover>
        <IconsNotification />
      </IconsBadge>
    </div>
    <div class="flex h-full w-min items-center px-3">
      <IconsBadge noHover>
        <IconsMessage />
      </IconsBadge>
    </div>

    <div class="relative">
      <!-- new post gadget -->
      <IconsBadge
        size="medium"
        class="absolute -translate-x-16 -translate-y-16"
        @mousedown="showPopupPost = true"
      >
        <div
          class="flex h-full w-full items-center justify-center rounded-full bg-sky-500 transition-all hover:bg-sky-600"
        >
          <pre class="text-4xl leading-none text-zinc-200">+</pre>
        </div>
      </IconsBadge>
    </div>
  </div>
</template>
