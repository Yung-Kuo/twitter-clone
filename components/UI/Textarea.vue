<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  freeze: {
    type: Boolean,
    default: false,
  },
  forProfile: {
    type: Boolean,
    default: false,
  },
});
const text = defineModel();
</script>
<template>
  <div
    class="grid h-full w-full grow grid-cols-1 grid-rows-1 px-2 text-xl"
    :class="props.forProfile ? 'py-1' : 'py-2'"
  >
    <textarea
      v-model="text"
      :placeholder="props.placeholder"
      rows="1"
      class="col-start-1 row-start-1 resize-none rounded-xl bg-black text-zinc-200 placeholder:text-zinc-500 focus:outline focus:outline-transparent"
    ></textarea>
    <pre class="invisible col-start-1 row-start-1 whitespace-pre-wrap"
      >{{ props.freeze ? "" : text }} </pre
    >
  </div>
</template>
