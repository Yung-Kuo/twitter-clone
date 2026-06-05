import { describe, expect, it } from "vitest";
import { stripPostRow } from "~/queries/sync/stripPostRow";
import type { PostWithMetaDTO } from "~/schemas/post";

const metaRow: PostWithMetaDTO = {
  id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  user_id: "550e8400-e29b-41d4-a716-446655440000",
  text: "hello",
  pictures: null,
  reply_to: null,
  type: "post",
  edited: false,
  created_at: "2024-01-01T00:00:00.000Z",
  author: null,
  like_count: 1,
  reply_count: 2,
  repost_count: 0,
  bookmark_count: 3,
  i_replied: false,
};

describe("stripPostRow", () => {
  it("removes meta fields and keeps post columns", () => {
    const post = stripPostRow(metaRow);
    expect(post.id).toBe(metaRow.id);
    expect(post.text).toBe("hello");
    expect(post).not.toHaveProperty("like_count");
    expect(post).not.toHaveProperty("author");
  });
});
