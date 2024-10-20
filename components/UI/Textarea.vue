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
const textarea = ref(null);
const text = defineModel();
const blank = ref("");
</script>
<template>
  <div
    tabindex="0"
    @focusin="textarea.focus()"
    class="grid w-full grow grid-cols-1 grid-rows-1 rounded-xl px-2"
    :class="props.forProfile ? 'py-1 text-3xl' : 'py-2 text-xl'"
  >
    <textarea
      ref="textarea"
      v-model="text"
      :placeholder="props.placeholder"
      rows="1"
      class="col-start-1 row-start-1 resize-none bg-black text-zinc-200 placeholder:text-zinc-500 focus:outline focus:outline-transparent"
    ></textarea>
    <pre class="invisible col-start-1 row-start-1 whitespace-pre-wrap"
      >{{ props.freeze ? "" : text }} </pre
    >
  </div>
</template>
