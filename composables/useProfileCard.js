export default function () {
  // profile card
  const profileCardVis = ref(false);
  const hoveredElement = ref(null);
  const hoveredUserId = ref(null);
  function getRect() {
    if (profileCardVis.value) {
      nextTick(() => {
        // profile card
        const card = document.getElementById("profileCard");
        const cardRect = card.getBoundingClientRect();
        // hovered element
        const element = document.getElementById(hoveredElement.value);
        const rect = element.getBoundingClientRect();
        card.style.top = `${rect.top + rect.height}px`;
        card.style.left = `${
          rect.left + rect.width / 2 - cardRect.width / 2
        }px`;
      });
    }
  }
  function showProfileCard(el, uid) {
    if (el !== null) hoveredElement.value = el;
    if (el !== null) hoveredUserId.value = uid;
    profileCardVis.value = true;
    getRect();
  }
  function hideProfileCard() {
    profileCardVis.value = false;
  }

  return {
    profileCardVis,
    hoveredElement,
    hoveredUserId,
    getRect,
    showProfileCard,
    hideProfileCard,
  };
}
