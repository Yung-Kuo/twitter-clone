<script setup>
const router = useRouter();
const route = useRoute();
const user = useSupabaseUser();
const profileStore = useProfileStore();
const { swipeRight } = useSwipe();
const handleWheelEvent = inject("handleWheelEvent");
const handleScroll = inject("handleScroll");
const getRect = inject("getRect", () => null);
const menuGetRect = inject("menuGetRect", () => null);

const props = defineProps({
  initialScroll: {
    type: Boolean,
    default: false,
  },
  userPage: {
    type: Boolean,
    default: false,
  },
});

const showMask = ref(false);
function toggleSidePanel() {
  // toggle translate-x-[75%] to the body
  const mainPage = document.getElementById("mainPage");
  mainPage.classList.toggle("translate-x-[75%]");
  mainPage.classList.toggle("md:translate-x-0");
  // toggle centerMask
  showMask.value = !showMask.value;
}
function hasOpacity() {
  const center = document.getElementById("center");
  if (center.classList.contains("opacity-50")) {
    return true;
  } else {
    return false;
  }
}
</script>
<template>
  <div class="relative h-screen w-screen overflow-hidden md:w-5/6">
    <!-- top banner -->
    <div
      id="banner"
      class="absolute left-0 top-0 z-20 flex max-h-[7rem] min-h-[3rem] w-full flex-col bg-black bg-opacity-20 backdrop-blur-md transition-all duration-300 md:h-14 md:w-5/6 xl:w-5/8 2xl:w-3/5"
      :class="{ 'border-b border-zinc-800 md:border-b-2': $slots.mainBanner }"
    >
      <div v-if="route.path === '/'">
        <!-- mask -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-show="showMask"
            @mousedown="toggleSidePanel()"
            class="absolute left-0 top-0 z-30 h-screen w-screen overflow-hidden bg-zinc-800 bg-opacity-50"
          />
        </Transition>
        <!-- account avatar / open side panel -->
        <div class="relative flex h-12 items-center p-3 md:hidden">
          <UIAvatar
            :user_id="user.id"
            size="xsmall"
            class="z-40 cursor-pointer"
            @mousedown="toggleSidePanel()"
          ></UIAvatar>
        </div>
      </div>
      <!-- for index page -->
      <slot name="mainBanner" />

      <!-- for pages other than index page -->
      <div
        v-if="$slots.banner"
        class="flex h-12 items-center gap-6 pl-5 md:h-full"
      >
        <div class="flex h-full w-min items-center">
          <NuxtLink @click="router.back()">
            <IconsBadge size="small" class="text-white">
              <IconsBack></IconsBack>
            </IconsBadge>
          </NuxtLink>
        </div>
        <!-- header -->
        <div class="flex h-full flex-col justify-center px-1">
          <slot name="banner" />
        </div>
      </div>
    </div>
    <!-- main section -->
    <div
      id="center"
      class="flex h-full w-full overflow-y-scroll"
      @wheel="handleWheelEvent($event, 'center')"
      @scroll="
        handleScroll($event, !props.initialScroll);
        getRect();
        menuGetRect();
      "
      @touchmove="swipeRight($event, $slots.mainBanner)"
    >
      <div
        class="h-max w-full pb-32 md:w-5/6 md:pb-14 xl:w-5/8 2xl:w-3/5"
        :class="{ 'pt-12 md:pt-14': !props.userPage }"
      >
        <slot name="main" />
      </div>
      <MainRight />
    </div>
  </div>
</template>

<style>
/* #center::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
#center {
  scrollbar-width: none;
} */
</style>
