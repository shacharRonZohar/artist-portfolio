import { defineCollection, z } from 'astro:content';

const art = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string(),
    date: z.coerce.date(),
    medium: z.string().optional(),
    dimensions: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { art };