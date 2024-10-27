<script setup>
const router = useRouter();
const route = useRoute();
const user = useSupabaseUser();
const profileStore = useProfileStore();
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
  // toggle translate-x-[20rem] to the body
  const mainPage = document.getElementById("mainPage");
  mainPage.classList.toggle("translate-x-[20rem]");
  mainPage.classList.toggle("md:translate-x-0");
  // toggle centerMask
  showMask.value = !showMask.value;
}
</script>
<template>
  <div class="relative h-screen overflow-hidden grow">
    <!-- top banner -->
    <div class="relative md:w-5/6 xl:w-5/8 2xl:w-7/12">
      <div
        id="banner"
        class="absolute left-0 top-0 z-20 flex w-full flex-col bg-black bg-opacity-20 backdrop-blur-md transition-all duration-300"
        :class="{ 'border-b border-zinc-800 md:border-b-2': $slots.nav }"
      >
        <!-- mask -->
        <div v-if="!$slots.title" class="flex md:hidden">
          <Transition
            enter-active-class="transition-all"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-all"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-show="showMask"
              @mousedown="toggleSidePanel()"
              class="absolute left-0 top-0 z-30 h-screen w-screen overflow-hidden bg-zinc-800 bg-opacity-50"
            />
          </Transition>
          <!-- avatar -->
          <div v-if="!$slots.title" class="flex md:hidden">
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
        </div>
        <!-- top row / title, subtitle -->
        <div
          v-if="$slots.title"
          class="flex h-12 items-center gap-6 pl-3 text-zinc-200 md:h-14"
        >
          <!-- go back -->
          <div v-if="$slots.title" class="flex h-full w-min items-center">
            <NuxtLink @click="router.back()">
              <IconsBadge size="small">
                <IconsBack></IconsBack>
              </IconsBadge>
            </NuxtLink>
          </div>
          <!-- header -->
          <div
            v-if="$slots.title"
            class="flex h-full flex-col justify-center px-1"
          >
            <h1
              class="flex h-3/5 items-center text-lg font-bold leading-none md:text-xl"
            >
              <slot name="title" />
            </h1>

            <span
              v-if="$slots.subtitle"
              class="flex h-2/5 items-start text-sm leading-none text-gray-500"
            >
              <slot name="subtitle" />
            </span>
          </div>
        </div>
        <!-- bottom row / navigation -->
        <div v-if="$slots.nav" class="grid h-12 grid-cols-2 md:h-14">
          <slot name="nav" />
        </div>
      </div>
    </div>

    <!-- main section -->
    <div
      id="center"
      class="flex h-full w-full overflow-y-scroll"
      @wheel="handleWheelEvent($event, 'center')"
      @scroll="
        !props.initialScroll ? handleScroll($event) : null;
        getRect();
        menuGetRect();
      "
      @touchmove="swipeRight($event, $slots.mainBanner)"
    >
      <div
        class="h-max w-full pb-32 md:w-5/6 md:pb-14 xl:w-5/8 2xl:w-7/12"
        :class="props.userPage
          ? ''
          : $slots.title && $slots.nav
          ? 'pt-24 md:pt-28'
          : 'pt-12 md:pt-14',
        $slots.nav ? 'border-t-2 border-transparent': ''
      ">
        <slot name="main" />
      </div>
      <!-- right panel -->
      <!-- put the right panel inside center panel so that the scrollbar can be at the right most position -->
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
