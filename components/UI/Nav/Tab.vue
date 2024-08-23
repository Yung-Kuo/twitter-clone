<script setup>
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div
    class="flex h-full w-full min-w-[6rem] justify-center pt-1 transition-all md:hover:bg-zinc-800 md:hover:bg-opacity-50"
  >
    <div
      class="flex items-center justify-center border-b-4 transition-all"
      :class="
        props.isActive
          ? ' border-sky-500 font-bold text-zinc-200'
          : ' border-transparent text-zinc-500'
      "
    >
      <span>
        <slot />
      </span>
    </div>
  </div>
</template>
