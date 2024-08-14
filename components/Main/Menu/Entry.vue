<template>
  <div class="h-min text-xl text-zinc-200">
    <IconsBadge class="xl:hidden">
      <slot name="sm-menu" />
    </IconsBadge>
    <div
      class="hidden w-full items-center justify-start rounded-full pr-10 transition-all hover:bg-zinc-900 active:bg-zinc-800 xl:flex"
    >
      <IconsBadge size="large">
        <slot name="lg-menu" />
      </IconsBadge>
      <span>
        <slot name="title" />
      </span>
    </div>
  </div>
</template>
