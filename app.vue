<script setup>
useMainComposables();
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
html {
  background-color: black;
}
pre {
  /* white-space: break-spaces; */
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-all;
  /* word-break: break-word; */
}
</style>
