/** Column lists for `.select(...)` so PostgREST infers row shapes (not `{}`). */
export const POST_COLUMNS =
  "id, user_id, text, pictures, reply_to, type, edited, created_at";
export const PROFILE_COLUMNS =
  "id, username, first_name, last_name, description, avatar_url, updated_at, created_at";
export const FOLLOWING_COLUMNS = "follower_id, following_id";
export const REPLY_TABLE_COLUMNS = "id, user_id, text, created_at";
