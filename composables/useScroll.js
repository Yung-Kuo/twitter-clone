export default function useScroll(layoutRefs, scrollChrome) {
  const route = useRoute();
  const previousScrollTop = ref(null);
  const scroll_record = ref(0);

  function handleScroll(event) {
    const centerEl = layoutRefs.center.value;
    const bottomEl = layoutRefs.bottom.value;
    const bannerEl = layoutRefs.banner.value;
    if (!centerEl || !bottomEl || !bannerEl) {
      return;
    }

    if (!previousScrollTop.value) {
      previousScrollTop.value = event.target.scrollTop;
    }

    const scrollDistance = event.target.scrollTop - previousScrollTop.value;
    scroll_record.value += scrollDistance;
    previousScrollTop.value = event.target.scrollTop;

    if (
      scroll_record.value > 50 &&
      isVisible(bottomEl) &&
      event.target.scrollTop > 0 &&
      event.target.scrollTop + window.innerHeight < centerEl.scrollHeight
    ) {
      previousScrollTop.value = null;
      scroll_record.value = 0;
      scrollChrome.bottomMuted = true;
      scrollChrome.bannerLift = route.path === "/" ? "home" : "other";
    } else if (scroll_record.value < -10 && isVisible(bottomEl)) {
      scroll_record.value = 0;
      scrollChrome.bottomMuted = false;
      scrollChrome.bannerLift = null;
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
