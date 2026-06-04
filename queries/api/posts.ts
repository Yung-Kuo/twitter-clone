import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#build/types/supabase-database";
import { POST_COLUMNS, REPLY_TABLE_COLUMNS } from "~/types/supabase-select";

export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ReplyRow = Database["public"]["Tables"]["reply"]["Row"];
type BookmarkPick = Pick<
  Database["public"]["Tables"]["bookmark"]["Row"],
  "post_id"
>;
type LikePick = Pick<Database["public"]["Tables"]["likes"]["Row"], "post_id">;

export type NewPostInput = Pick<
  PostRow,
  "text" | "pictures" | "reply_to" | "type"
>;
export type PostEdit = Pick<PostRow, "id" | "text">;

export function getPostsClient() {
  return useSupabaseClient<Database>();
}

export async function insertPost(
  client: SupabaseClient<Database>,
  uid: string,
  newPost: NewPostInput,
) {
  return client
    .from("posts")
    .insert({
      user_id: uid,
      text: newPost.text,
      pictures: newPost.pictures,
      reply_to: newPost.reply_to,
      type: newPost.type,
    })
    .select(POST_COLUMNS)
    .single();
}

export async function updatePostRow(
  client: SupabaseClient<Database>,
  edit: PostEdit,
) {
  return client
    .from("posts")
    .update({ text: edit.text, edited: true })
    .eq("id", edit.id)
    .select(POST_COLUMNS)
    .single();
}

export async function deletePostRow(
  client: SupabaseClient<Database>,
  pid: string,
  uid: string,
) {
  return client.from("posts").delete().match({ id: pid, user_id: uid });
}

export async function fetchPostsByUser(
  client: SupabaseClient<Database>,
  uid: string,
) {
  return client
    .from("posts")
    .select(POST_COLUMNS)
    .in("type", ["post", "repost"])
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
}

export async function fetchAllFeedPosts(client: SupabaseClient<Database>) {
  return client
    .from("posts")
    .select(POST_COLUMNS)
    .in("type", ["post", "repost"])
    .order("created_at", { ascending: false });
}

export async function fetchPostsByUserIds(
  client: SupabaseClient<Database>,
  userIds: string[],
) {
  return client
    .from("posts")
    .select(POST_COLUMNS)
    .in("type", ["post", "repost"])
    .in("user_id", userIds)
    .order("created_at", { ascending: false });
}

export async function fetchPostById(
  client: SupabaseClient<Database>,
  pid: string,
) {
  return client.from("posts").select(POST_COLUMNS).eq("id", pid).single();
}

export async function fetchQuotesForPost(
  client: SupabaseClient<Database>,
  pid: string,
) {
  return client
    .from("posts")
    .select(POST_COLUMNS)
    .eq("type", "repost")
    .eq("reply_to", pid)
    .neq("text", pid)
    .order("created_at", { ascending: false });
}

export async function fetchRepostsForPost(
  client: SupabaseClient<Database>,
  pid: string,
) {
  return client
    .from("posts")
    .select(POST_COLUMNS)
    .eq("type", "repost")
    .eq("reply_to", pid)
    .eq("text", pid)
    .order("created_at", { ascending: false });
}

export async function countReposts(
  client: SupabaseClient<Database>,
  pid: string,
) {
  return client
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("reply_to", pid)
    .eq("type", "repost");
}

export async function insertBookmark(
  client: SupabaseClient<Database>,
  pid: string,
  uid: string,
) {
  return client
    .from("bookmark")
    .insert({ post_id: pid, user_id: uid })
    .select("post_id")
    .single();
}

export async function deleteBookmark(
  client: SupabaseClient<Database>,
  pid: string,
  uid: string,
) {
  return client.from("bookmark").delete().match({ post_id: pid, user_id: uid });
}

export async function fetchBookmarksForUser(
  client: SupabaseClient<Database>,
  uid: string,
) {
  return client
    .from("bookmark")
    .select("post_id")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
}

export async function fetchPostsByIds(
  client: SupabaseClient<Database>,
  ids: string[],
) {
  return client
    .from("posts")
    .select(POST_COLUMNS)
    .in("id", ids)
    .order("created_at", { ascending: false });
}

export async function countBookmarks(
  client: SupabaseClient<Database>,
  pid: string,
) {
  return client
    .from("bookmark")
    .select("*", { count: "exact", head: true })
    .eq("post_id", pid);
}

export async function insertLike(
  client: SupabaseClient<Database>,
  pid: string,
  uid: string,
) {
  return client
    .from("likes")
    .insert({ post_id: pid, user_id: uid })
    .select("post_id")
    .single();
}

export async function deleteLike(
  client: SupabaseClient<Database>,
  pid: string,
  uid: string,
) {
  return client.from("likes").delete().match({ post_id: pid, user_id: uid });
}

export async function fetchLikesForUser(
  client: SupabaseClient<Database>,
  uid: string,
) {
  return client
    .from("likes")
    .select("post_id")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
}

export async function countLikes(
  client: SupabaseClient<Database>,
  pid: string,
) {
  return client
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", pid);
}

export async function insertReplyTableRow(
  client: SupabaseClient<Database>,
  uid: string,
  text: string,
) {
  return client
    .from("reply")
    .insert({ user_id: uid, text })
    .select(REPLY_TABLE_COLUMNS)
    .single();
}

export type { BookmarkPick, LikePick, ReplyRow };
