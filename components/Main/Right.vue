<script setup>
import { useProfileStore } from "~/stores/profile";
import {
  getRectKey,
  handleWheelEventKey,
  layoutRefsKey,
  menuGetRectKey,
} from "~/composables/keys";

const profileStore = useProfileStore();

const layoutRefs = inject(layoutRefsKey);
const searchBarRef = ref(null);

function bindRight(el) {
  layoutRefs.right.value = el;
}

const handleWheelEvent = inject(handleWheelEventKey);
const getRect = inject(getRectKey);
const menuGetRect = inject(menuGetRectKey, () => null);

const props = defineProps({
  user_id: {
    type: String,
    default: null,
  },
});
onMounted(async () => {
  await profileStore.fetchProfiles();
});

const userProfileList = computed(() => {
  if (props?.user_id) return null;
  else return profileStore.getProfileList;
});

const search = ref("");
const clicked = ref(false);
function focusinSearchBar() {
  searchBarRef.value?.focus();
  clicked.value = true;
}
function focusoutSearchBar() {
  clicked.value = false;
}
</script>
<template>
  <div
    :ref="bindRight"
    class="main-right-scrollbar absolute right-0 top-0 hidden h-full w-0 overflow-y-scroll border-l-2 border-zinc-800 md:visible md:block md:w-1/6 md:p-5 xl:w-3/8 2xl:w-5/12"
    @wheel="
      handleWheelEvent($event, 'right');
      getRect();
      menuGetRect();
    "
  >
    <div class="hidden w-0 flex-col gap-5 xl:flex xl:w-full 2xl:w-4/5">
      <!-- search bar -->
      <div
        tabindex="0"
        class="flex h-12 w-full items-center gap-2 rounded-full border-2 border-zinc-800 bg-zinc-800 px-3 text-zinc-500 focus-within:border-sky-500 focus-within:bg-black"
        @focusin="focusinSearchBar()"
        @focusout="focusoutSearchBar()"
      >
        <div class="flex-none">
          <IconsBadge size="xsmall" :no-hover="true">
            <IconsSearch :class="{ 'text-sky-500': clicked }"/>
          </IconsBadge>
        </div>
        <div class="grow">
          <input
            id="search_bar"
            ref="searchBarRef"
            v-model="search"
            class="w-full bg-transparent text-lg text-zinc-200 outline-none placeholder:text-zinc-400"
            placeholder="Search"
          >
        </div>

        <!-- empty search query -->
        <div
          v-show="search && clicked"
          class="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-sky-500 text-black"
          @click="search = ''"
        >
          <IconsClose />
        </div>
      </div>
      <div
        class="min-h-[8rem] w-full rounded-2xl border-2 border-zinc-800 p-4 pt-3 text-zinc-200"
      >
        <div v-if="props.user_id" class="flex flex-col gap-4">
          <h1 class="text-xl font-bold">Relevant People</h1>
          <UIUserInfo :user_id="props.user_id" />
        </div>
        <div v-else class="flex flex-col gap-4">
          <h1 class="text-xl font-bold">You might like</h1>
          <ul class="flex flex-col gap-4">
            <li
              v-for="userProfile in userProfileList"
              :key="userProfile.id"
            >
              <UIUserInfoCompact :user_id="userProfile.id" />
            </li>
          </ul>
        </div>
      </div>

      <div
        class="flex min-h-[24rem] w-full flex-col gap-4 rounded-2xl border-2 border-zinc-800 px-4 py-3 text-zinc-200"
      >
        <h1 class="text-xl font-bold">Trends for you</h1>
      </div>
      <div class="h-80 w-full rounded-2xl border-2 border-zinc-800"/>
    </div>
  </div>
</template>

<style scoped>
@supports selector(::-webkit-scrollbar) {
  .main-right-scrollbar::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}
.main-right-scrollbar {
  scrollbar-width: none;
}
</style>
