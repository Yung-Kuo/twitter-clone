<script setup>
const handleWheelEvent = inject("handleWheelEvent");
const getRect = inject("getRect");

const search = ref("");
const clicked = ref(false);
function focusinSearchBar() {
  document.querySelector("#search_bar").focus();
  clicked.value = true;
}
function focusoutSearchBar() {
  clicked.value = false;
}
</script>
<template>
  <div
    id="right"
    class="invisible h-full w-0 overflow-y-scroll border-l-2 border-zinc-800 md:visible md:w-1/6 md:p-5 xl:w-3/10"
    @wheel="
      handleWheelEvent($event, 'right');
      getRect();
    "
  >
    <div class="invisible w-0 xl:visible xl:w-full 2xl:w-4/5">
      <!-- search bar -->
      <div
        tabindex="0"
        @focusin="focusinSearchBar()"
        @focusout="focusoutSearchBar()"
        class="flex h-12 w-full items-center gap-3 rounded-full border border-zinc-800 bg-zinc-800 px-3 text-zinc-500 focus-within:border-sky-500 focus-within:bg-black"
      >
        <div class="flex-none">
          <IconsBadge size="xsmall" :noHover="true">
            <IconsSearch :class="{ 'text-sky-500': clicked }"></IconsSearch>
          </IconsBadge>
        </div>
        <div class="grow">
          <input
            id="search_bar"
            class="w-full bg-transparent text-lg text-zinc-200 outline-none placeholder:text-zinc-400"
            placeholder="Search"
            v-model="search"
          />
        </div>

        <!-- empty search query -->
        <div
          v-show="search && clicked"
          @click="search = ''"
          class="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-sky-500 text-black"
        >
          <IconsClose />
        </div>
      </div>
      <div class="h-5 w-full"></div>
      <div class="h-36 w-full rounded-2xl border-2 border-zinc-800"></div>
      <div class="h-5 w-full"></div>
      <div class="h-80 w-full rounded-2xl border-2 border-zinc-800"></div>
      <div class="h-5 w-full"></div>
      <div class="h-80 w-full rounded-2xl border-2 border-zinc-800"></div>
    </div>
  </div>
</template>

<style>
#right::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
