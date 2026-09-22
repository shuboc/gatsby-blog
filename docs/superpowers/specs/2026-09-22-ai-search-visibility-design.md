# AI Search Visibility — Design Spec

**Date:** 2026-09-22  
**Goal:** Improve citation rate in AI-powered search tools (ChatGPT Search, Perplexity, Google AI Overviews) by surfacing structured signals already latent in the build pipeline.

---

## Problem

The blog posts at shubo.io lack machine-readable article metadata that AI crawlers use for citation decisions:

- No JSON-LD structured data for articles (only sparse HTML microdata)
- `og:type` is `"website"` on all pages, including blog posts
- No `article:published_time` / `article:modified_time` OG tags
- `fields.gitAuthorTime` is computed at build time in `gatsby-node.js` but never queried in the blog post template — a free freshness signal going unused
- No posts have a `description` frontmatter field; meta descriptions fall back to the site-level description

---

## Scope

Two files only:

- `src/components/seo.js` — add JSON-LD injection + new article-specific meta tags
- `src/templates/blog-post.js` — extend GraphQL query + pass new props to `<SEO>`

No content files are touched. No new dependencies.

---

## Data Flow

```
gatsby-node.js
  └─ computes fields.gitAuthorTime (git log -1) for each post

blog-post.js (GraphQL query)
  └─ frontmatter { title, date, description, tags, image }   ← existing
  └─ excerpt                                                  ← ADD
  └─ fields { gitAuthorTime }                                 ← ADD

blog-post.js (JSX)
  └─ <SEO
       type="article"
       datePublished={frontmatter.date}
       dateModified={fields.gitAuthorTime}
       keywords={frontmatter.tags}
       description={frontmatter.description || excerpt}
     />

seo.js
  └─ emits og:type="article"
  └─ emits article:published_time, article:modified_time
  └─ emits <script type="application/ld+json"> BlogPosting schema
```

---

## SEO Component — New Props

| Prop | Type | Default | Used when |
|------|------|---------|-----------|
| `type` | `"article" \| "website"` | `"website"` | Always |
| `datePublished` | ISO date string | — | `type === "article"` |
| `dateModified` | ISO date string | — | `type === "article"` |
| `keywords` | `string[]` | — | `type === "article"` |

All existing props and behavior unchanged. Other pages (index, tag pages) pass no `type` prop and are unaffected.

---

## New Meta Tags (article pages only)

```html
<meta property="og:type" content="article" />
<meta property="article:published_time" content="<frontmatter.date>" />
<meta property="article:modified_time" content="<fields.gitAuthorTime>" />
<meta property="article:tag" content="<tag>" />  <!-- one per tag -->
```

---

## JSON-LD BlogPosting Schema

Injected via `<script type="application/ld+json">` in `<head>` for article pages only:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "<title>",
  "description": "<description | excerpt | siteDescription>",
  "datePublished": "<frontmatter.date>",
  "dateModified": "<fields.gitAuthorTime | frontmatter.date>",
  "url": "<canonical url>",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "<canonical url>"
  },
  "author": {
    "@type": "Person",
    "name": "shubo"
  },
  "keywords": ["tag1", "tag2"]
}
```

**Fallback rules:**
- `dateModified` → `gitAuthorTime` if available, otherwise `frontmatter.date`
- `description` → `frontmatter.description` → `excerpt` → `siteMetadata.description`
- `keywords` field omitted from JSON-LD if `tags` is empty or undefined

---

## What Is Not Changed

- HTML microdata attributes on `<article>` in `blog-post.js` — kept as-is (no conflict)
- `og:type` on non-article pages — stays `"website"`
- All existing SEO props (`image`, `lang`, `meta`, `steps`) — unchanged
- No blog post content files touched

---

## Verification

After build (`npm run build`), inspect a post's `<head>` for:

1. `<meta property="og:type" content="article">`
2. `<meta property="article:published_time" ...>`
3. `<meta property="article:modified_time" ...>`
4. `<script type="application/ld+json">` containing `"@type": "BlogPosting"`
5. Validate JSON-LD at schema.org/validator or Google Rich Results Test
