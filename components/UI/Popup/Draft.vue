<script setup>
const emit = defineEmits(["close"]);
</script>
<template>
  <div
    class="absolute left-0 top-0 z-50 flex h-full w-full flex-col gap-3 overflow-y-scroll bg-black p-3 shadow-3xl shadow-zinc-800 md:left-1/2 md:top-16 md:h-min md:max-h-[80%] md:w-3/5 md:-translate-x-1/2 md:rounded-2xl lg:w-1/2 2xl:w-2/5"
  >
    <!-- top row -->
    <div class="flex h-min w-full items-center justify-between">
      <!-- close popup -->
      <IconsBadge size="small" @click="emit('close')">
        <IconsClose class="text-zinc-200" />
      </IconsBadge>
      <div class="pr-4">
        <span class="text-sm font-bold text-sky-500">Drafts</span>
      </div>
    </div>
    <!-- center -->
    <div class="flex w-full grow flex-col overflow-y-scroll md:px-2">
      <slot name="center" />
    </div>

    <!-- action buttons -->
    <div class="flex h-min w-full flex-col gap-3">
      <slot name="button" />
    </div>
  </div>
</template>
