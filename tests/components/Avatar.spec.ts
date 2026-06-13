import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import UIAvatar from "~/components/UI/Avatar.vue";
import { useProfileStore } from "~/stores/profile";

describe("UIAvatar", () => {
  it("renders placeholder when no avatar image", () => {
    const profileStore = useProfileStore();
    profileStore.cacheProfile({
      id: "u1",
      username: "alice",
      first_name: "Alice",
      last_name: "Smith",
      avatar_url: null,
    } as never);

    const wrapper = mount(UIAvatar, {
      props: { user_id: "u1", size: "small" },
      global: {
        stubs: {
          NuxtImg: true,
        },
      },
    });

    expect(wrapper.find("div.rounded-full").exists()).toBe(true);
  });
});
