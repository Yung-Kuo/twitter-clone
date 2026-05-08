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
const xsmall = "h-6 w-6 text-xl";
const small = "h-8 w-8 text-xl";
const smallPlus = "h-10 w-10 text-2xl";
const medium = "h-12 w-12 text-2xl";
const large = "h-14 w-14 text-2xl";
const sizeClass = ref(medium);
// color
const gray = "md:hover:bg-zinc-900 active:bg-zinc-800";
const colorClass = ref(gray);
const red =
  "md:hover:bg-opacity-10 md:hover:bg-pink-600 md:hover:text-pink-600 md:active:bg-opacity-20";
const red_clicked =
  "md:hover:bg-opacity-10 md:hover:bg-pink-600 text-pink-600 md:active:bg-opacity-20";
const green =
  "md:hover:bg-opacity-10 md:hover:bg-emerald-500 md:hover:text-emerald-500 md:active:bg-opacity-20";
const green_clicked =
  "md:hover:bg-opacity-10 md:hover:bg-emerald-500 text-emerald-500 md:active:bg-opacity-20";
const blue =
  "md:hover:bg-opacity-10 md:hover:bg-sky-500 md:hover:text-sky-500 md:active:bg-opacity-20";
const blue_clicked =
  "md:hover:bg-opacity-10 md:hover:bg-sky-500 text-sky-500 md:active:bg-opacity-20";
onMounted(() => {
  // size
  if (!props.size) sizeClass.value = medium;
  else if (props.size === "xsmall") sizeClass.value = xsmall;
  else if (props.size === "small") sizeClass.value = small;
  else if (props.size === "smallPlus") sizeClass.value = smallPlus;
  else if (props.size === "medium") sizeClass.value = medium;
  else if (props.size === "large") sizeClass.value = large;
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
  if (props.noHover) colorClass.value = null;
  else if (props.color === "gray") {
    colorClass.value = gray;
  } else if (props.color === "red") {
    if (props.clicked) colorClass.value = red_clicked;
    else colorClass.value = red;
  } else if (props.color === "green") {
    if (props.clicked) colorClass.value = green_clicked;
    else colorClass.value = green;
  } else if (props.color === "blue") {
    if (props.clicked) colorClass.value = blue_clicked;
    else colorClass.value = blue;
  }
}
</script>
<template>
  <div
    class="flex cursor-pointer items-center justify-center rounded-full transition-all"
    :class="[sizeClass, colorClass]"
  >
    <slot />
  </div>
</template>
