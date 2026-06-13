<template>
  <Transition
    enter-active-class="transition-transform transition-opacity ease-in"
    enter-from-class="-translate-x-full opacity-0"
    enter-to-class=""
    leave-active-class="transition-transform transition-opacity ease-out"
    leave-from-class=""
    leave-to-class="-translate-x-full opacity-0"
  >
    <slot />
  </Transition>
</template>
