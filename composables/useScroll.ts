import type { LayoutRefs, ScrollChrome } from "~/composables/injection-types";

export default function useScroll(
  layoutRefs: LayoutRefs,
  scrollChrome: ScrollChrome,
) {
  const route = useRoute();
  const previousScrollTop = ref<number | null>(null);
  const scroll_record = ref(0);

  function handleScroll(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const centerEl = layoutRefs.center.value;
    const bottomEl = layoutRefs.bottom.value;
    const bannerEl = layoutRefs.banner.value;
    if (!centerEl || !bottomEl || !bannerEl) {
      return;
    }

    if (previousScrollTop.value === null) {
      previousScrollTop.value = target.scrollTop;
    }

    const scrollDistance = target.scrollTop - previousScrollTop.value;
    scroll_record.value += scrollDistance;
    previousScrollTop.value = target.scrollTop;

    if (
      scroll_record.value > 50 &&
      isVisible(bottomEl) &&
      target.scrollTop > 0 &&
      target.scrollTop + window.innerHeight < centerEl.scrollHeight
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

  function isVisible(element: HTMLElement) {
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
