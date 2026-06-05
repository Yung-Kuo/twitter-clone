import { describe, expect, it, vi } from "vitest";
import { effectScope } from "vue";
import useAlert from "~/composables/useAlert";

describe("useAlert", () => {
  it("uses discriminated idle | success | error states", () => {
    vi.useFakeTimers();
    const scope = effectScope();
    scope.run(() => {
      const { alertState, showError, showSuccess, alertMode, alertMessage } =
        useAlert();
      expect(alertState.value).toEqual({ kind: "idle" });
      showError("bad");
      expect(alertState.value).toEqual({ kind: "error", message: "bad" });
      expect(alertMode.value).toBe("error");
      expect(alertMessage.value).toBe("bad");
      showSuccess("ok");
      expect(alertState.value).toEqual({ kind: "success", message: "ok" });
      expect(alertMode.value).toBe("notify");
      vi.advanceTimersByTime(2000);
      expect(alertState.value).toEqual({ kind: "idle" });
    });
    vi.useRealTimers();
  });
});
