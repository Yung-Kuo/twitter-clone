<template>
  <Transition
    enter-active-class="transition-all"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <slot />
  </Transition>
</template>
