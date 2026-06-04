import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import { FOLLOWING_COLUMNS } from "~/types/supabase-select";

export function getFollowingClient() {
  return useSupabaseClient<Database>();
}

export async function fetchFollowingIds(
  client: SupabaseClient<Database>,
  uid: string,
) {
  return client
    .from("following")
    .select("following_id")
    .eq("follower_id", uid)
    .order("created_at", { ascending: false });
}

export async function fetchFollowerIds(
  client: SupabaseClient<Database>,
  uid: string,
) {
  return client
    .from("following")
    .select(FOLLOWING_COLUMNS)
    .eq("following_id", uid)
    .order("created_at", { ascending: false });
}

export async function checkFollowingPair(
  client: SupabaseClient<Database>,
  followerId: string,
  followingId: string,
) {
  return client
    .from("following")
    .select(FOLLOWING_COLUMNS)
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
}

export async function insertFollowing(
  client: SupabaseClient<Database>,
  followerId: string,
  followingId: string,
) {
  return client.from("following").insert({
    follower_id: followerId,
    following_id: followingId,
  });
}

export async function deleteFollowing(
  client: SupabaseClient<Database>,
  followerId: string,
  followingId: string,
) {
  return client.from("following").delete().match({
    follower_id: followerId,
    following_id: followingId,
  });
}
