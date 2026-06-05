import { describe, expect, it } from "vitest";
import { qk } from "~/queries/keys";

describe("queries/keys", () => {
  it("builds stable profile keys", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    expect(qk.profiles.byId(id)).toEqual(["profiles", "byId", id]);
    expect(qk.profiles.all).toEqual(["profiles", "list"]);
  });

  it("builds feed and post keys", () => {
    expect(qk.posts.feed("all")).toEqual(["posts", "feed", "all"]);
    expect(qk.posts.feed("following")).toEqual(["posts", "feed", "following"]);
    expect(qk.posts.byId("post-1")).toEqual(["posts", "byId", "post-1"]);
    expect(qk.posts.byUser("user-1")).toEqual(["posts", "byUser", "user-1"]);
    expect(qk.posts.withMetaFeed("all")).toEqual([
      "posts",
      "withMeta",
      "feed",
      "all",
    ]);
  });

  it("builds reply keys", () => {
    expect(qk.replies.byPost("pid")).toEqual(["replies", "byPost", "pid"]);
  });
});
