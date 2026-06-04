import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import { PROFILE_COLUMNS } from "~/types/supabase-select";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type ProfileUpdatePayload = Pick<
  ProfileRow,
  "first_name" | "last_name" | "username" | "avatar_url" | "description"
>;

export function getProfilesClient() {
  return useSupabaseClient<Database>();
}

export async function fetchProfileById(
  client: SupabaseClient<Database>,
  uid: string,
) {
  return client
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", uid)
    .single();
}

export async function fetchAllProfiles(client: SupabaseClient<Database>) {
  return client.from("profiles").select(PROFILE_COLUMNS);
}

export async function fetchProfileByUsername(
  client: SupabaseClient<Database>,
  username: string,
) {
  return client
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("username", username)
    .single();
}

export async function upsertProfile(
  client: SupabaseClient<Database>,
  profile: ProfileRow,
  uid: string,
) {
  return client.from("profiles").upsert(profile).eq("id", uid).single();
}
