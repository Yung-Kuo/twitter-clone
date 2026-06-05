import { computed, ref } from "vue";
import type { AlertState } from "~/composables/alertState";

const DISMISS_MS = 2000;

export default function useAlert() {
  const alertState = ref<AlertState>({ kind: "idle" });
  const errorTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  function clearDismissTimer() {
    if (errorTimeout.value) {
      clearTimeout(errorTimeout.value);
      errorTimeout.value = null;
    }
  }

  function scheduleDismiss() {
    clearDismissTimer();
    errorTimeout.value = setTimeout(() => {
      alertState.value = { kind: "idle" };
      errorTimeout.value = null;
    }, DISMISS_MS);
  }

  function showError(message: string) {
    alertState.value = { kind: "error", message };
    scheduleDismiss();
  }

  function showSuccess(message: string) {
    alertState.value = { kind: "success", message };
    scheduleDismiss();
  }

  function clearAlert() {
    clearDismissTimer();
    alertState.value = { kind: "idle" };
  }

  /** @deprecated Prefer showError / showSuccess — kept for call sites that only trigger auto-dismiss. */
  function hasError() {
    scheduleDismiss();
  }

  const alertMode = computed(() => {
    const { kind } = alertState.value;
    if (kind === "error") return "error";
    if (kind === "success") return "notify";
    return "";
  });

  const alertMessage = computed(() =>
    alertState.value.kind === "idle" ? "" : alertState.value.message,
  );

  return {
    alertState,
    alertMode,
    alertMessage,
    showError,
    showSuccess,
    clearAlert,
    errorTimeout,
    hasError,
  };
}
