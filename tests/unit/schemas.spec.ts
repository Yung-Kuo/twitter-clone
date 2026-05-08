import { describe, expect, it } from "vitest";
import { postSchema, profileSchema } from "../../schemas/post";

describe("schemas/post", () => {
  it("parses a minimal profile", () => {
    const p = profileSchema.parse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      username: "alice",
      first_name: "A",
      last_name: "B",
      description: "",
      avatar_url: "x.png",
    });
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
});
