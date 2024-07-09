<script setup>
const props = defineProps([
  "modelValue",
  "id",
  "type",
  "flag",
  "inputOverwrite",
  "firstEdit",
]);
const { modelValue, id, type, flag, inputOverwrite, firstEdit } = toRefs(props);
const emit = defineEmits(["update:modelValue", "edited", "updateValid"]);

// input invalid class
const inputValidClass = [
  "border-gray-400",
  "focus-within:border-sky-500",
  "focus-within:ring-1",
  "focus-within:ring-sky-500",
];
const inputInvalidClass = ["border-orange-400", "ring-1", "ring-orange-400"];
const inputValidFlag = ref(true);
watch(modelValue, (curVal) => {
  // unvalid
  if (!curVal) inputValidFlag.value = false;
  // focus
  if (curVal) inputFocusFlag.value = true;

  if (type.value == "email") {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(curVal)) {
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
  emit("update:modelValue", curVal);
  emit("updateValid", inputValidFlag.value);
});

watch(flag, (curVal) => {
  inputValidFlag.value = curVal;
});

function stopInputOverwrite() {
  emit("edited");
}

// input focusin/focusout class
const inputFocusInClass = ["text-xl", "sm:text-2xl", "pt-1"];
const inputFocusOutClass = ["text-2xl", "sm:text-3xl", "pt-4", "sm:pt-5"];

const inputFocusFlag = ref(false);
function inputFocusIn() {
  document.getElementById(id.value).focus();
  inputFocusFlag.value = true;
}
function inputFocusOut() {
  if (modelValue.value) {
    inputFocusFlag.value = true;
  } else {
    inputFocusFlag.value = false;
  }
}
</script>

<template>
  <div
    tabindex="0"
    @focusin="inputFocusIn"
    @focusout="inputFocusOut"
    class="mb-10 grid h-16 w-full grid-cols-1 grid-rows-1 overflow-hidden rounded-md border focus-within:outline-none sm:h-20"
    :class="inputValidFlag ? inputValidClass : inputInvalidClass"
  >
    <div
      class="z-10 col-start-1 row-start-1 h-full w-max px-2 text-gray-500 transition-all"
      :class="inputFocusFlag ? inputFocusInClass : inputFocusOutClass"
    >
      <span><slot /></span>
    </div>
    <div class="col-start-1 row-start-1 h-full w-full px-2 pt-6">
      <input
        :type="type"
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown="stopInputOverwrite"
        class="h-full w-full bg-black text-xl text-gray-200 focus:outline-none sm:text-2xl md:text-3xl"
      />
    </div>
  </div>
</template>

<style scoped>
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px black inset;
  -webkit-text-fill-color: white;
  -webkit-text-fill-caret-color: white;
  caret-color: white;
}
</style>
