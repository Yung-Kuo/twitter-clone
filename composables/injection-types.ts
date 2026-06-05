import type { ComponentPublicInstance, ComputedRef, Ref, ShallowRef } from "vue";
import type { Database } from "#build/types/supabase-database";
import type { AlertState } from "~/composables/alertState";

export type PostRow = Database["public"]["Tables"]["posts"]["Row"];

export type ScrollChrome = {
  bottomMuted: boolean;
  bannerLift: "home" | "other" | null;
};

export type LayoutRefs = {
  center: ShallowRef<HTMLElement | null>;
  right: ShallowRef<HTMLElement | null>;
  bottom: ShallowRef<HTMLElement | null>;
  banner: ShallowRef<HTMLElement | null>;
};

export type MenuType = "" | "account" | "post_action" | "repost";

export type AlertInjection = {
  alertState: Ref<AlertState>;
  alertMode: ComputedRef<string>;
  alertMessage: ComputedRef<string>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  clearAlert: () => void;
  hasError: () => void;
};

export type SearchInjection = {
  showSearch: Ref<boolean>;
  toggleSearch: () => void;
};

export type ProfileCardInjection = {
  showProfileCard: (el: HTMLElement | null, uid?: string | null) => void;
  hideProfileCard: () => void;
};

export type ProfileCardComposableInjection = ProfileCardInjection & {
  profileCardVis: Ref<boolean>;
  hoveredUserId: Ref<string | null>;
  getRect: () => void;
  bindProfileCard: (instance: ComponentPublicInstance | HTMLElement | null) => void;
  profileCardStyle: Ref<Record<string, string>>;
};

export type ToggleMenuFn = (pid: string, menuType: MenuType) => void;

export type TogglePostMenuInjection = {
  showMenu: Ref<boolean>;
  menu_pid: Ref<string>;
  type: Ref<string>;
  toggleMenu: ToggleMenuFn;
};

export type ToggleAccountMenuInjection = {
  showMenu: Ref<boolean>;
  type: Ref<string>;
  toggleMenu: ToggleMenuFn;
  menuGetRect: () => void;
};

export type WritePostInjection = {
  showPopupPost: Ref<boolean>;
  newPost: Ref<string>;
  repost_pid: Ref<string>;
  publishPost: () => Promise<boolean | undefined>;
  publishRepost: (pid: string) => Promise<void>;
  publishQuote: () => Promise<void>;
};

export type PopupReplyInjection = {
  pid: Ref<string>;
  publishReply: (postId: string, text: string) => Promise<boolean>;
};

export type EditInjection = {
  showPopupEdit: Ref<boolean>;
  editPost: Ref<PostRow | null>;
  newText: Ref<string>;
  selectEditPost: (pid: string) => void;
  publishEdit: () => Promise<unknown>;
};

export type ClickPostInjection = {
  target_post: Ref<PostRow | null>;
  clickPost: (event: MouseEvent) => Promise<void>;
  hoverPost: (event: MouseEvent) => void;
};

export type CollectionInjection = {
  profileCardVis: Ref<boolean>;
  hoveredUserId: Ref<string | null>;
  showProfileCard: ProfileCardInjection["showProfileCard"];
  hideProfileCard: ProfileCardInjection["hideProfileCard"];
  showPopupPost: Ref<boolean>;
  newPost: Ref<string>;
  repost_pid: Ref<string>;
  showPopupReply: Ref<boolean>;
  showPopupEdit: Ref<boolean>;
  editPost: Ref<PostRow | null>;
};

export type BindMenuElement = (domId: string, el: HTMLElement | null) => void;
