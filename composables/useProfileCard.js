export default function useProfileCard(layoutRefs) {
  const profileCardVis = ref(false);
  const hoveredAnchorEl = shallowRef(null);
  const hoveredUserId = ref(null);
  const profileCardEl = shallowRef(null);
  const profileCardStyle = ref({});

  function bindProfileCard(instance) {
    if (!instance) {
      profileCardEl.value = null;
      return;
    }
    const el = instance.$el ?? instance;
    profileCardEl.value = el instanceof HTMLElement ? el : null;
  }

  function getRect() {
    if (!profileCardVis.value) return;
    nextTick(() => {
      const centerEl = layoutRefs.center.value;
      const card = profileCardEl.value;
      const anchor = hoveredAnchorEl.value;
      if (!centerEl || !card || !anchor) return;

      const centerRect = centerEl.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const rect = anchor.getBoundingClientRect();

      if (rect.top + rect.height + cardRect.height + 16 < centerRect.height) {
        profileCardStyle.value = {
          top: `${rect.top + rect.height + 16}px`,
          left: `${rect.left + rect.width / 2 - cardRect.width / 2}px`,
        };
      } else {
        profileCardStyle.value = {
          top: `${rect.top - cardRect.height - 20}px`,
          left: `${rect.left + rect.width / 2 - cardRect.width / 2}px`,
        };
      }
    });
  }

  function showProfileCard(el, uid) {
    if (el) hoveredAnchorEl.value = el;
    if (uid !== undefined && uid !== null) hoveredUserId.value = uid;
    profileCardVis.value = true;
    getRect();
  }

  function hideProfileCard() {
    profileCardVis.value = false;
    hoveredAnchorEl.value = null;
    profileCardStyle.value = {};
  }

  return {
    profileCardVis,
    hoveredAnchorEl,
    hoveredUserId,
    getRect,
    showProfileCard,
    hideProfileCard,
    bindProfileCard,
    profileCardStyle,
  };
}
