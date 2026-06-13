<script setup lang="ts">
/** Blocks post-row navigation (click.stop shield). */
</script>

<template>
  <div @click.stop @mousedown.stop>
    <slot />
  </div>
</template>
