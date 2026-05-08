export default function () {
  const scrollChrome = reactive({
    bottomMuted: false,
    bannerLift: null,
  });
  provide("scrollChrome", scrollChrome);

  const mainPageShifted = ref(false);
  provide("mainPageShifted", mainPageShifted);

  const layoutRefs = {
    center: shallowRef(null),
    right: shallowRef(null),
    bottom: shallowRef(null),
    banner: shallowRef(null),
  };
  provide("layoutRefs", layoutRefs);

  const { alertMode, alertMessage, hasError } = useAlert();
  provide("useAlert", { alertMode, alertMessage, hasError });

  const { handleWheelEvent } = useWheelSync(layoutRefs);
  provide("handleWheelEvent", handleWheelEvent);

  const { handleScroll } = useScroll(layoutRefs, scrollChrome);
  provide("handleScroll", handleScroll);

  const {
    profileCardVis,
    hoveredUserId,
    getRect,
    showProfileCard,
    hideProfileCard,
    bindProfileCard,
    profileCardStyle,
  } = useProfileCard(layoutRefs);
  provide("useProfileCard", {
    profileCardVis,
    hoveredUserId,
    getRect,
    showProfileCard,
    hideProfileCard,
    bindProfileCard,
    profileCardStyle,
  });
  provide("profileCard", { showProfileCard, hideProfileCard });
  provide("getRect", getRect);
  provide("profileCardStyle", profileCardStyle);
  provide("bindProfileCard", bindProfileCard);
  provide("profileCardVis", { profileCardVis, hoveredUserId });

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
  provide("bindMenuElement", bindMenuElement);
  provide("handleClickOutside", handleClickOutside);
  provide("menuPlacementClass", menuPlacementClass);
  provide("accountMenuStyle", accountMenuStyle);
  provide("toggleMenu", toggleMenu);
  provide("menuGetRect", menuGetRect);
  provide("togglePostMenu", { showMenu, menu_pid, type, toggleMenu });
  provide("toggleAccountMenu", {
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
  provide("writePost", {
    showPopupPost,
    newPost,
    repost_pid,
    publishPost,
    publishRepost,
    publishQuote,
  });
  provide("showPopupPost", showPopupPost);
  provide("repost_pid", repost_pid);

  const { showPopupReply, pid, clickReply, publishReply } = useReply();
  provide("clickReply", clickReply);
  provide("popupReply", { pid, publishReply });

  const { showPopupEdit, editPost, newText, selectEditPost, publishEdit } =
    useEdit();
  provide("useEdit", {
    showPopupEdit,
    editPost,
    newText,
    selectEditPost,
    publishEdit,
  });
  provide("selectEditPost", selectEditPost);

  const { target_post, clickPost, hoverPost } = useClickPost();
  provide("clickPost", { target_post, clickPost, hoverPost });

  provide("useCollection", {
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
