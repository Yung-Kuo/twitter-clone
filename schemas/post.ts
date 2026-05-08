import { z } from "zod";

/** Runtime validation at query boundaries (Phase 7). */
export const profileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  description: z.string().nullable(),
  avatar_url: z.string().nullable(),
  updated_at: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
});

export const postSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  text: z.string().nullable(),
  pictures: z.unknown().nullable(),
  reply_to: z.string().uuid().nullable(),
  type: z.string().nullable(),
  edited: z.boolean().nullable(),
  created_at: z.string(),
});

export const postWithMetaSchema = postSchema.extend({
  author: profileSchema.optional(),
  like_count: z.number().int().nonnegative().optional(),
  reply_count: z.number().int().nonnegative().optional(),
  repost_count: z.number().int().nonnegative().optional(),
  bookmark_count: z.number().int().nonnegative().optional(),
  is_liked_by_me: z.boolean().optional(),
  is_bookmarked_by_me: z.boolean().optional(),
});

export type ProfileDTO = z.infer<typeof profileSchema>;
export type PostDTO = z.infer<typeof postSchema>;
export type PostWithMetaDTO = z.infer<typeof postWithMetaSchema>;
