<script setup>
import { usePostStore } from "~/stores/post";
const postStore = usePostStore();
const route = useRoute();

const handleClickOutside = inject("handleClickOutside");
const showPopupPost = inject("showPopupPost");
const activeTab = ref("");
const postList = computed(() => {
  if (activeTab.value === "Quotes") {
    return postStore.getQuotes(route.params.id);
  } else if (activeTab.value === "Reposts") {
    return postStore.getReposts(route.params.id);
  } else return [];
});

onMounted(async () => {
  activeTab.value = "Quotes";
  await postStore.fetchQuotes(route.params.id);
  await postStore.fetchReposts(route.params.id);
});
</script>
<template>
  <div class="flex h-screen w-screen" @mousedown="handleClickOutside($event)">
    <!-- UI popup -->
    <UIPopupCollection />

    <!-- layout -->
    <MainLeft @popupPost="showPopupPost = true" />
    <MainBottom />
    <MainCenter>
      <template #title>Post engagements</template>
      <template #nav>
        <!-- Quotes -->
        <UINavTab
          :isActive="activeTab === 'Quotes'"
          @mousedown="activeTab = 'Quotes'"
          >Quotes</UINavTab
        >
        <!-- Reposts -->
        <UINavTab
          :isActive="activeTab === 'Reposts'"
          @mousedown="activeTab = 'Reposts'"
          >Reposts</UINavTab
        >
      </template>
      <template #main>
        <ul>
          <li v-for="post in postList" :key="post.id">
            <MainPost :post="post" />
          </li>
        </ul>
      </template>
    </MainCenter>
  </div>
</template>
