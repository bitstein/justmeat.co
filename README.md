# Just Meat

[JustMeat.co](https://justmeat.co) curates resources on carnivorous eating, the paleolithic ketogenic diet and medicine, and zero-carb lifestyles.

The site is built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Setup

Prerequisites: [Bun](https://bun.sh) and Node.js 22.12 or later.

```sh
git clone https://github.com/bitstein/justmeat.co.git
cd justmeat.co
bun install
bun run dev
```

Open the site at `http://localhost:4321`.

| Command           | Action                                        |
| ----------------- | --------------------------------------------- |
| `bun run dev`     | Start the dev server                          |
| `bun run check`   | Type-check the code and validate frontmatter  |
| `bun run build`   | Build the static site into `dist/`            |
| `bun run preview` | Serve `dist/` locally                         |
| `bun run cf-typegen` | Regenerate Worker types after editing `wrangler.jsonc` |

## Content

All content is Markdown in `src/content/`. The schemas in `src/content.config.ts` define the frontmatter for each collection. The build fails if a file does not match its schema.

| Folder     | URL                | Notes                                                     |
| ---------- | ------------------ | --------------------------------------------------------- |
| `home`     | `/`                | The link lists on the home page                           |
| `archives` | `/archives/<file>/`| Republished articles, grouped by `author`                 |
| `peoples`  | `/peoples/<file>/` | Traditional peoples, grouped by `place`                   |
| `wiki`     | `/wiki/<file>/`    | `categories: [wiki]`, plus `talk` or `special` if needed  |

A wiki talk page is named `talk-<article>.md`. The article page links to it automatically.

The Markdown supports two kramdown conventions from the original Jekyll site:

- **Classes:** put an attribute list on the line after a block, for example `{:.text-center}`. Images can use `{: .wiki-image}` or `{: .wiki-image-centered-half}`, defined at the end of `src/styles/global.css`.
- **Table of contents:** a list containing only `* TOC` followed by `{:toc}` on the next line becomes a contents box listing the page's headings. To leave a heading out, put `{:.no_toc}` on the line after it.

Tables are styled automatically, so don't add classes to them.

Put images in `public/img/` and link to them with absolute paths, for example `/img/file.jpg`.

PDFs and ebooks are too large for the static build, so they live in the `justmeat-files` R2 bucket under `docs/`. A Worker serves them at `/docs/<file>`. To add one, upload it and then link to `/docs/<file>`:

```sh
bunx wrangler r2 object put justmeat-files/docs/<file>.pdf --file <path> --content-type application/pdf --remote
```

Use `application/epub+zip` for EPUB files. The dev server does not serve `/docs/`.

## Deploy

The site deploys as the `justmeat-co` Cloudflare Worker, configured in `wrangler.jsonc`. Cloudflare builds it from the Git repository with `bun run build` and deploys it with `wrangler deploy`.

- Static files in `dist/` are served directly, without running the Worker.
- Requests for `/docs/*` run `worker/index.ts`, which streams the file from R2. It supports range requests, which browser PDF viewers use to load large files.
- `public/_headers` sets long-term caching for the fingerprinted files in `/_astro/`.

For analytics, enable Cloudflare Web Analytics for the Worker in the Cloudflare dashboard. The code needs no change.

## Contributing

Contributions are welcome. To submit content, organization fixes, or theme updates, fork the repository and open a pull request, or open an issue.
