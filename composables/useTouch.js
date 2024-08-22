export default function () {
  const center = ref(null);
  const bottom = ref(null);
  const banner = ref(null);
  const scroll_record = ref(0);
  function handleTouchStart(event) {
    // bottom opacity
    // hide & show top banner
    bottom.value = document.getElementById("bottom");
    banner.value = document.getElementById("banner");
    scroll_record.value += event.touches[0].clientY;
    if (scroll_record.value > 10 && isVisible(bottom.value)) {
      scroll_record.value = 0;
      bottom.value.classList.remove("backdrop-blur-md");
      bottom.value.classList.add("backdrop-blur-0", "opacity-50");
      banner.value.classList.add("-translate-y-14");
    } else if (scroll_record.value < -10 && isVisible(bottom.value)) {
      scroll_record.value = 0;
      bottom.value.classList.remove("backdrop-blur-0", "opacity-50");
      banner.value.classList.remove("-translate-y-14");
      bottom.value.classList.add("backdrop-blur-md");
    }
  }

  function isVisible(element) {
    return (
      element.offsetWidth > 0 &&
      element.offsetHeight > 0 &&
      element.getClientRects().length > 0
    );
  }

  return {
    handleTouchStart,
  };
}
