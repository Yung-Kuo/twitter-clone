/** Readable string for catches (PostgREST / Supabase payloads are plain objects). */
export function errMsg(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e !== null) {
    const o = e as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    if (typeof o.details === "string") return o.details;
    if (typeof o.error_description === "string") return o.error_description;
  }
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
