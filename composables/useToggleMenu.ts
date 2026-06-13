import type { LayoutRefs, MenuType } from "~/composables/injection-types";
import { positionFloatingElement } from "~/composables/useFloatingPosition";

export default function useToggleMenu(layoutRefs: LayoutRefs) {
  const showMenu = ref(false);
  const menu_pid = ref("");
  const type = ref<MenuType>("");
  const menuElements = shallowReactive<Record<string, HTMLElement>>({});

  function bindMenuElement(domId: string, el: HTMLElement | null) {
    if (!domId) return;
    if (el) menuElements[domId] = el;
    else Reflect.deleteProperty(menuElements, domId);
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
    if (type.value === "post_action")
      return `${menu_pid.value}_post_action_menu`;
    if (type.value === "repost") return `${menu_pid.value}_repost_menu`;
    return "";
  });

  const menuPlacementClass = ref("");
  const accountMenuStyle = ref<Record<string, string>>({});

  function resetMenuLayout() {
    menuPlacementClass.value = "";
    accountMenuStyle.value = {};
  }

  function toggleMenu(pid: string, menuType: MenuType) {
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

  function handleClickOutside(event: MouseEvent) {
    if (!showMenu.value) return;

    const iconKey = icon_id.value;
    const menuKey = menu_id.value;
    const icon = iconKey ? menuElements[iconKey] : null;
    const menu = menuKey ? menuElements[menuKey] : null;

    if (!icon || !menu) {
      return;
    }
    if (icon.contains(event.target as Node)) {
      return;
    }
    if (menu.contains(event.target as Node)) {
      return;
    }
    showMenu.value = false;
    menu_pid.value = "";
    type.value = "";
    resetMenuLayout();
  }

  function menuGetRect() {
    if (!showMenu.value) return;
    nextTick(async () => {
      const centerEl = layoutRefs.center.value;
      const bottomEl = layoutRefs.bottom.value;
      if (!centerEl) return;

      const centerRect = centerEl.getBoundingClientRect();
      const bottomRect = bottomEl?.getBoundingClientRect?.() ?? {
        width: 0,
        height: 0,
        top: centerRect.height,
      };

      const menuKey = menu_id.value;
      const iconKey = icon_id.value;
      const menu = menuKey ? menuElements[menuKey] : null;
      const icon = iconKey ? menuElements[iconKey] : null;
      if (!menu || !icon) return;

      resetMenuLayout();

      if (type.value === "account") {
        accountMenuStyle.value = await positionFloatingElement(
          icon,
          menu,
          "bottom",
          0,
        );
      } else if (type.value === "post_action") {
        const overflows =
          bottomRect.width > 0
            ? icon.getBoundingClientRect().bottom + menu.offsetHeight + 10 >
              bottomRect.top
            : icon.getBoundingClientRect().bottom + menu.offsetHeight + 10 >
              centerRect.height;
        if (overflows) {
          menuPlacementClass.value = "-translate-x-10 -translate-y-32";
        }
      } else if (type.value === "repost") {
        const overflows =
          bottomRect.width > 0
            ? icon.getBoundingClientRect().top + menu.offsetHeight >
              bottomRect.top
            : icon.getBoundingClientRect().top + menu.offsetHeight >
              centerRect.height;
        if (overflows) {
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
