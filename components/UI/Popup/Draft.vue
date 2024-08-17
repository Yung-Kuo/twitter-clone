<script setup>
const emit = defineEmits(["close"]);
</script>
<template>
  <div
    class="absolute left-1/2 top-16 z-50 flex max-h-[80%] w-5/6 -translate-x-1/2 flex-col overflow-y-scroll rounded-2xl bg-black p-2 shadow-3xl shadow-zinc-800 md:w-3/5 md:p-3 md:pb-4 lg:w-1/2 2xl:w-2/5"
  >
    <!-- top row -->
    <div class="flex h-min w-full items-center justify-between">
      <!-- close popup -->
      <div>
        <IconsBadge size="small" @click="emit('close')" class="hidden md:block">
          <IconsClose class="text-zinc-200" />
        </IconsBadge>
        <IconsBadge
          size="xsmall"
          @click="emit('close')"
          class="block md:hidden"
        >
          <IconsClose class="text-zinc-200" />
        </IconsBadge>
      </div>
      <div class="pr-4">
        <span class="text-sm font-bold text-sky-500">Drafts</span>
      </div>
    </div>
    <!-- center -->
    <div class="flex grow flex-col overflow-y-auto px-2 pt-2">
      <slot name="center" />
    </div>

    <!-- action buttons -->
    <div class="h-min w-full pt-3">
      <slot name="button" />
    </div>
  </div>
</template>
