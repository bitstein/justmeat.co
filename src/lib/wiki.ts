import type { CollectionEntry } from 'astro:content';

type WikiEntry = CollectionEntry<'wiki'>;

const TALK_PREFIX = 'talk-';

export const wikiUrl = (entry: WikiEntry) => `/wiki/${entry.id}/`;
export const isTalk = (entry: WikiEntry) => entry.data.categories.includes('talk');
export const isSpecial = (entry: WikiEntry) => entry.data.categories.includes('special');

/** The article/talk pair a non-special wiki page belongs to. */
export function wikiTabs(entry: WikiEntry, all: WikiEntry[]) {
  const articleId = isTalk(entry) ? entry.id.slice(TALK_PREFIX.length) : entry.id;
  return {
    article: all.find((p) => p.id === articleId),
    talk: all.find((p) => p.id === TALK_PREFIX + articleId),
  };
}
