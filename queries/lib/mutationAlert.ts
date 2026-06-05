import { getAlertBridge } from "~/composables/alertBridge";
import { errMsg } from "~/utils/errMsg";

export function handleMutationError(error: unknown) {
  getAlertBridge()?.showError(errMsg(error));
}

export function handleMutationSuccess(message: string) {
  getAlertBridge()?.showSuccess(message);
}
