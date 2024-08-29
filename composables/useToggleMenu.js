export default function () {
  const showMenu = ref(false);
  const menu_pid = ref("");
  const menu_uid = ref("");
  const type = ref("");
  const icon_id = computed(() => {
    if (type.value === "account") return "account_menu_icon";
    else if (type.value === "post_action") return `${menu_pid.value}_menu_icon`;
    else if (type.value === "repost")
      return `${menu_pid.value}_repost_menu_icon`;
  });
  const menu_id = computed(() => {
    if (!type.value) return null;
    else if (type.value === "account") return "account_menu";
    else if (type.value === "post_action")
      return `${menu_pid.value}_post_action_menu`;
    else if (type.value === "repost") return `${menu_pid.value}_repost_menu`;
  });
  function toggleMenu(pid, uid, menuType) {
    if (pid !== menu_pid.value || type.value !== menuType)
      showMenu.value = false;
    menu_pid.value = pid;
    menu_uid.value = uid;
    type.value = menuType;
    showMenu.value = !showMenu.value;
    if (showMenu.value) menuGetRect();
    else {
      menu_pid.value = "";
      menu_uid.value = "";
      type.value = "";
    }
  }
  function handleClickOutside(event) {
    if (showMenu.value) {
      const icon = document.getElementById(icon_id.value);
      const menu = document.getElementById(menu_id.value);
      if (!icon || !menu) {
        return;
      } else if (icon.contains(event.target)) {
        console.log("click icon");
        return;
      } else if (menu.contains(event.target)) {
        console.log("click menu");
        return;
      } else {
        console.log("click outside");
        toggleMenu(menu_pid.value, menu_uid.value, type.value);
      }
    }
  }
  function menuGetRect() {
    // console.log("menuGetRect!!!");
    if (showMenu.value) {
      nextTick(() => {
        // center
        const center = document.getElementById("center");
        const centerRect = center.getBoundingClientRect();
        // bottom
        const bottom = document.getElementById("bottom");
        const bottomRect = bottom.getBoundingClientRect();
        // menu
        const menu = document.getElementById(menu_id.value);
        if (!menu) return;
        const menuRect = menu.getBoundingClientRect();
        // menu icon
        const icon = document.getElementById(icon_id.value);
        const iconRect = icon.getBoundingClientRect();
        // calculate position
        if (type.value === "account") {
          // account
          menu.style.top = `${iconRect.top}px`;
          menu.style.left = `${iconRect.left}px`;
        } else if (type.value === "post_action") {
          console.log(
            bottomRect.width > 0
              ? iconRect.top + iconRect.height + 10 + menuRect.height >
                  bottomRect.top
              : iconRect.top + iconRect.height + 10 + menuRect.height >
                  centerRect.height
          );
          // post action menu
          if (
            // menu too low
            bottomRect.width > 0
              ? iconRect.top + iconRect.height + 10 + menuRect.height >
                bottomRect.top
              : iconRect.top + iconRect.height + 10 + menuRect.height >
                centerRect.height
          ) {
            menu.classList.add("-translate-x-10", "-translate-y-32");
          } else {
            // menu normal position
            menu.classList.remove("-translate-x-10", "-translate-y-32");
          }
        } else if (type.value === "repost") {
          // repost menu
          if (
            bottomRect.width > 0
              ? iconRect.top + menuRect.height > bottomRect.top
              : iconRect.top + menuRect.height > centerRect.height
          ) {
            if (!menu.classList.contains("-translate-y-20")) {
              menu.classList.add("-translate-y-20");
            }
          } else {
            if (menu.classList.contains("-translate-y-20")) {
              menu.classList.remove("-translate-y-20");
            }
          }
        }
      });
    }
  }

  return {
    showMenu,
    menu_pid,
    menu_uid,
    type,
    icon_id,
    toggleMenu,
    handleClickOutside,
    menuGetRect,
  };
}
