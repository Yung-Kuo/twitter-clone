import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import UIButtonFollow from "~/components/UI/Button/Follow.vue";
import { useFollowingStore } from "~/stores/following";

vi.mock("~/queries/hooks/useFollowMutation", () => ({
  useFollowMutation: () => ({
    mutate: vi.fn(),
  }),
}));

vi.stubGlobal("useSupabaseUser", () => ref({ id: "self" }));

describe("UIButtonFollow", () => {
  it("shows Edit Profile for the current user", () => {
    const wrapper = mount(UIButtonFollow, {
      props: { uid: "self" },
      global: {
        stubs: {
          NuxtLink: { template: "<a><slot /></a>" },
          UIButton: { template: "<button><slot /></button>" },
        },
      },
    });
    expect(wrapper.text()).toContain("Edit Profile");
  });

  it("shows Follow for another user", () => {
    const followingStore = useFollowingStore();
    followingStore.isFollowing = { other: false };

    const wrapper = mount(UIButtonFollow, {
      props: { uid: "other" },
      global: {
        stubs: {
          NuxtLink: true,
          UIButton: { template: "<button><slot /></button>" },
        },
      },
    });
    expect(wrapper.text()).toContain("Follow");
  });
});
