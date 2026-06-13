import type { ComponentPublicInstance } from "vue";
import type { LayoutRefs } from "~/composables/injection-types";
import { positionFloatingElement } from "~/composables/useFloatingPosition";

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
    nextTick(async () => {
      const centerEl = layoutRefs.center.value;
      const card = profileCardEl.value;
      const anchor = hoveredAnchorEl.value;
      if (!centerEl || !card || !anchor) return;

      const centerRect = centerEl.getBoundingClientRect();
      const placement =
        anchor.getBoundingClientRect().bottom + card.offsetHeight + 16 <
        centerRect.height
          ? "bottom"
          : "top";

      profileCardStyle.value = await positionFloatingElement(
        anchor,
        card,
        placement,
        placement === "bottom" ? 16 : 20,
      );
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
