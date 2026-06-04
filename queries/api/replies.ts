import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import { POST_COLUMNS } from "~/types/supabase-select";
import type { NewPostInput, PostRow } from "~/queries/api/posts";

export function getRepliesClient() {
  return useSupabaseClient<Database>();
}

export async function insertReplyPost(
  client: SupabaseClient<Database>,
  uid: string,
  newReply: NewPostInput,
) {
  return client
    .from("posts")
    .insert({
      user_id: uid,
      text: newReply.text,
      pictures: newReply.pictures,
      reply_to: newReply.reply_to,
      type: newReply.type,
    })
    .select(POST_COLUMNS)
    .single();
}

export async function fetchRepliesForPost(
  client: SupabaseClient<Database>,
  pid: string,
) {
  return client
    .from("posts")
    .select(POST_COLUMNS)
    .eq("type", "reply")
    .eq("reply_to", pid)
    .order("created_at", { ascending: true });
}

export async function fetchRepliesByUser(
  client: SupabaseClient<Database>,
  uid: string,
) {
  return client
    .from("posts")
    .select(POST_COLUMNS)
    .eq("type", "reply")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
}

export async function countRepliesForPost(
  client: SupabaseClient<Database>,
  pid: string,
) {
  return client
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("reply_to", pid)
    .eq("type", "reply");
}

export async function fetchUserRepliedToPost(
  client: SupabaseClient<Database>,
  pid: string,
  uid: string,
) {
  return client
    .from("posts")
    .select("id")
    .eq("type", "reply")
    .eq("reply_to", pid)
    .eq("user_id", uid)
    .limit(1);
}

export async function fetchAuthorReplyOnPost(
  client: SupabaseClient<Database>,
  pid: string,
  authorId: string,
) {
  return client
    .from("posts")
    .select(POST_COLUMNS)
    .eq("reply_to", pid)
    .eq("user_id", authorId)
    .order("created_at")
    .limit(1);
}

export type { PostRow };
