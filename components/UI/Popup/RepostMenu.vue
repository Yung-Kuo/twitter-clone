<script setup>
import {
  bindMenuElementKey,
  menuPlacementClassKey,
  toggleMenuKey,
} from "~/composables/keys";

const props = defineProps({
  pid: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["quote", "repost"]);

const toggleMenu = inject(toggleMenuKey);
const bindMenuElement = inject(bindMenuElementKey);
const menuPlacementClass = inject(menuPlacementClassKey);

const repost = {
  name: "Repost",
  icons: resolveComponent("IconsRepost"),
  function: () => {
    emit("repost");
    toggleMenu(props.pid, "repost");
  },
};
const quote = {
  name: "Quote",
  icons: resolveComponent("IconsQuote"),
  function: () => {
    emit("quote");
    toggleMenu(props.pid, "repost");
  },
};
const viewQuotes = {
  name: "View Quotes",
  icons: resolveComponent("IconsViewQuotes"),
  function: () => {
    toggleMenu(props.pid, "repost");
    navigateTo(`/${props.username}/post/${props.pid}/engagement`);
  },
};
const actionList = ref("");
onMounted(() => {
  // repost_pid.value = props.pid;
  actionList.value = [repost, quote, viewQuotes];
});
</script>
<template>
  <div
    :ref="(el) => bindMenuElement(`${props.pid}_repost_menu`, el)"
    class="absolute z-10 flex h-min w-max flex-col rounded-xl bg-black text-zinc-200 shadow-3xl shadow-zinc-700 transition-all duration-200"
    :class="menuPlacementClass"
  >
    <ul>
      <li
        v-for="(action, idx) in actionList"
        :key="idx"
        class="flex h-12 w-full cursor-pointer items-center gap-4 pl-4 pr-6 first:rounded-t-xl first:pt-1 last:rounded-b-xl last:pb-1 hover:bg-zinc-800 hover:bg-opacity-30 active:bg-opacity-40"
        @mousedown="action.function"
      >
        <component :is="action.icons" class="text-xl" />
        <span>{{ action.name }}</span>
      </li>
    </ul>
  </div>
</template>
