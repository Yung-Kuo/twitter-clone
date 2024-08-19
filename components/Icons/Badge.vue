<script setup>
const props = defineProps({
  size: {
    type: String,
    default: "medium",
  },
  color: {
    type: String,
    default: "gray",
  },
  clicked: {
    type: Boolean,
    default: false,
  },
  noHover: {
    type: Boolean,
    default: false,
  },
});
// size
const xsmall = "h-6 w-6 text-lg";
const small = "h-8 w-8 text-xl";
const smallPlus = "h-10 w-10 text-2xl";
const medium = "h-12 w-12 text-2xl";
const large = "h-14 w-14 text-2xl";
const size = ref(medium);
// color
const color = ref(gray);
const gray = "hover:bg-zinc-900 active:bg-zinc-800";
const red =
  "hover:bg-opacity-10 hover:bg-pink-600 hover:text-pink-600 active:bg-opacity-20";
const red_clicked =
  "hover:bg-opacity-10 hover:bg-pink-600 text-pink-600 active:bg-opacity-20";
const green =
  "hover:bg-opacity-10 hover:bg-emerald-500 hover:text-emerald-500 active:bg-opacity-20";
const green_clicked =
  "hover:bg-opacity-10 hover:bg-emerald-500 text-emerald-500 active:bg-opacity-20";
const blue =
  "hover:bg-opacity-10 hover:bg-sky-500 hover:text-sky-500 active:bg-opacity-20";
const blue_clicked =
  "hover:bg-opacity-10 hover:bg-sky-500 text-sky-500 active:bg-opacity-20";
onMounted(() => {
  // size
  if (!props.size) size.value = medium;
  else if (props.size === "xsmall") size.value = xsmall;
  else if (props.size === "small") size.value = small;
  else if (props.size === "smallPlus") size.value = smallPlus;
  else if (props.size === "medium") size.value = medium;
  else if (props.size === "large") size.value = large;
  // color
  changeColor();
});
watch(
  () => props.clicked,
  () => changeColor()
);
watch(
  () => props.color,
  () => changeColor()
);
function changeColor() {
  if (props.color === "gray") {
    if (props.noHover) color.value = "";
    else color.value = gray;
  } else if (props.color === "red") {
    if (props.clicked) color.value = red_clicked;
    else color.value = red;
  } else if (props.color === "green") {
    if (props.clicked) color.value = green_clicked;
    else color.value = green;
  } else if (props.color === "blue") {
    if (props.clicked) color.value = blue_clicked;
    else color.value = blue;
  }
}
</script>
<template>
  <div
    class="flex cursor-pointer items-center justify-center rounded-full transition-all"
    :class="[size, color]"
  >
    <slot />
  </div>
</template>
