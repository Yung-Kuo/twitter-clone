<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  mode: {
    type: String,
    default: null,
  },
  freeze: {
    type: Boolean,
    default: false,
  },
});
const text = defineModel();
</script>
<template>
  <div
    class="grid h-full w-full grow grid-cols-1 grid-rows-1"
    :class="props.mode === 'description' ? 'text-3xl' : 'text-xl'"
  >
    <textarea
      v-model="text"
      :placeholder="props.placeholder"
      rows="1"
      class="col-start-1 row-start-1 resize-none rounded-xl bg-black p-2 text-zinc-200 placeholder:text-zinc-500 focus:outline focus:outline-transparent"
    ></textarea>
    <pre class="invisible col-start-1 row-start-1 whitespace-pre-wrap p-2"
      >{{ props.freeze ? "" : text }} </pre
    >
  </div>
</template>
