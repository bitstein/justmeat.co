import GithubSlugger from 'github-slugger';
import type { Heading, List, ListItem, Root } from 'mdast';
import type {} from 'mdast-util-to-hast'; // types `data.hProperties`
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

/**
 * Port of kramdown's automatic table of contents. A list whose only item is
 * `TOC` followed by `{:toc}` becomes `<ul id="markdown-toc">` listing every
 * heading in the document, except headings marked `{:.no_toc}`.
 */

const TOC_CLASS =
  "mb-4 inline-block max-w-64 list-decimal border border-neutral-400 p-2 pl-8 before:font-bold before:content-['Contents']";
const NESTED_CLASS = 'list-decimal pl-6';

const classesOf = (node: Heading) => {
  const className = node.data?.hProperties?.className;
  return Array.isArray(className) ? className.map(String) : String(className ?? '').split(/\s+/);
};

const isTocMarker = (node: List) =>
  node.children.length === 1 && /^TOC\s*(\{:toc\})?$/.test(toString(node).trim());

function tocList(headings: { depth: number; id: string; text: string }[], className: string): List {
  const list: List = { type: 'list', ordered: false, spread: false, children: [], data: { hProperties: { className } } };
  const stack: { depth: number; list: List }[] = [{ depth: 0, list }];
  for (const { depth, id, text } of headings) {
    while (stack.length > 1 && stack.at(-1)!.depth >= depth) stack.pop();
    const parent = stack.at(-1)!.list;
    const item: ListItem = {
      type: 'listItem',
      spread: false,
      children: [{ type: 'paragraph', children: [{ type: 'link', url: `#${id}`, children: [{ type: 'text', value: text }] }] }],
    };
    parent.children.push(item);
    const children: List = { type: 'list', ordered: false, spread: false, children: [], data: { hProperties: { className: NESTED_CLASS } } };
    item.children.push(children);
    stack.push({ depth, list: children });
  }
  // Drop the empty sub-lists created for leaf headings.
  visit(list, 'listItem', (item) => {
    item.children = item.children.filter((c) => c.type !== 'list' || c.children.length > 0);
  });
  return list;
}

export default function remarkKramdownToc() {
  return (tree: Root) => {
    const markers: { parent: { children: unknown[] }; index: number }[] = [];
    visit(tree, 'list', (node, index, parent) => {
      if (parent && index !== undefined && isTocMarker(node)) markers.push({ parent, index });
    });
    if (markers.length === 0) return;

    // Assign heading ids here so the links match; Astro keeps existing ids.
    const slugger = new GithubSlugger();
    const headings: { depth: number; id: string; text: string }[] = [];
    visit(tree, 'heading', (node) => {
      const text = toString(node);
      const id = slugger.slug(text);
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
      if (!classesOf(node).includes('no_toc')) headings.push({ depth: node.depth, id, text });
    });

    for (const { parent, index } of markers) parent.children[index] = tocList(headings, TOC_CLASS);
  };
}
