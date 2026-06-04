export default function useSearch() {
  const showSearch = ref(false);

  function toggleSearch() {
    showSearch.value = !showSearch.value;
  }

  return {
    showSearch,
    toggleSearch,
  };
}
