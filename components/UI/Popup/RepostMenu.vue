<script setup>
import { usePostStore } from "~/stores/post";
const postStore = usePostStore();
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
const emit = defineEmits(["quote"]);
const route = useRoute();

const toggleMenu = inject("toggleMenu");

// repost
const repost_pid = inject("repost_pid");

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
    class="absolute z-10 flex h-min w-max flex-col rounded-xl bg-black text-zinc-200 shadow-3xl shadow-zinc-700 transition-all duration-200"
  >
    <ul>
      <li
        v-for="action in actionList"
        @mousedown="action.function"
        class="flex h-12 w-full cursor-pointer items-center gap-4 pl-4 pr-6 first:rounded-t-xl first:pt-1 last:rounded-b-xl last:pb-1 hover:bg-zinc-800 hover:bg-opacity-30 active:bg-opacity-40"
      >
        <component :is="action.icons" class="text-xl" />
        <span>{{ action.name }}</span>
      </li>
    </ul>
  </div>
</template>
