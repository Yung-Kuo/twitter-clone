import type { ComponentPublicInstance } from "vue";
import type { LayoutRefs } from "~/composables/injection-types";

export default function useProfileCard(layoutRefs: LayoutRefs) {
  const profileCardVis = ref(false);
  const hoveredAnchorEl = shallowRef<HTMLElement | null>(null);
  const hoveredUserId = ref<string | null>(null);
  const profileCardEl = shallowRef<HTMLElement | null>(null);
  const profileCardStyle = ref<Record<string, string>>({});

  function bindProfileCard(
    instance: ComponentPublicInstance | HTMLElement | null,
  ) {
    if (!instance) {
      profileCardEl.value = null;
      return;
    }
    const el =
      instance instanceof HTMLElement ? instance : (instance.$el as unknown);
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

  function showProfileCard(el: HTMLElement | null, uid?: string | null) {
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
