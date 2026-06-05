import { describe, expect, it } from "vitest";
import { quotedRepostIdsFromPosts } from "~/queries/sync/quotedRepostIds";
import type { PostRow } from "~/queries/api/posts";

const base: PostRow = {
  id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  user_id: "550e8400-e29b-41d4-a716-446655440000",
  text: "x",
  pictures: null,
  reply_to: null,
  type: "post",
  edited: false,
  created_at: "2024-01-01T00:00:00.000Z",
};

describe("quotedRepostIdsFromPosts", () => {
  it("collects missing quoted post ids for repost rows", () => {
    const quotedId = "7baa130b-132d-4504-a5f9-40439797586a";
    const ids = quotedRepostIdsFromPosts(
      [
        base,
        {
          ...base,
          id: "a1a1a1a1-a1a1-4111-a111-111111111111",
          type: "repost",
          reply_to: quotedId,
          text: quotedId,
        },
      ],
      () => false,
    );
    expect(ids).toEqual([quotedId]);
  });

  it("skips when quoted post is already cached", () => {
    const quotedId = "7baa130b-132d-4504-a5f9-40439797586a";
    const ids = quotedRepostIdsFromPosts(
      [
        {
          ...base,
          id: "b2b2b2b2-b2b2-4222-b222-222222222222",
          type: "repost",
          reply_to: quotedId,
          text: quotedId,
        },
      ],
      (id) => id === quotedId,
    );
    expect(ids).toEqual([]);
  });
});
