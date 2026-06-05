import { describe, expect, it } from "vitest";
import {
  parseEngagementPayload,
  parsePostsWithMetaRows,
  parseProfileRow,
  parseProfileRowNullable,
} from "~/schemas/parse";

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

describe("schemas/parse", () => {
  it("parseProfileRow accepts valid profile", () => {
    expect(parseProfileRow(profileFixture).username).toBe("alice");
  });

  it("parseProfileRowNullable returns null for invalid author", () => {
    expect(parseProfileRowNullable({ id: "not-uuid" })).toBeNull();
    expect(parseProfileRowNullable(null)).toBeNull();
  });

  it("parseEngagementPayload validates likes and bookmarks", () => {
    const payload = parseEngagementPayload({
      likes: [{ post_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" }],
      bookmarks: [{ post_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c9" }],
    });
    expect(payload.likes).toHaveLength(1);
    expect(payload.bookmarks).toHaveLength(1);
  });

  it("parsePostsWithMetaRows rejects malformed rows", () => {
    expect(() => parsePostsWithMetaRows([{ id: "bad" }])).toThrow();
  });

  it("parsePostsWithMetaRows accepts empty list", () => {
    expect(parsePostsWithMetaRows([])).toEqual([]);
  });
});
