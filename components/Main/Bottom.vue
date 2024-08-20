<script setup>
import { IconsBadge } from "~/.nuxt/components";
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
function stickyMenu() {
  if (showMenu.value && type.value === "account") menuGetRect();
}
onMounted(() => {
  window.addEventListener("resize", stickyMenu);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", stickyMenu);
});
const account_menu = ref("");
watch(account_menu, () => {
  if (account_menu.value) stickyMenu();
});

async function signOut() {
  const { error } = await client.auth.signOut();
  store.clearProfile();
}
</script>
<template>
  <div
    class="absolute bottom-0 left-0 z-50 flex h-14 w-full justify-between border-t border-zinc-800 bg-transparent backdrop-blur-md md:hidden"
  >
    <div class="h-full w-20 bg-red-500">
      <IconsBadge size="medium">
        <IconsHome />
      </IconsBadge>
    </div>
  </div>
</template>
