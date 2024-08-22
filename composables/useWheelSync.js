export default function () {
  const center = ref(null);
  const right = ref(null);
  const bottom = ref(null);
  const banner = ref(null);
  const scroll_record = ref(0);
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

    // bottom opacity
    // hide & show top banner
    // bottom.value = document.getElementById("bottom");
    // banner.value = document.getElementById("banner");
    // scroll_record.value += event.deltaY;
    // if (scroll_record.value > 10 && isVisible(bottom.value)) {
    //   scroll_record.value = 0;
    //   bottom.value.classList.remove("backdrop-blur-md");
    //   bottom.value.classList.add("backdrop-blur-0", "opacity-50");
    //   banner.value.classList.add("-translate-y-14");
    // } else if (scroll_record.value < -10 && isVisible(bottom.value)) {
    //   scroll_record.value = 0;
    //   bottom.value.classList.remove("backdrop-blur-0", "opacity-50");
    //   banner.value.classList.remove("-translate-y-14");
    //   bottom.value.classList.add("backdrop-blur-md");
    // }
  }
  function isVisible(element) {
    return (
      element.offsetWidth > 0 &&
      element.offsetHeight > 0 &&
      element.getClientRects().length > 0
    );
  }

  return { handleWheelEvent };
}
