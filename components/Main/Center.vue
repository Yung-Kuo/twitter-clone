<script setup>
const router = useRouter();
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
});
</script>
<template>
  <div class="relative h-screen w-screen overflow-hidden md:w-5/6">
    <!-- top banner -->
    <div
      id="banner"
      class="absolute left-0 top-0 z-20 flex max-h-[7rem] min-h-[3.5rem] w-full bg-zinc-800 bg-opacity-50 backdrop-blur-md transition-all duration-300 md:h-14 md:w-5/6 xl:w-5/8 2xl:w-3/5"
      :class="{ 'border-b border-zinc-800 md:border-b-2': $slots.mainBanner }"
    >
      <!-- test -->
      <!-- for index page -->
      <slot name="mainBanner" />

      <!-- for pages other than index page -->
      <div v-if="$slots.banner" class="flex items-center gap-6 pl-5">
        <div class="flex h-min w-min items-center">
          <NuxtLink @click="router.back()">
            <IconsBadge size="small" class="text-white">
              <IconsBack></IconsBack>
            </IconsBadge>
          </NuxtLink>
        </div>
        <!-- header -->
        <div class="flex h-full items-center pl-1">
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
    >
      <div
        class="h-max w-full pb-32 pt-14 md:w-5/6 md:pb-14 xl:w-5/8 2xl:w-3/5"
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
