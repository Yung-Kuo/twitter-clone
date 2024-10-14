<template>
  <div class="group cursor-pointer">
    <div
      class="flex h-10 w-60 items-center gap-2 rounded-md bg-zinc-200 px-5 text-xl text-black transition-all group-hover:-translate-y-1 group-hover:bg-zinc-100 group-hover:shadow-lg group-hover:shadow-zinc-500 group-active:group-hover:translate-y-0 group-active:group-hover:shadow-md group-active:group-hover:shadow-zinc-500"
    >
      <slot />
    </div>
  </div>
</template>
