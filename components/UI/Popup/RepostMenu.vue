<script setup>
import { usePostStore } from "~/stores/post";
const postStore = usePostStore();
const user = useSupabaseUser();
const props = defineProps(["pid"]);
const emit = defineEmits(["quote"]);

const toggleMenu = inject("toggleMenu");

// repost
const repost_pid = inject("repost_pid");

const repost = {
  name: "Repost",
  function: () => {
    emit("repost");
    toggleMenu(props.pid, null, "repost");
  },
};
const quote = {
  name: "Quote",
  function: () => {
    emit("quote");
    toggleMenu(props.pid, null, "repost");
  },
};
const viewQuotes = {
  name: "View Quotes",
  function: () => {
    toggleMenu(props.pid, null, "repost");
  },
};
const actionList = ref("");
onMounted(() => {
  repost_pid.value = props.pid;
  actionList.value = [repost, quote, viewQuotes];
});
</script>
<template>
  <div
    class="absolute z-10 flex h-max w-40 flex-col rounded-xl bg-black text-zinc-200 shadow-3xl shadow-zinc-700"
  >
    <ul>
      <li v-for="action in actionList">
        <div
          @mousedown="action.function"
          class="flex h-10 w-full cursor-pointer items-center px-5 first:rounded-t-xl last:rounded-b-xl hover:bg-zinc-800 hover:bg-opacity-30 active:bg-opacity-40"
        >
          {{ action.name }}
        </div>
      </li>
    </ul>
  </div>
</template>
