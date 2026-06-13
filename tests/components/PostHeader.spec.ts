import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import MainPostHeader from "~/components/Main/Post/Header.vue";
import {
  bindMenuElementKey,
  profileCardKey,
  togglePostMenuKey,
} from "~/composables/keys";
import { useProfileStore } from "~/stores/profile";

const post = {
  id: "p1",
  user_id: "u1",
  created_at: "2024-06-01T12:00:00.000Z",
  edited: false,
};

function mountHeader(variant: "feed" | "refer" | "single") {
  const profileStore = useProfileStore();
  profileStore.cacheProfile({
    id: "u1",
    username: "alice",
    first_name: "Alice",
    last_name: "Smith",
    avatar_url: null,
    bio: null,
    created_at: "",
    updated_at: "",
  } as never);

  return mount(MainPostHeader, {
    props: { post, variant },
    global: {
      provide: {
        [profileCardKey as symbol]: {
          showProfileCard: vi.fn(),
          hideProfileCard: vi.fn(),
        },
        [togglePostMenuKey as symbol]: {
          showMenu: ref(false),
          menu_pid: ref(""),
          type: ref(""),
          toggleMenu: vi.fn(),
        },
        [bindMenuElementKey as symbol]: vi.fn(),
      },
      stubs: {
        NuxtLink: { template: "<a><slot /></a>" },
        UIAvatar: true,
        IconsBadge: true,
        IconsMore: true,
        UIPopupMenu: true,
        UIPopupTransition: true,
        MainPostInteractive: { template: "<div><slot /></div>" },
      },
    },
  });
}

describe("MainPostHeader", () => {
  it("renders author name in refer variant", () => {
    const wrapper = mountHeader("refer");
    expect(wrapper.text()).toContain("Alice Smith");
    expect(wrapper.text()).toContain("@alice");
  });

  it("renders feed variant with timestamp", () => {
    const wrapper = mountHeader("feed");
    expect(wrapper.text()).toMatch(/June/);
  });
});
