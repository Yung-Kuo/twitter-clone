<script setup>
import { useProfileStore } from "~/stores/profile";
const store = useProfileStore();

// Supabase
const user = useSupabaseUser();
const client = useSupabaseClient();
const emit = defineEmits(["popupPost"]);
const route = useRoute();
// post action menu
// const toggleMenu = inject("toggleMenu");
const { showMenu, type, toggleMenu, menuGetRect } = inject("toggleAccountMenu");
async function signOut() {
  const { error } = await client.auth.signOut();
  store.clearProfile();
}
</script>
<template>
  <div
    id="bottom"
    class="absolute bottom-0 left-0 z-20 flex h-14 w-full justify-between border-t border-zinc-800 bg-zinc-800 bg-opacity-50 text-zinc-200 backdrop-blur-md transition-all duration-500 md:hidden"
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
  </div>
</template>
