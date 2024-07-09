<script setup>
import { useProfileStore } from "~/stores/profile";
const store = useProfileStore();

// Supabase
const user = useSupabaseUser();
const client = useSupabaseClient();
const emit = defineEmits(["popupPost"]);
const route = useRoute();
// post action menu
const toggleMenu = inject("toggleMenu");
const { showMenu, type, menuGetRect } = inject("toggleAccountMenu");
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
    class="flex h-full w-1/6 justify-center border-r-2 border-zinc-800 text-xl text-zinc-200 xl:w-1/5 xl:justify-end 2xl:w-3/10"
  >
    <!-- navigation -->
    <!-- align upper & lower section -->
    <div
      id="left"
      class="flex h-full w-max flex-col overflow-y-scroll px-5"
      @wheel="stickyMenu()"
    >
      <!-- upper section -->
      <div
        class="flex flex-col items-center justify-center pt-10 xl:items-start"
      >
        <!-- home -->
        <NuxtLink to="/">
          <MainMenuEntry>
            <template #sm-menu>
              <IconsHome :solid="route.path === '/'"></IconsHome>
            </template>
            <template #lg-menu>
              <IconsHome :solid="route.path === '/'"></IconsHome>
            </template>
            <template #title>Home</template>
          </MainMenuEntry>
        </NuxtLink>
        <!-- search -->
        <NuxtLink>
          <MainMenuEntry>
            <template #sm-menu>
              <IconsSearch></IconsSearch>
            </template>
            <template #lg-menu>
              <IconsSearch></IconsSearch>
            </template>
            <template #title>Search</template>
          </MainMenuEntry>
        </NuxtLink>
        <!-- notification -->
        <NuxtLink>
          <MainMenuEntry>
            <template #sm-menu>
              <IconsNotification></IconsNotification>
            </template>
            <template #lg-menu>
              <IconsNotification></IconsNotification>
            </template>
            <template #title>Notification</template>
          </MainMenuEntry>
        </NuxtLink>
        <!-- message -->
        <NuxtLink>
          <MainMenuEntry>
            <template #sm-menu>
              <IconsMessage></IconsMessage>
            </template>
            <template #lg-menu>
              <IconsMessage></IconsMessage>
            </template>
            <template #title>Message</template>
          </MainMenuEntry>
        </NuxtLink>
        <!-- bookmarks -->
        <NuxtLink to="/bookmarks">
          <MainMenuEntry>
            <template #sm-menu>
              <IconsBookmark
                :solid="route.path === '/bookmarks'"
              ></IconsBookmark>
            </template>
            <template #lg-menu>
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
            <template #sm-menu>
              <IconsProfile
                :solid="route.path === `/${store.getUsername}`"
              ></IconsProfile>
            </template>
            <template #lg-menu>
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
          <div class="hidden h-14 w-40 xl:flex 2xl:w-60">
            <UIButton color="blue" :solid="true" class="w-full">Post</UIButton>
          </div>
        </div>
      </div>
      <!-- height filler -->
      <div class="grow"></div>
      <!-- lower section -->
      <div
        class="flex w-full flex-col items-center justify-center py-5 xl:justify-start"
      >
        <!-- account -->
        <div class="w-full">
          <!-- account menu -->
          <UIPopupTransition>
            <div
              v-if="showMenu && type === 'account'"
              id="account_menu"
              ref="account_menu"
              class="absolute z-30 h-28 w-60 -translate-y-32 rounded-xl bg-black py-2 shadow-3xl shadow-zinc-700 transition-all"
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
            <template #sm-menu>
              <UIAvatar :user_id="user.id" size="small"></UIAvatar>
            </template>
            <template #lg-menu>
              <UIAvatar :user_id="user.id" size="small"></UIAvatar>
            </template>
            <template #title>
              <div class="flex flex-col pl-2 text-base">
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
  </div>
</template>

<style>
#left::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
