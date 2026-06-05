import type { PostRow } from "~/queries/api/posts";
import type { PostWithMetaDTO } from "~/schemas/post";

export function stripPostRow(row: PostWithMetaDTO): PostRow {
  const {
    author: _author,
    like_count: _lc,
    reply_count: _rc,
    repost_count: _rpc,
    bookmark_count: _bc,
    is_liked_by_me: _ilm,
    is_bookmarked_by_me: _ibm,
    i_replied: _ir,
    ...post
  } = row;
  return {
    id: post.id,
    user_id: post.user_id,
    text: post.text,
    pictures: post.pictures ?? null,
    reply_to: post.reply_to,
    type: post.type,
    edited: post.edited,
    created_at: post.created_at,
  };
}
