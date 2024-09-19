export default function () {
  const showSearch = ref(false);

  function toggleSearch() {
    showSearch.value = !showSearch.value;
    console.log("toggle search", showSearch.value);
  }

  return {
    showSearch,
    toggleSearch,
  };
}
