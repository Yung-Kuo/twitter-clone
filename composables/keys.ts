import type { InjectionKey, Ref } from "vue";
import type {
  AlertInjection,
  BindMenuElement,
  ClickPostInjection,
  CollectionInjection,
  EditInjection,
  LayoutRefs,
  PopupReplyInjection,
  ProfileCardComposableInjection,
  ProfileCardInjection,
  ScrollChrome,
  SearchInjection,
  ToggleAccountMenuInjection,
  TogglePostMenuInjection,
  WritePostInjection,
} from "~/composables/injection-types";

export const scrollChromeKey: InjectionKey<ScrollChrome> = Symbol("scrollChrome");
export const mainPageShiftedKey: InjectionKey<Ref<boolean>> =
  Symbol("mainPageShifted");
export const layoutRefsKey: InjectionKey<LayoutRefs> = Symbol("layoutRefs");

export const useAlertKey: InjectionKey<AlertInjection> = Symbol("useAlert");
export const useSearchKey: InjectionKey<SearchInjection> = Symbol("useSearch");

export const handleWheelEventKey: InjectionKey<
  (event: WheelEvent, scroll_at: "right" | "center") => void
> = Symbol("handleWheelEvent");
export const handleScrollKey: InjectionKey<(event: Event) => void> =
  Symbol("handleScroll");

export const useProfileCardKey: InjectionKey<ProfileCardComposableInjection> =
  Symbol("useProfileCard");
export const profileCardKey: InjectionKey<ProfileCardInjection> =
  Symbol("profileCard");
export const getRectKey: InjectionKey<() => void> = Symbol("getRect");
export const profileCardStyleKey: InjectionKey<Ref<Record<string, string>>> =
  Symbol("profileCardStyle");
export const bindProfileCardKey: InjectionKey<
  ProfileCardComposableInjection["bindProfileCard"]
> = Symbol("bindProfileCard");
export const profileCardVisKey: InjectionKey<{
  profileCardVis: Ref<boolean>;
  hoveredUserId: Ref<string | null>;
}> = Symbol("profileCardVis");

export const bindMenuElementKey: InjectionKey<BindMenuElement> =
  Symbol("bindMenuElement");
export const handleClickOutsideKey: InjectionKey<(event: MouseEvent) => void> =
  Symbol("handleClickOutside");
export const menuPlacementClassKey: InjectionKey<Ref<string>> =
  Symbol("menuPlacementClass");
export const accountMenuStyleKey: InjectionKey<Ref<Record<string, string>>> =
  Symbol("accountMenuStyle");
export const toggleMenuKey: InjectionKey<TogglePostMenuInjection["toggleMenu"]> =
  Symbol("toggleMenu");
export const menuGetRectKey: InjectionKey<() => void> = Symbol("menuGetRect");
export const togglePostMenuKey: InjectionKey<TogglePostMenuInjection> =
  Symbol("togglePostMenu");
export const toggleAccountMenuKey: InjectionKey<ToggleAccountMenuInjection> =
  Symbol("toggleAccountMenu");

export const writePostKey: InjectionKey<WritePostInjection> =
  Symbol("writePost");
export const showPopupPostKey: InjectionKey<Ref<boolean>> =
  Symbol("showPopupPost");
export const repostPidKey: InjectionKey<Ref<string>> = Symbol("repost_pid");

export const clickReplyKey: InjectionKey<(postId: string) => void> =
  Symbol("clickReply");
export const popupReplyKey: InjectionKey<PopupReplyInjection> =
  Symbol("popupReply");

export const useEditKey: InjectionKey<EditInjection> = Symbol("useEdit");
export const selectEditPostKey: InjectionKey<EditInjection["selectEditPost"]> =
  Symbol("selectEditPost");

export const clickPostKey: InjectionKey<ClickPostInjection> =
  Symbol("clickPost");
export const useCollectionKey: InjectionKey<CollectionInjection> =
  Symbol("useCollection");
