import type { LayoutRefs } from "~/composables/injection-types";

export default function useWheelSync(layoutRefs: LayoutRefs) {
  function handleWheelEvent(
    event: WheelEvent,
    scroll_at: "right" | "center",
  ) {
    const target = event.target;
    if (
      target instanceof Element &&
      typeof target.closest === "function" &&
      target.closest(".no-wheel-sync")
    ) {
      return;
    }

    const centerEl = layoutRefs.center.value;
    const rightEl = layoutRefs.right.value;
    if (scroll_at === "right" && centerEl) {
      centerEl.scrollTop += event.deltaY;
      event.stopPropagation();
    } else if (scroll_at === "center" && rightEl) {
      rightEl.scrollTop += event.deltaY;
    }
  }

  return { handleWheelEvent };
}
