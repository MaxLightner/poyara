import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/projects' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(20),
    category: z.string().min(1),
    role: z.string().min(1),
    evidenceUrl: z.url(),
    details: z.string().optional()
  })
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/insights' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(20),
    date: z.coerce.date(),
    topic: z.string().min(1)
  })
});

export const collections = { projects, insights };
