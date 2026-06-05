import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import type { PostRow } from "~/queries/api/posts";
import type { ProfileRow } from "~/queries/api/profiles";

export const POSTS_WITH_META_COLUMNS =
  "id, user_id, text, pictures, reply_to, type, edited, created_at, author, like_count, reply_count, repost_count, bookmark_count, i_replied";

export type PostWithMetaRow = PostRow & {
  author: ProfileRow | null;
  like_count: number;
  reply_count: number;
  repost_count: number;
  bookmark_count: number;
  i_replied: boolean;
};

export function getPostsWithMetaClient() {
  return useSupabaseClient<Database>();
}

let viewMissingWarned = false;

/** Log once in dev when the view is missing (legacy queries still work). */
export function warnPostsWithMetaMissingOnce() {
  if (!import.meta.dev || viewMissingWarned) return;
  viewMissingWarned = true;
  console.warn(
    "[feed] posts_with_meta view missing — using legacy post queries. Run supabase/migrations/20260508000000_posts_with_meta.sql in the Supabase SQL editor.",
  );
}

/** True when `posts_with_meta` view is not deployed (REST 404 / PostgREST schema errors). */
export function isPostsWithMetaUnavailable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string; status?: number };
  if (e.status === 404) return true;
  if (e.code === "PGRST205" || e.code === "42P01") return true;
  return (
    typeof e.message === "string" && e.message.includes("posts_with_meta")
  );
}

export async function fetchAllFeedFromView(client: SupabaseClient<Database>) {
  return client
    .from("posts_with_meta")
    .select(POSTS_WITH_META_COLUMNS)
    .order("created_at", { ascending: false });
}

export async function fetchFeedByUserIdsFromView(
  client: SupabaseClient<Database>,
  userIds: string[],
) {
  return client
    .from("posts_with_meta")
    .select(POSTS_WITH_META_COLUMNS)
    .in("user_id", userIds)
    .order("created_at", { ascending: false });
}

export async function fetchUserPostsFromView(
  client: SupabaseClient<Database>,
  uid: string,
) {
  return client
    .from("posts_with_meta")
    .select(POSTS_WITH_META_COLUMNS)
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
}
