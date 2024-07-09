<script setup>
const props = defineProps(["modelValue", "placeholder", "mode"]);
const { modelValue, placeholder } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const textarea = ref(null);
onMounted(() => {
  if (props.mode === "edit") {
    nextTick();
    console.log("textarea: ", textarea.value);
    textarea.value.focus();
  }
});
</script>
<template>
  <div class="grid h-full w-full grid-cols-1 grid-rows-1">
    <textarea
      ref="textarea"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="1"
      class="col-start-1 row-start-1 resize-none overflow-hidden overflow-y-scroll bg-black p-2 text-xl text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
    ></textarea>
    <pre
      class="invisible col-start-1 row-start-1 whitespace-pre-wrap p-2 text-xl"
      >{{ modelValue }} </pre
    >
  </div>
</template>
