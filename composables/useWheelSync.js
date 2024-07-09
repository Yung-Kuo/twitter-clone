export default function () {
  const center = ref(null);
  const right = ref(null);
  function handleWheelEvent(event, scroll_at) {
    // panel scroll
    center.value = document.getElementById("center");
    right.value = document.getElementById("right");
    // even after right panel has reached the bottom
    // center panel can still be scrolled
    if (scroll_at === "right" && center.value) {
      center.value.scrollTop += event.deltaY;
    } else if (scroll_at === "center" && right.value) {
      right.value.scrollTop += event.deltaY;
    }
  }

  return { center, right, handleWheelEvent };
}
