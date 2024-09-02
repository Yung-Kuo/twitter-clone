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
    class="hidden h-full w-1/6 justify-center border-r-2 border-zinc-800 md:flex xl:w-1/5 xl:justify-end 2xl:w-3/10"
  >
    <!-- navigation -->
    <!-- align upper & lower section -->
    <div
      id="left"
      class="flex h-full w-max flex-col overflow-y-scroll md:px-5"
      @wheel="stickyMenu()"
    >
      <!-- upper section -->
      <div
        class="flex flex-col items-center justify-center pt-10 text-xl text-zinc-200 xl:items-start"
      >
        <!-- home -->
        <NuxtLink to="/">
          <MainMenuEntry>
            <template #mdMenu>
              <IconsHome :solid="route.path === '/'"></IconsHome>
            </template>
            <template #lgMenu>
              <IconsHome :solid="route.path === '/'"></IconsHome>
            </template>
            <template #title>Home</template>
          </MainMenuEntry>
        </NuxtLink>
        <!-- search -->
        <NuxtLink>
          <MainMenuEntry>
            <template #mdMenu>
              <IconsSearch></IconsSearch>
            </template>
            <template #lgMenu>
              <IconsSearch></IconsSearch>
            </template>
            <template #title>Search</template>
          </MainMenuEntry>
        </NuxtLink>
        <!-- notification -->
        <NuxtLink>
          <MainMenuEntry>
            <template #mdMenu>
              <IconsNotification></IconsNotification>
            </template>
            <template #lgMenu>
              <IconsNotification></IconsNotification>
            </template>
            <template #title>Notification</template>
          </MainMenuEntry>
        </NuxtLink>
        <!-- message -->
        <NuxtLink>
          <MainMenuEntry>
            <template #mdMenu>
              <IconsMessage></IconsMessage>
            </template>
            <template #lgMenu>
              <IconsMessage></IconsMessage>
            </template>
            <template #title>Message</template>
          </MainMenuEntry>
        </NuxtLink>
        <!-- bookmarks -->
        <NuxtLink to="/bookmarks">
          <MainMenuEntry>
            <template #mdMenu>
              <IconsBookmark
                :solid="route.path === '/bookmarks'"
              ></IconsBookmark>
            </template>
            <template #lgMenu>
              <IconsBookmark
                :solid="route.path === '/bookmarks'"
              ></IconsBookmark>
            </template>
            <template #title>Bookmarks</template>
          </MainMenuEntry>
        </NuxtLink>
        <!-- profile -->
        <NuxtLink :to="`/${store.getUsername}`">
          <MainMenuEntry>
            <template #mdMenu>
              <IconsProfile
                :solid="route.path === `/${store.getUsername}`"
              ></IconsProfile>
            </template>
            <template #lgMenu>
              <IconsProfile
                :solid="route.path === `/${store.getUsername}`"
              ></IconsProfile>
            </template>
            <template #title>Profile</template>
          </MainMenuEntry>
        </NuxtLink>
        <!-- write post -->
        <div @click="emit('popupPost')" class="mt-2">
          <IconsBadge size="medium" class="xl:hidden">
            <IconsWrite></IconsWrite>
          </IconsBadge>
          <div class="hidden h-14 w-52 xl:flex 2xl:w-60">
            <UIButton color="blue" :solid="true" class="w-full">Post</UIButton>
          </div>
        </div>
      </div>
      <!-- height filler -->
      <div class="grow"></div>
      <!-- lower section -->
      <div class="w-full py-5">
        <!-- account menu -->
        <UIPopupTransition>
          <div
            v-if="showMenu && type === 'account'"
            id="account_menu"
            ref="account_menu"
            class="absolute z-30 h-28 w-60 -translate-y-32 rounded-xl bg-black py-2 text-xl text-zinc-200 shadow-3xl shadow-zinc-700 transition-all"
          >
            <!-- edit profile -->
            <NuxtLink to="/profile">
              <div
                class="flex h-1/2 w-full items-center justify-start p-5 transition-all hover:bg-zinc-900 active:bg-zinc-800"
              >
                Edit Profile
              </div>
            </NuxtLink>
            <!-- sign out -->
            <div
              @click="signOut()"
              class="flex h-1/2 w-full items-center justify-start p-5 transition-all hover:bg-zinc-900 active:bg-zinc-800"
            >
              Sign Out
            </div>
          </div>
        </UIPopupTransition>

        <!-- account icon -->
        <MainMenuEntry
          id="account_menu_icon"
          @mousedown="toggleMenu(null, user.id, 'account')"
        >
          <template #mdMenu>
            <UIAvatar :user_id="user.id" size="small"></UIAvatar>
          </template>
          <template #lgMenu>
            <UIAvatar :user_id="user.id" size="small"></UIAvatar>
          </template>
          <template #title>
            <div class="flex h-min flex-col text-base leading-tight">
              <span v-show="store.getName" class="font-bold">{{
                store.getName
              }}</span>
              <span v-show="store.getUsername" class="text-zinc-500"
                >@{{ store.getUsername }}</span
              >
            </div>
          </template>
        </MainMenuEntry>
      </div>
    </div>
  </div>
</template>

<style>
#left::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
#left {
  scrollbar-width: none;
}
</style>
