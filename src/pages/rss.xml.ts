import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION } from '../consts';

export const GET: APIRoute = async ({ site }) => {
  const archives = await getCollection('archives', (a) => a.data.date !== undefined);
  return rss({
    title: 'Just Meat',
    description: SITE_DESCRIPTION,
    site: site!,
    items: archives
      .map((a) => ({ article: a, date: a.data.date! }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(({ article, date }) => ({
        title: article.data.title,
        pubDate: date,
        description: article.data.description,
        link: `/archives/${article.id}/`,
        author: article.data.author,
      })),
  });
};
