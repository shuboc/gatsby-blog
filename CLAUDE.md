# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run develop    # Start dev server at http://localhost:8000 (hot reload)
npm run build      # Production build
npm run serve      # Serve production build locally
npm run clean      # Clear Gatsby cache (use when things break unexpectedly)
npm run format     # Prettier format all JS/JSON/MD files
npm run lint       # ESLint check on src/**/*.js
```

There are no automated tests. Visual verification via `gatsby develop` is the expected workflow.

## Architecture

**Gatsby 4** static site blog. Content is Markdown; all styling is plain CSS.

### Data Flow

```
content/blog/**/*.md
  → gatsby-source-filesystem (reads files)
  → gatsby-transformer-remark (parses MD → GraphQL)
  → onCreateNode (adds slug + gitAuthorTime fields)
  → createPages (generates post pages + tag archive pages)
```

`gatsby-node.js` runs `git log -1` on each post at build time to get a last-modified timestamp — this is stored as `fields.gitAuthorTime` and used by the sitemap plugin for SEO.

### Content

Blog posts live in `content/blog/`. Two formats:
- Flat file: `content/blog/post-name.md`
- Directory with assets: `content/blog/post-name/index.md` (use this when the post has images)

Post frontmatter fields: `title`, `date`, `description`, `tags` (array), `draft` (boolean — hides from build), `image` (for OG meta), `steps` (structured data for schema.org HowTo).

Tag URLs are generated with `lodash.kebabCase`: a tag `"My Topic"` becomes `/tags/my-topic/`.

### Pages & Templates

| File | Purpose |
|------|---------|
| `src/pages/index.js` | Home page — Bio + stacked post cards |
| `src/templates/blog-post.js` | Individual post — TOC sidebar, article, Disqus, Facebook widget, prev/next nav |
| `src/templates/tags.js` | Tag archive pages at `/tags/<kebab-case>/` |
| `src/pages/tags.js` | All-tags index |
| `src/components/layout.js` | Full-width sage nav bar wrapping every page |
| `src/components/bio.js` | Author row with CSS circle avatar showing initial |
| `src/components/seo.js` | `react-helmet` wrapper; supports `steps` prop for schema.org HowTo markup |

### Styling

All styles are in two files:
- `src/normalize.css` — CSS reset (imported in `gatsby-browser.js`)
- `src/style.css` — Everything else

`src/style.css` uses CSS custom properties defined in `:root`. Always use CSS custom properties from `:root` — no hardcoded colors.

Key custom properties:
- `--color-sage: #6b8f6e` — primary accent (nav bar, links, borders)
- `--color-bg: #f7f9f5` — page background
- `--color-heading: #1e2d1f` — headings
- `--color-text: #2e3829` — body text
- `--maxWidth-wrapper: 42rem` — content column width
