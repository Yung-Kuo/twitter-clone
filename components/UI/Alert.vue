<script setup>
const props = defineProps(["mode", "message"]);
</script>

<template>
  <transition
    enter-from-class="-translate-y-40"
    enter-active-class="transition-all duration-200"
    leave-active-class="transition-all duration-200"
    leave-to-class="-translate-y-40"
    mode="ease-in"
  >
    <div
      v-if="props.message"
      :class="props.mode == 'error' ? 'bg-red-600' : 'bg-sky-500'"
      class="absolute left-1/2 top-10 z-30 flex -translate-x-1/2 items-center justify-center rounded-md bg-red-600 p-5 md:w-3/4 md:rounded-2xl lg:w-2/5"
    >
      <span class="text-center text-4xl font-bold text-gray-200">{{
        props.message
      }}</span>
    </div>
  </transition>
</template>
