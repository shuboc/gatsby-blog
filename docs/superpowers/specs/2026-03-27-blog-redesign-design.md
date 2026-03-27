# Blog Redesign — Design Spec
**Date:** 2026-03-27
**Status:** Approved

---

## Overview

Redesign the Gatsby blog's visual style from the default Gatsby starter to a warm, earthy, lifestyle-blog aesthetic. The goal is a site that feels personal, readable, and distinctive — not a stereotypical dark/blue tech blog.

---

## Design System

### Colors
| Role | Value | Usage |
|------|-------|-------|
| Primary (Sage) | `#6b8f6e` | Nav bar background, accents, category labels, the accent rule under titles |
| Background | `#f7f9f5` | Page background |
| Surface | `#ffffff` | Post cards |
| Text — heading | `#1e2d1f` | Post titles, section headings |
| Text — body | `#2e3829` | Article body copy |
| Text — secondary | `#4a6b4c` | Post excerpts |
| Text — muted | `#8aaa8c` | Dates, read time, metadata |
| Card shadow | `rgba(107,143,110,0.10)` | Subtle lift on white cards |
| Divider | `#ddeadb` | Bio row bottom border, horizontal rules |
| Code block bg | `#e8ede5` | Inline and fenced code blocks |

### Typography
- **Font:** System UI stack (`system-ui, -apple-system, sans-serif`) — no external font load
- **Nav / labels / metadata:** `font-size: 0.75rem`, `letter-spacing: 0.1em`, `text-transform: uppercase`
- **Post title (list):** `font-size: 1.1rem`, `font-weight: 700`
- **Post title (article):** `font-size: 1.75rem`, `font-weight: 800`, `line-height: 1.3`
- **Body copy:** `font-size: 1rem`, `line-height: 1.8`
- **Excerpt / secondary:** `font-size: 0.875rem`, `color: #4a6b4c`

---

## Pages

### Home Page (`/`)

**Structure (top to bottom):**
1. **Nav bar** — full-width sage `#6b8f6e` bar; left: "SHUBO" logotype in bold caps; right: "Writing" and "About" links in muted white
2. **Bio row** — avatar circle (sage fill, white initial), name + one-line summary; separated from cards by a `#ddeadb` rule
3. **Post list** — vertically stacked white cards, `border-radius: 8px`, soft sage shadow
   - Each card: category + date (muted caps), title (bold), excerpt (2 lines), read-time "→"
   - No pagination initially; show all posts, newest first

### Post Page (`/blog/:slug`)

**Structure (top to bottom):**
1. **Nav bar** — identical sage bar; right links become "← All posts" and "About"
2. **Post header** — category + date label, large bold title, author + read-time line, 28px sage accent rule (`height: 3px`)
3. **Body content** — standard Markdown rendering with overrides:
   - `h2` / `h3`: dark `#1e2d1f`, heavier weight
   - `code` / `pre`: sage-tinted background `#e8ede5`, rounded corners
   - Links: sage `#6b8f6e`, underline on hover
   - Block quotes: left border in sage, italic body
4. **Footer** — simple centered bio repeat + link back to all posts

### About Page (`/about`)
- Existing page; style updated to match new design system (same nav, same background, same typography).

---

## Component Changes

| File | Change |
|------|--------|
| `src/style.css` | Replace CSS custom properties with new sage palette and system-ui font stack |
| `src/components/layout.js` | Add sage nav bar markup and styles |
| `src/components/bio.js` | Restyle to match bio row design (avatar circle, one-line summary) |
| `src/pages/index.js` | Replace post list markup with stacked card layout |
| `src/templates/blog-post.js` | Add post header block with accent rule; update body styles |

---

## Out of Scope
- Dark mode
- Search / filtering by tag
- Pagination (post count is small)
- Any changes to content or Markdown files
- RSS feed or SEO changes
