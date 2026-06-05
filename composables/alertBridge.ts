import type useAlert from "~/composables/useAlert";

type AlertApi = ReturnType<typeof useAlert>;

let bridge: AlertApi | null = null;

export function registerAlertBridge(api: AlertApi | null) {
  bridge = api;
}

export function getAlertBridge() {
  return bridge;
}
