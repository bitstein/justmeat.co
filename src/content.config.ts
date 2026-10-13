import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const markdown = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });

const archives = defineCollection({
  loader: markdown('archives'),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date().optional(),
    // Free-form date shown instead of `date`, e.g. "November 1935 – January 1936".
    special_date: z.string().optional(),
    // Byline shown instead of `author`; `author` still drives grouping.
    special_author: z.string().optional(),
    source: z.string().optional(),
    source_url: z.url().optional(),
    description: z.string().optional(),
    is_book: z.boolean().default(false),
  }),
});

const peoples = defineCollection({
  loader: markdown('peoples'),
  schema: z.object({
    title: z.string(),
    place: z.string(),
  }),
});

const wiki = defineCollection({
  loader: markdown('wiki'),
  schema: z.object({
    title: z.string(),
    categories: z.array(z.enum(['wiki', 'talk', 'special'])).default([]),
  }),
});

const home = defineCollection({
  loader: markdown('home'),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { archives, peoples, wiki, home };
