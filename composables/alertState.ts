export type AlertState =
  | { kind: "idle" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };
