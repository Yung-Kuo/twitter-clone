import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";

/** OAuth / CDN avatars — use as `<img src>` directly; skip Supabase storage download. */
export function isAbsoluteAvatarUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export async function downloadAvatarBlob(
  client: SupabaseClient<Database>,
  avatarUrl: string,
) {
  return client.storage.from("avatars").download(avatarUrl);
}

export async function uploadAvatarFile(
  client: SupabaseClient<Database>,
  filePath: string,
  file: File,
) {
  return client.storage.from("avatars").upload(filePath, file);
}

export async function removeAvatarFile(
  client: SupabaseClient<Database>,
  filePath: string,
) {
  return client.storage.from("avatars").remove([filePath]);
}
