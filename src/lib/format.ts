const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  // Frontmatter dates are parsed as UTC midnight; formatting them in the build
  // machine's zone would shift them a day earlier in the Americas.
  timeZone: 'UTC',
});

export const formatDate = (date: Date) => dateFormat.format(date);

/** Group items by key, with keys sorted alphabetically. */
export function groupSorted<T>(items: T[], key: (item: T) => string): [string, T[]][] {
  return Object.entries(Object.groupBy(items, key))
    .map(([k, group]): [string, T[]] => [k, group ?? []])
    .sort(([a], [b]) => a.localeCompare(b));
}

export const byTitle = <T extends { data: { title: string } }>(a: T, b: T) =>
  a.data.title.localeCompare(b.data.title);
