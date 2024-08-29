export default function () {
  const center = ref(null);
  const right = ref(null);
  const bottom = ref(null);
  const banner = ref(null);
  const previousScrollTop = ref(null);
  const scroll_record = ref(0);
  function handleScroll(event) {
    // bottom opacity
    // hide & show top banner
    center.value = document.getElementById("center");
    bottom.value = document.getElementById("bottom");
    banner.value = document.getElementById("banner");
    if (!previousScrollTop.value) {
      previousScrollTop.value = event.target.scrollTop;
    }
    // console.log("scrollTop:", event.target.scrollTop);

    // Calculate the scroll distance
    const scrollDistance = event.target.scrollTop - previousScrollTop.value;
    // Update the scroll record
    scroll_record.value += scrollDistance;
    previousScrollTop.value = event.target.scrollTop;

    // console.log("scrollTop + innerHeight:", event.target.scrollTop + window.innerHeight);
    // console.log("scrollHeight:", center.value.scrollHeight);
    if (
      scroll_record.value > 10 &&
      isVisible(bottom.value) &&
      event.target.scrollTop > 0 &&
      event.target.scrollTop + window.innerHeight < center.value.scrollHeight
    ) {
      previousScrollTop.value = null;
      scroll_record.value = 0;
      bottom.value.classList.remove("backdrop-blur-md");
      bottom.value.classList.add("backdrop-blur-0", "opacity-50");
      banner.value.classList.add("-translate-y-14");
    } else if (scroll_record.value < -10 && isVisible(bottom.value)) {
      scroll_record.value = 0;
      bottom.value.classList.remove("backdrop-blur-0", "opacity-50");
      bottom.value.classList.add("backdrop-blur-md");
      banner.value.classList.remove("-translate-y-14");
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
    handleScroll,
  };
}
