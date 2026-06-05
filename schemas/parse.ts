import { z } from "zod";
import {
  postWithMetaSchema,
  profileSchema,
  type PostWithMetaDTO,
  type ProfileDTO,
} from "~/schemas/post";

const postsWithMetaArraySchema = z.array(postWithMetaSchema);

const likePickSchema = z.object({ post_id: z.string().uuid() });
const bookmarkPickSchema = z.object({ post_id: z.string().uuid() });

export function parsePostsWithMetaRows(data: unknown): PostWithMetaDTO[] {
  return postsWithMetaArraySchema.parse(data ?? []);
}

export function parseProfileRow(data: unknown): ProfileDTO {
  return profileSchema.parse(data);
}

export function parseProfileRowNullable(data: unknown): ProfileDTO | null {
  if (data == null) return null;
  const result = profileSchema.safeParse(data);
  if (!result.success) return null;
  const p = result.data;
  return {
    ...p,
    updated_at: p.updated_at ?? null,
    created_at: p.created_at ?? null,
  };
}

export function parseEngagementPayload(data: unknown) {
  return z
    .object({
      likes: z.array(likePickSchema),
      bookmarks: z.array(bookmarkPickSchema),
    })
    .parse(data);
}
