// content/config.ts
import { z } from 'astro:content';

const PostSchema = z.object({
  layout: z.string(),
  title: z.string(),
  publishDate: z.string(),
  author: z.string(),
  description: z.string().optional(),
});

export const collections = {
  posts: {
    schema: PostSchema,
  },
};
