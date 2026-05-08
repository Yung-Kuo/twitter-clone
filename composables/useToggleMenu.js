export default function useToggleMenu(layoutRefs) {
  const showMenu = ref(false);
  const menu_pid = ref("");
  const type = ref("");
  const menuElements = shallowReactive({});

  function bindMenuElement(domId, el) {
    if (!domId) return;
    if (el) menuElements[domId] = el;
    else delete menuElements[domId];
  }

  const icon_id = computed(() => {
    if (type.value === "account") return "account_menu_icon";
    if (type.value === "post_action") return `${menu_pid.value}_menu_icon`;
    if (type.value === "repost") return `${menu_pid.value}_repost_menu_icon`;
    return "";
  });
  const menu_id = computed(() => {
    if (!type.value) return "";
    if (type.value === "account") return "account_menu";
    if (type.value === "post_action") return `${menu_pid.value}_post_action_menu`;
    if (type.value === "repost") return `${menu_pid.value}_repost_menu`;
    return "";
  });

  const menuPlacementClass = ref("");
  const accountMenuStyle = ref({});

  function resetMenuLayout() {
    menuPlacementClass.value = "";
    accountMenuStyle.value = {};
  }

  function toggleMenu(pid, menuType) {
    if (pid !== menu_pid.value || type.value !== menuType)
      showMenu.value = false;
    menu_pid.value = pid;
    type.value = menuType;
    showMenu.value = !showMenu.value;
    if (showMenu.value) menuGetRect();
    else {
      menu_pid.value = "";
      type.value = "";
      resetMenuLayout();
    }
  }

  function handleClickOutside(event) {
    if (!showMenu.value) return;

    const iconKey = icon_id.value;
    const menuKey = menu_id.value;
    const icon = iconKey ? menuElements[iconKey] : null;
    const menu = menuKey ? menuElements[menuKey] : null;

    if (!icon || !menu) {
      return;
    }
    if (icon.contains(event.target)) {
      return;
    }
    if (menu.contains(event.target)) {
      return;
    }
    showMenu.value = false;
    menu_pid.value = "";
    type.value = "";
    resetMenuLayout();
  }

  function menuGetRect() {
    if (!showMenu.value) return;
    nextTick(() => {
      const centerEl = layoutRefs.center.value;
      const bottomEl = layoutRefs.bottom.value;
      if (!centerEl) return;

      const centerRect = centerEl.getBoundingClientRect();
      const bottomRect = bottomEl?.getBoundingClientRect?.() ?? {
        width: 0,
        height: 0,
        top: 0,
      };

      const menuKey = menu_id.value;
      const iconKey = icon_id.value;
      const menu = menuKey ? menuElements[menuKey] : null;
      const icon = iconKey ? menuElements[iconKey] : null;
      if (!menu || !icon) return;

      const menuRect = menu.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();

      resetMenuLayout();

      if (type.value === "account") {
        accountMenuStyle.value = {
          top: `${iconRect.top}px`,
          left: `${iconRect.left}px`,
        };
      } else if (type.value === "post_action") {
        if (
          bottomRect.width > 0
            ? iconRect.top + iconRect.height + 10 + menuRect.height >
              bottomRect.top
            : iconRect.top + iconRect.height + 10 + menuRect.height >
              centerRect.height
        ) {
          menuPlacementClass.value = "-translate-x-10 -translate-y-32";
        }
      } else if (type.value === "repost") {
        if (
          bottomRect.width > 0
            ? iconRect.top + menuRect.height > bottomRect.top
            : iconRect.top + menuRect.height > centerRect.height
        ) {
          menuPlacementClass.value = "-translate-y-40 -translate-x-10";
        }
      }
    });
  }

  return {
    showMenu,
    menu_pid,
    type,
    icon_id,
    menu_id,
    toggleMenu,
    handleClickOutside,
    menuGetRect,
    bindMenuElement,
    menuPlacementClass,
    accountMenuStyle,
  };
}
