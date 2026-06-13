<script setup lang="ts">
type ButtonColor = "blue" | "orange" | "white";

const props = withDefaults(
  defineProps<{
    color?: ButtonColor;
    solid?: boolean;
    active?: boolean;
    turnRed?: boolean;
  }>(),
  {
    color: "blue",
    solid: false,
    active: true,
    turnRed: false,
  },
);

const button_style = ref("");
const blue_solid =
  "px-5 py-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 font-semibold";
const blue_hollow =
  "px-5 py-2 rounded-full border-2 border-sky-500 text-sky-500 hover:border-sky-400 hover:font-bold hover:text-sky-400 hover:ring-2 hover:ring-sky-400 active:bg-sky-400 active:text-black";
const orange_solid =
  "w-full h-12 md:h-14 rounded-md bg-orange-400 font-bold text-xl hover:bg-orange-500 active:bg-orange-600";
const orange_hollow =
  "w-full h-12 md:h-14 rounded-md border-2 border-orange-400 text-xl text-orange-400 hover:border-orange-500 hover:ring-2 hover:ring-orange-500 hover:text-orange-500 active:bg-orange-500 active:text-black active:font-bold";
const white_solid =
  "px-4 py-1 rounded-full bg-gray-200 font-medium text-black hover:bg-gray-300 active:bg-gray-400";
const white_hollow =
  "px-4 py-1 rounded-full border border-zinc-600 font-medium text-zinc-200 hover:bg-zinc-800 hover:border-zinc-300 hover:text-zinc-300 active:bg-zinc-700";
const white_hollow_red =
  "px-4 py-1 rounded-full border border-zinc-600 font-medium text-zinc-200 hover:bg-opacity-10 hover:bg-red-600 hover:border-red-800 hover:text-red-600 active:bg-opacity-20";

watchEffect(() => {
  if (props.color === "blue") {
    button_style.value = props.solid ? blue_solid : blue_hollow;
  } else if (props.color === "orange") {
    button_style.value = props.solid ? orange_solid : orange_hollow;
  } else if (props.color === "white") {
    if (props.solid) {
      button_style.value = white_solid;
    } else if (props.turnRed) {
      button_style.value = white_hollow_red;
    } else {
      button_style.value = white_hollow;
    }
  }
});
</script>

<template>
  <button
    class="flex items-center justify-center whitespace-nowrap transition-colors transition-shadow"
    :class="{ [button_style]: true, grayscale: !props.active }"
  >
    <span>
      <slot />
    </span>
  </button>
</template>
