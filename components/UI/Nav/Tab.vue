<script setup>
const props = defineProps(["tabName", "activeTab"]);
const emit = defineEmits(["changeTab"]);
</script>
<template>
  <div
    @mousedown="emit('changeTab', props.tabName)"
    class="flex h-full w-full justify-center pt-2 transition-all hover:bg-zinc-800 hover:bg-opacity-50"
  >
    <div
      class="flex items-center justify-center border-b-4 transition-all"
      :class="
        props.activeTab === props.tabName
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
