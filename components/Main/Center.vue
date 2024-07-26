<script setup>
const router = useRouter();
const handleWheelEvent = inject("handleWheelEvent");
const getRect = inject("getRect", () => null);
const menuGetRect = inject("menuGetRect", () => null);
</script>
<template>
  <div
    class="relative w-5/6 border-r-2 border-zinc-800 md:w-4/6 md:border-0 xl:w-1/2 2xl:w-2/5"
  >
    <!-- top banner -->
    <div
      id="banner"
      class="absolute left-0 top-0 z-20 flex h-14 w-full bg-transparent backdrop-blur-md"
      :class="{ 'border-b border-zinc-800': $slots.mainBanner }"
    >
      <!-- for index page -->
      <slot name="mainBanner" />

      <!-- for pages other than index page -->
      <div v-if="$slots.banner" class="flex">
        <div class="flex h-full w-10 items-center px-2">
          <NuxtLink @click="router.back()">
            <IconsBadge size="small" class="text-white">
              <IconsBack></IconsBack>
            </IconsBadge>
          </NuxtLink>
        </div>
        <!-- spacing -->
        <div class="w-6"></div>
        <!-- header -->
        <div class="flex h-full items-center pl-1">
          <slot name="banner" />
        </div>
      </div>
    </div>
    <!-- main section -->
    <div
      id="center"
      class="scrollbar h-full w-full overflow-y-scroll pt-14"
      @wheel="
        handleWheelEvent($event, 'center');
        getRect();
        menuGetRect();
      "
    >
      <slot name="main" />
    </div>
  </div>
</template>

<style>
#center::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
