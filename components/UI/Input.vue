<script setup lang="ts">
type InputType = "email" | "password" | "text" | string;

const props = defineProps<{
  id?: string;
  type?: InputType;
  flag?: boolean;
  inputOverwrite?: boolean;
  firstEdit?: boolean;
}>();

const { id, type, flag } = toRefs(props);
const text = defineModel<string>("text");

const emit = defineEmits<{
  "update:text": [value: string];
  edited: [];
  updateValid: [valid: boolean];
}>();

onMounted(() => {
  inputFocusFlag.value = !!text.value;
});

const inputValidClass = [
  "border-zinc-600",
  "focus-within:border-sky-500",
  "focus-within:ring-1",
  "focus-within:ring-sky-500",
];
const inputInvalidClass = ["border-orange-400", "ring-1", "ring-orange-400"];
const inputValidFlag = ref(true);

watch(text, (curVal) => {
  if (!curVal) inputValidFlag.value = false;
  if (curVal) inputFocusFlag.value = true;

  if (type.value === "email") {
    inputValidFlag.value = !!(
      curVal && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(curVal)
    );
  } else if (type.value === "password") {
    inputValidFlag.value = !!(curVal && curVal.length >= 4);
  } else if (type.value === "text") {
    inputValidFlag.value = !!(curVal && curVal.length >= 2);
  }
  emit("updateValid", inputValidFlag.value);
});

watch(flag, (curVal) => {
  if (curVal !== undefined) inputValidFlag.value = curVal;
});

function stopInputOverwrite() {
  emit("edited");
}

const inputFocusInClass = "text-xl md:text-2xl pt-1";
const inputFocusOutClass = ["text-2xl", "md:text-3xl", "pt-4", "md:pt-5"];

const inputFocusFlag = ref(false);
const inputEl = ref<HTMLInputElement | null>(null);

function inputFocusIn() {
  inputEl.value?.focus?.();
  inputFocusFlag.value = true;
}

function inputFocusOut() {
  inputFocusFlag.value = !!text.value;
}
</script>

<template>
  <div
    tabindex="0"
    class="grid h-16 w-full grid-cols-1 grid-rows-1 overflow-hidden rounded-md border-2 transition-colors transition-shadow md:h-20"
    :class="inputValidFlag ? inputValidClass : inputInvalidClass"
    @focusin="inputFocusIn"
    @focusout="inputFocusOut"
  >
    <div
      class="z-10 col-start-1 row-start-1 h-full w-max px-2 text-zinc-500 transition-[font-size,padding-top,color]"
      :class="inputFocusFlag ? inputFocusInClass : inputFocusOutClass"
    >
      <span><slot /></span>
    </div>
    <div class="col-start-1 row-start-1 h-full w-full p-1 pt-8">
      <input
        :id="id"
        ref="inputEl"
        v-model="text"
        :type="type"
        class="h-full w-full rounded-sm !bg-transparent px-1 text-xl text-zinc-200 focus:outline focus:outline-transparent sm:text-2xl md:text-3xl"
        @keydown="stopInputOverwrite"
      >
    </div>
  </div>
</template>

<style scoped>
input:is(:-webkit-autofill, :autofill) {
  -webkit-box-shadow: 0 0 0 100px black inset;
  -webkit-text-fill-color: white;
  -webkit-text-fill-caret-color: white;
  caret-color: white;
}
</style>
