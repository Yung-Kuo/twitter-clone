import { describe, expect, it } from "vitest";
import {
  postSchema,
  postWithMetaSchema,
  profileSchema,
  replySchema,
} from "../../schemas/post";
import { parsePostsWithMetaRows } from "../../schemas/parse";

const profileFixture = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "alice",
  first_name: "A",
  last_name: "B",
  description: "",
  avatar_url: "x.png",
  updated_at: null,
  created_at: null,
};

describe("schemas/post", () => {
  it("parses a minimal profile", () => {
    const p = profileSchema.parse(profileFixture);
    expect(p.username).toBe("alice");
  });

  it("parses a post row", () => {
    const row = postSchema.parse({
      id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      text: "hi",
      pictures: null,
      reply_to: null,
      type: "post",
      edited: false,
      created_at: new Date().toISOString(),
    });
    expect(row.type).toBe("post");
  });

  it("parses a reply row", () => {
    const row = replySchema.parse({
      id: "6ba7b810-9dad-11d1-80b4-00c04fd430c9",
      user_id: profileFixture.id,
      text: "reply",
      created_at: new Date().toISOString(),
    });
    expect(row.text).toBe("reply");
  });

  it("parses posts_with_meta feed rows with counts", () => {
    const rows = parsePostsWithMetaRows([
      {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        user_id: profileFixture.id,
        text: "hi",
        pictures: null,
        reply_to: null,
        type: "post",
        edited: false,
        created_at: new Date().toISOString(),
        author: profileFixture,
        like_count: 2,
        reply_count: 1,
        repost_count: 0,
        bookmark_count: 3,
        i_replied: true,
      },
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.like_count).toBe(2);
    expect(rows[0]!.i_replied).toBe(true);
    expect(postWithMetaSchema.safeParse(rows[0]).success).toBe(true);
  });
});
