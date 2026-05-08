/** TanStack Query cache keys — single source of identity for server state. */

export const qk = {
  profiles: {
    byId: (id: string) => ["profiles", "byId", id] as const,
    all: ["profiles", "list"] as const,
  },
  posts: {
    feed: (kind: "all" | "following") => ["posts", "feed", kind] as const,
    byId: (id: string) => ["posts", "byId", id] as const,
    byUser: (uid: string) => ["posts", "byUser", uid] as const,
    withMetaFeed: (kind: "all" | "following") =>
      ["posts", "withMeta", "feed", kind] as const,
  },
  replies: {
    byPost: (pid: string) => ["replies", "byPost", pid] as const,
  },
};
