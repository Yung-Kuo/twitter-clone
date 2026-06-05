import { describe, expect, it, vi } from "vitest";
import { registerAlertBridge } from "~/composables/alertBridge";
import {
  handleMutationError,
  handleMutationSuccess,
} from "~/queries/lib/mutationAlert";

describe("mutationAlert", () => {
  it("routes errors to the alert bridge", () => {
    const showError = vi.fn();
    registerAlertBridge({ showError, showSuccess: vi.fn() } as never);
    handleMutationError(new Error("network"));
    expect(showError).toHaveBeenCalledWith("network");
  });

  it("routes success messages to the alert bridge", () => {
    const showSuccess = vi.fn();
    registerAlertBridge({ showError: vi.fn(), showSuccess } as never);
    handleMutationSuccess("Post liked");
    expect(showSuccess).toHaveBeenCalledWith("Post liked");
  });

  it("no-ops when bridge is unset", () => {
    registerAlertBridge(null);
    expect(() => handleMutationError(new Error("x"))).not.toThrow();
    expect(() => handleMutationSuccess("ok")).not.toThrow();
  });
});
