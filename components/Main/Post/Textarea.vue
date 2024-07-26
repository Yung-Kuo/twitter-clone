<script setup>
const props = defineProps(["modelValue", "placeholder", "mode"]);
const { modelValue, placeholder } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const textarea = ref(null);
</script>
<template>
  <div class="grid h-full w-full grow grid-cols-1 grid-rows-1">
    <textarea
      ref="textarea"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="1"
      class="col-start-1 row-start-1 resize-none rounded-xl bg-black p-2 text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
      :class="props.mode === 'description' ? 'text-3xl' : 'text-xl'"
    ></textarea>
    <pre
      class="invisible col-start-1 row-start-1 whitespace-pre-wrap p-2"
      :class="props.mode === 'description' ? 'text-3xl' : 'text-xl'"
      >{{ modelValue }} </pre
    >
  </div>
</template>
