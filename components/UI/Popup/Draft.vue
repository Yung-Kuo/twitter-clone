<script setup>
const emit = defineEmits(["close"]);
</script>
<template>
  <div
    class="absolute left-1/2 top-16 z-50 flex max-h-[80%] w-5/6 -translate-x-1/2 flex-col overflow-y-scroll rounded-2xl bg-black p-3 pb-4 shadow-3xl shadow-zinc-800 md:w-3/5 lg:w-1/2"
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
    <div class="flex grow flex-col overflow-y-auto px-2 pt-3">
      <slot name="center" />
    </div>

    <!-- action buttons -->
    <div class="h-min w-full pt-3">
      <slot name="button" />
    </div>
  </div>
</template>
