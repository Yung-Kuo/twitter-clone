<script setup>
import { useCurrentProfileQueryWithStore } from "~/queries/hooks/useCurrentProfileQuery";

useCurrentProfileQueryWithStore();
</script>

<template>
  <div>
    <slot />
  </div>
</template>
<style>
/*  google font
Ubuntu
Varela
Open Sans
*/
body {
  font-family: "Ubuntu";
  /* touch-action: none; */
  overflow: hidden;
}
pre {
  font-family: "Open Sans";
}
</style>
