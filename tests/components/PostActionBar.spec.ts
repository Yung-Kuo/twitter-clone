import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import MainPostActionBar from "~/components/Main/Post/ActionBar.vue";
import {
  bindMenuElementKey,
  clickReplyKey,
  togglePostMenuKey,
  writePostKey,
} from "~/composables/keys";
import { usePostStore } from "~/stores/post";
import { useProfileStore } from "~/stores/profile";
import { useReplyStore } from "~/stores/reply";

describe("MainPostActionBar", () => {
  it("renders action counts from stores", () => {
    const postStore = usePostStore();
    const replyStore = useReplyStore();
    const profileStore = useProfileStore();

    profileStore.cacheProfile({
      id: "u1",
      username: "alice",
      first_name: "Alice",
      last_name: "Smith",
    } as never);
    postStore.likeCount = { p1: 3 };
    postStore.bookmarkCount = { p1: 1 };
    postStore.repostCount = { p1: 2 };
    replyStore.replyCount = { p1: 4 };

    const wrapper = mount(MainPostActionBar, {
      props: { postId: "p1", userId: "u1" },
      global: {
        provide: {
          [togglePostMenuKey as symbol]: {
            showMenu: ref(false),
            menu_pid: ref(""),
            type: ref(""),
            toggleMenu: vi.fn(),
          },
          [bindMenuElementKey as symbol]: vi.fn(),
          [writePostKey as symbol]: {
            showPopupPost: ref(false),
            repost_pid: ref(null),
            publishRepost: vi.fn(),
          },
          [clickReplyKey as symbol]: vi.fn(),
        },
        stubs: {
          IconsBadge: true,
          IconsReply: true,
          IconsRepost: true,
          IconsLike: true,
          IconsBookmark: true,
          IconsShare: true,
          UIPopupRepostMenu: true,
          UIPopupTransition: true,
          MainPostInteractive: { template: "<div><slot /></div>" },
        },
      },
    });

    expect(wrapper.text()).toContain("4");
    expect(wrapper.text()).toContain("3");
    expect(wrapper.text()).toContain("2");
    expect(wrapper.text()).toContain("1");
  });
});
