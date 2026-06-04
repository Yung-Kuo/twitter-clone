<script setup>
import { useSearchKey } from "~/composables/keys";

const { showSearch, toggleSearch } = inject(useSearchKey);
</script>
<template>
  <UIPopupTransition>
    <div
      v-show="showSearch"
      class="absolute left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      @mousedown="toggleSearch()"
    >
      <div/>
    </div>
  </UIPopupTransition>
</template>
