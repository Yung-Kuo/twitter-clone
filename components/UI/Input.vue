<script setup>
const props = defineProps([
  "id",
  "type",
  "flag",
  "inputOverwrite",
  "firstEdit",
]);
const { id, type, flag } = toRefs(props);
const text = defineModel("text");
// const flag = defineModel('flag');
const emit = defineEmits(["update:text", "edited", "updateValid"]);

onMounted(() => {
  if (text.value) {
    inputFocusFlag.value = true;
  } else {
    inputFocusFlag.value = false;
  }
});

// input invalid class
const inputValidClass = [
  "border-zinc-600",
  "focus-within:border-sky-500",
  "focus-within:ring-1",
  "focus-within:ring-sky-500",
];
const inputInvalidClass = ["border-orange-400", "ring-1", "ring-orange-400"];
const inputValidFlag = ref(true);
watch(text, (curVal) => {
  // unvalid
  if (!curVal) inputValidFlag.value = false;
  // focus
  if (curVal) inputFocusFlag.value = true;

  if (type.value == "email") {
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(curVal)) {
      inputValidFlag.value = false;
    } else {
      inputValidFlag.value = true;
    }
  } else if (type.value == "password") {
    if (!curVal || curVal.length < 4) {
      inputValidFlag.value = false;
    } else {
      inputValidFlag.value = true;
    }
  } else if (type.value == "text") {
    if (!curVal || curVal.length < 2) {
      inputValidFlag.value = false;
    } else {
      inputValidFlag.value = true;
    }
  }
  emit("updateValid", inputValidFlag.value);
});

watch(flag, (curVal) => {
  inputValidFlag.value = curVal;
});

function stopInputOverwrite() {
  emit("edited");
}

// input focusin/focusout class
// ["text-xl", "sm:text-2xl", "pt-1"]
const inputFocusInClass = "text-xl md:text-2xl pt-1";
const inputFocusOutClass = ["text-2xl", "md:text-3xl", "pt-4", "md:pt-5"];

const inputFocusFlag = ref(false);
const inputEl = ref(null);

function inputFocusIn() {
  inputEl.value?.focus?.();
  inputFocusFlag.value = true;
}
function inputFocusOut() {
  if (text.value) {
    inputFocusFlag.value = true;
  } else {
    inputFocusFlag.value = false;
  }
}
</script>

<template>
  <div
    tabindex="0"
    class="grid h-16 w-full grid-cols-1 grid-rows-1 overflow-hidden rounded-md border-2 transition-all md:h-20"
    :class="inputValidFlag ? inputValidClass : inputInvalidClass"
    @focusin="inputFocusIn"
    @focusout="inputFocusOut"
  >
    <div
      class="z-10 col-start-1 row-start-1 h-full w-max px-2 text-zinc-500 transition-all"
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

/* input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-animation: autofill 0s forwards;
  animation: autofill 0s forwards;
}
@keyframes autofill {
  100% {
    background: transparent !important;
    color: inherit;
  }
}

@-webkit-keyframes autofill {
  100% {
    background: transparent !important;
    color: inherit;
  }
} */
</style>
