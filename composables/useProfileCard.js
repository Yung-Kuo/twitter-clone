export default function () {
  // profile card
  const profileCardVis = ref(false);
  const hoveredElement = ref(null);
  const hoveredUserId = ref(null);
  function getRect() {
    if (profileCardVis.value) {
      nextTick(() => {
        // center
        const center = document.getElementById("center");
        const centerRect = center.getBoundingClientRect();
        // profile card
        const card = document.getElementById("profileCard");
        const cardRect = card.getBoundingClientRect();
        // hovered element
        const element = document.getElementById(hoveredElement.value);
        const rect = element.getBoundingClientRect();

        // if there's room at the bottom
        if (rect.top + rect.height + cardRect.height + 16 < centerRect.height) {
          card.style.top = `${rect.top + rect.height + 16}px`;
          card.style.left = `${
            rect.left + rect.width / 2 - cardRect.width / 2
          }px`;
        } else {
          card.style.top = `${rect.top - cardRect.height - 20}px`;
          card.style.left = `${
            rect.left + rect.width / 2 - cardRect.width / 2
          }px`;
        }
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
