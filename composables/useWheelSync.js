export default function () {
  const center = ref(null);
  const right = ref(null);
  function handleWheelEvent(event, scroll_at) {
    // console.log("wheel event: ", event);
    const element = ref(null);
    element.value = event.target;
    while (element.value && element.value !== document.body) {
      // while scroll within textarea
      if (element.value?.classList.contains("no-wheel-sync")) return;
      element.value = element.value.parentElement;
    }
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

  return { handleWheelEvent };
}
