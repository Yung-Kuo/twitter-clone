<script setup lang="ts">
defineProps<{
  open: boolean;
}>();

defineEmits<{
  close: [];
}>();
</script>

<template>
  <UIPopupTransition>
    <UIPopupBackdrop v-show="open" @mousedown="$emit('close')" />
  </UIPopupTransition>
  <UIPopupTransition>
    <slot v-if="open" />
  </UIPopupTransition>
</template>
