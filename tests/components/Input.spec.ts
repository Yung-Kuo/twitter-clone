import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import UIInput from "~/components/UI/Input.vue";

describe("UIInput", () => {
  it("marks invalid email", async () => {
    const text = ref("");
    const wrapper = mount(UIInput, {
      props: {
        type: "email",
        text: text.value,
      },
      attrs: {
        "onUpdate:text": (v: string) => {
          text.value = v;
          void wrapper.setProps({ text: v });
        },
      },
    });

    await wrapper.find("input").setValue("not-an-email");
    expect(wrapper.find("div").classes().join(" ")).toMatch(/orange/);
  });

  it("marks valid email", async () => {
    const text = ref("");
    const wrapper = mount(UIInput, {
      props: {
        type: "email",
        text: text.value,
      },
      attrs: {
        "onUpdate:text": (v: string) => {
          text.value = v;
          void wrapper.setProps({ text: v });
        },
      },
    });

    await wrapper.find("input").setValue("user@example.com");
    expect(wrapper.find("div").classes().join(" ")).toMatch(/sky/);
  });
});
