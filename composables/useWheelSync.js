export default function useWheelSync(layoutRefs) {
  function handleWheelEvent(event, scroll_at) {
    if (
      typeof event.target?.closest === "function" &&
      event.target.closest(".no-wheel-sync")
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
