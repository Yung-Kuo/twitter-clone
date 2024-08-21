<script setup>
const router = useRouter();
const handleWheelEvent = inject("handleWheelEvent");
const getRect = inject("getRect", () => null);
const menuGetRect = inject("menuGetRect", () => null);
</script>
<template>
  <div class="relative h-full w-full overflow-y-hidden md:w-5/6">
    <!-- top banner -->
    <div
      id="banner"
      class="absolute left-0 top-0 z-20 flex h-14 w-full bg-transparent backdrop-blur-md transition-all md:w-5/6 xl:w-5/8 2xl:w-3/5"
      :class="{ 'border-b border-zinc-800 md:border-b-2': $slots.mainBanner }"
    >
      <!-- test -->
      <!-- for index page -->
      <slot name="mainBanner" />

      <!-- for pages other than index page -->
      <div v-if="$slots.banner" class="flex gap-6 pl-5">
        <div class="flex h-full w-min items-center">
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
      @wheel="
        handleWheelEvent($event, 'center');
        getRect();
        menuGetRect();
      "
    >
      <div class="h-max w-full py-14 md:w-5/6 xl:w-5/8 2xl:w-3/5">
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
