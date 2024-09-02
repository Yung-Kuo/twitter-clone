<template>
  <div class="h-min cursor-pointer text-xl text-zinc-200">
    <!-- for small screen -->
    <div
      v-if="$slots.smMenu"
      class="flex w-min items-center justify-start rounded-full pr-10 transition-all md:hidden"
    >
      <IconsBadge size="large">
        <slot name="smMenu" />
      </IconsBadge>
      <span>
        <slot name="title" />
      </span>
    </div>
    <!-- for medium screen -->
    <div v-if="$slots.mdMenu">
      <IconsBadge class="xl:hidden">
        <slot name="mdMenu" />
      </IconsBadge>
    </div>
    <!-- for large screen -->
    <div
      v-if="$slots.lgMenu"
      class="hidden w-full items-center justify-start rounded-full pr-10 transition-all hover:bg-zinc-900 active:bg-zinc-800 xl:flex"
    >
      <IconsBadge size="large">
        <slot name="lgMenu" />
      </IconsBadge>
      <span>
        <slot name="title" />
      </span>
    </div>
  </div>
</template>
