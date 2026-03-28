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

### Content

Blog posts live in `content/blog/`. Two formats:
- Flat file: `content/blog/post-name.md`
- Directory with assets: `content/blog/post-name/index.md` (use this when the post has images)

Post frontmatter fields: `title`, `date`, `description`, `tags` (array), `draft` (boolean — hides from build), `image` (for OG meta), `steps` (structured data for schema.org).

### Pages & Templates

| File | Purpose |
|------|---------|
| `src/pages/index.js` | Home page — Bio + stacked post cards |
| `src/templates/blog-post.js` | Individual post — TOC sidebar, article, Disqus, Facebook widget, prev/next nav |
| `src/templates/tags.js` | Tag archive pages at `/tags/<kebab-case>/` |
| `src/pages/tags.js` | All-tags index |
| `src/components/layout.js` | Full-width sage nav bar wrapping every page |
| `src/components/bio.js` | Author row with CSS circle avatar showing initial |

### Styling

All styles are in two files:
- `src/normalize.css` — CSS reset (imported in `gatsby-browser.js`)
- `src/style.css` — Everything else

`src/style.css` uses CSS custom properties defined in `:root`. Always use CSS custom properties from `:root` — no hardcoded colors.