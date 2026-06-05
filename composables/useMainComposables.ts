import {
  accountMenuStyleKey,
  bindMenuElementKey,
  bindProfileCardKey,
  clickPostKey,
  clickReplyKey,
  getRectKey,
  handleClickOutsideKey,
  handleScrollKey,
  handleWheelEventKey,
  layoutRefsKey,
  mainPageShiftedKey,
  menuGetRectKey,
  menuPlacementClassKey,
  popupReplyKey,
  profileCardKey,
  profileCardStyleKey,
  profileCardVisKey,
  repostPidKey,
  scrollChromeKey,
  selectEditPostKey,
  showPopupPostKey,
  toggleAccountMenuKey,
  toggleMenuKey,
  togglePostMenuKey,
  useAlertKey,
  useCollectionKey,
  useEditKey,
  useProfileCardKey,
  writePostKey,
} from "~/composables/keys";
import { registerAlertBridge } from "~/composables/alertBridge";
import type { ScrollChrome } from "~/composables/injection-types";

export default function useMainComposables() {
  const scrollChrome = reactive<ScrollChrome>({
    bottomMuted: false,
    bannerLift: null,
  });
  provide(scrollChromeKey, scrollChrome);

  const mainPageShifted = ref(false);
  provide(mainPageShiftedKey, mainPageShifted);

  const layoutRefs = {
    center: shallowRef<HTMLElement | null>(null),
    right: shallowRef<HTMLElement | null>(null),
    bottom: shallowRef<HTMLElement | null>(null),
    banner: shallowRef<HTMLElement | null>(null),
  };
  provide(layoutRefsKey, layoutRefs);

  const alert = useAlert();
  registerAlertBridge(alert);
  provide(useAlertKey, alert);

  const { handleWheelEvent } = useWheelSync(layoutRefs);
  provide(handleWheelEventKey, handleWheelEvent);

  const { handleScroll } = useScroll(layoutRefs, scrollChrome);
  provide(handleScrollKey, handleScroll);

  const {
    profileCardVis,
    hoveredUserId,
    getRect,
    showProfileCard,
    hideProfileCard,
    bindProfileCard,
    profileCardStyle,
  } = useProfileCard(layoutRefs);

  provide(useProfileCardKey, {
    profileCardVis,
    hoveredUserId,
    getRect,
    showProfileCard,
    hideProfileCard,
    bindProfileCard,
    profileCardStyle,
  });
  provide(profileCardKey, { showProfileCard, hideProfileCard });
  provide(getRectKey, getRect);
  provide(profileCardStyleKey, profileCardStyle);
  provide(bindProfileCardKey, bindProfileCard);
  provide(profileCardVisKey, { profileCardVis, hoveredUserId });

  const {
    showMenu,
    menu_pid,
    type,
    toggleMenu,
    handleClickOutside,
    menuGetRect,
    bindMenuElement,
    menuPlacementClass,
    accountMenuStyle,
  } = useToggleMenu(layoutRefs);

  provide(bindMenuElementKey, bindMenuElement);
  provide(handleClickOutsideKey, handleClickOutside);
  provide(menuPlacementClassKey, menuPlacementClass);
  provide(accountMenuStyleKey, accountMenuStyle);
  provide(toggleMenuKey, toggleMenu);
  provide(menuGetRectKey, menuGetRect);
  provide(togglePostMenuKey, { showMenu, menu_pid, type, toggleMenu });
  provide(toggleAccountMenuKey, {
    showMenu,
    type,
    toggleMenu,
    menuGetRect,
  });

  const {
    showPopupPost,
    newPost,
    repost_pid,
    publishPost,
    publishRepost,
    publishQuote,
  } = useWritePost();

  provide(writePostKey, {
    showPopupPost,
    newPost,
    repost_pid,
    publishPost,
    publishRepost,
    publishQuote,
  });
  provide(showPopupPostKey, showPopupPost);
  provide(repostPidKey, repost_pid);

  const { showPopupReply, pid, clickReply, publishReply } = useReply();
  provide(clickReplyKey, clickReply);
  provide(popupReplyKey, { pid, publishReply });

  const { showPopupEdit, editPost, newText, selectEditPost, publishEdit } =
    useEdit();
  provide(useEditKey, {
    showPopupEdit,
    editPost,
    newText,
    selectEditPost,
    publishEdit,
  });
  provide(selectEditPostKey, selectEditPost);

  const { target_post, clickPost, hoverPost } = useClickPost();
  provide(clickPostKey, { target_post, clickPost, hoverPost });

  provide(useCollectionKey, {
    profileCardVis,
    hoveredUserId,
    showProfileCard,
    hideProfileCard,
    showPopupPost,
    newPost,
    repost_pid,
    showPopupReply,
    showPopupEdit,
    editPost,
  });
}
