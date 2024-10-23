<template>
  <div class="group cursor-pointer rounded-md">
    <div
      class="grid h-full w-full grid-cols-1 grid-rows-1 overflow-visible rounded-2xl transition-all md:group-hover:-translate-y-2 md:group-active:group-hover:-translate-y-1"
    >
      <!-- surface -->
      <div
        class="z-20 col-start-1 row-start-1 flex h-full w-full items-center justify-center gap-3 rounded-md bg-zinc-200 text-xl text-black transition-all md:h-[calc(100%-0.875em)] md:w-[calc(100%-0.375em)] md:translate-x-[0.05em] md:translate-y-[0.05em] md:bg-opacity-60 md:pl-0 md:group-hover:bg-zinc-100 md:group-hover:opacity-100"
      >
        <slot />
      </div>
      <!-- corner & edge slope -->
      <div
        class="z-10 col-start-1 row-start-1 hidden h-[calc(100%-0.75em)] w-[calc(100%-0.25em)] rounded-md bg-zinc-300 bg-opacity-60 transition-all md:flex md:group-hover:bg-opacity-80"
      ></div>
      <!-- side -->
      <div
        class="col-start-1 row-start-1 hidden h-full w-full bg-zinc-500 transition-all md:flex md:rounded-[0.375em_0.65em_0.375em_0.75em/0.375em_1.125em_0.375em_1.125em] md:group-hover:bg-zinc-400 md:group-hover:bg-opacity-90 md:group-hover:shadow-lg md:group-hover:shadow-zinc-300 md:group-active:group-hover:shadow-md md:group-active:group-hover:shadow-zinc-300"
      ></div>
    </div>
  </div>
</template>
