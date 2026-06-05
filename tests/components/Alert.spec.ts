import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import UIAlert from "~/components/UI/Alert.vue";

describe("UIAlert", () => {
  it("renders error message", () => {
    const wrapper = mount(UIAlert, {
      props: { mode: "error", message: "Something failed" },
    });
    expect(wrapper.text()).toContain("Something failed");
    expect(wrapper.find("div").classes().join(" ")).toMatch(/bg-red/);
  });

  it("renders success-style message", () => {
    const wrapper = mount(UIAlert, {
      props: { mode: "notify", message: "Saved" },
    });
    expect(wrapper.text()).toContain("Saved");
  });

  it("hides when message is empty", () => {
    const wrapper = mount(UIAlert, { props: { message: "" } });
    expect(wrapper.find("div").exists()).toBe(false);
  });
});
