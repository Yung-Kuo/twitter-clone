export default function () {
  // collection of composables

  // error
  const { alertMode, alertMessage, errorTimeout, hasError } = useAlert();
  provide("useAlert", { alertMode, alertMessage, hasError });

  // wheel sync
  const { handleWheelEvent } = useWheelSync();
  provide("handleWheelEvent", handleWheelEvent);

  // scroll
  const { handleScroll } = useScroll();
  provide("handleScroll", handleScroll);

  // profile card
  const {
    profileCardVis,
    hoveredElement,
    hoveredUserId,
    getRect,
    showProfileCard,
    hideProfileCard,
  } = useProfileCard();
  provide("useProfileCard", {
    profileCardVis,
    hoveredElement,
    hoveredUserId,
    getRect,
    showProfileCard,
    hideProfileCard,
  });
  provide("profileCard", { showProfileCard, hideProfileCard });
  provide("getRect", getRect);
  provide("profileCardVis", { profileCardVis, hoveredUserId });

  // toggle menu
  const {
    showMenu,
    menu_pid,
    type,
    toggleMenu,
    handleClickOutside,
    menuGetRect,
  } = useToggleMenu();
  provide("handleClickOutside", handleClickOutside);
  provide("toggleMenu", toggleMenu);
  provide("menuGetRect", menuGetRect);
  provide("togglePostMenu", { showMenu, menu_pid, type, toggleMenu });
  provide("toggleAccountMenu", { showMenu, type, toggleMenu, menuGetRect });

  // write post & quote
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

  // reply
  const { showPopupReply, pid, clickReply, publishReply } = useReply();
  provide("clickReply", clickReply);
  provide("popupReply", { pid, publishReply });

  // edit
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

  // click post
  const { target_post, clickPost, hoverPost } = useClickPost();
  provide("clickPost", { target_post, clickPost, hoverPost });

  // for collection
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
