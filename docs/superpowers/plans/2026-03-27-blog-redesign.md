# Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default Gatsby starter visual style with a warm sage-green earthy aesthetic — lifestyle blog feel, not a tech blog.

**Architecture:** All changes are purely visual (CSS + JSX markup). No new dependencies, no data layer changes, no content changes. We work through 5 files in order: CSS variables first, then layout shell, then individual page components.

**Tech Stack:** Gatsby, React, plain CSS custom properties. System UI font stack (no external font). Markdown posts with `tags[]` frontmatter — first tag used as category label.

---

## File Map

| File | What changes |
|------|-------------|
| `src/style.css` | Replace color vars + font vars; restyle prose, links, blockquote, code |
| `src/components/layout.js` | Replace conditional header with full-width sage nav bar |
| `src/components/bio.js` | Replace StaticImage avatar with CSS circle; restyle row |
| `src/pages/index.js` | Replace `<ol>` post list with stacked white cards |
| `src/templates/blog-post.js` | Add styled post header with accent rule; preserve TOC/Disqus/FB |

---

## How to verify

This is a visual redesign — there are no unit tests. Each task ends with a **visual check** step:

```bash
gatsby develop
```

Open `http://localhost:8000` and confirm what the step describes. If `gatsby develop` is already running, changes hot-reload automatically.

---

## Task 1: CSS — Design tokens and base typography

**Files:**
- Modify: `src/style.css` (`:root` block, `body`, `a`, `hr`, `blockquote`, `code`/`pre` rules)

- [ ] **Step 1: Replace the `:root` custom properties block**

Open `src/style.css`. Replace everything inside `:root { … }` with:

```css
:root {
  --maxWidth-wrapper: 42rem;

  /* Spacing scale (keep as-is — used by existing rules below) */
  --spacing-px: 1px;
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-32: 8rem;

  /* Font scale (keep — used by existing heading rules) */
  --fontWeight-normal: 400;
  --fontWeight-medium: 500;
  --fontWeight-semibold: 600;
  --fontWeight-bold: 700;
  --fontWeight-extrabold: 800;
  --fontWeight-black: 900;
  --fontSize-root: 16px;
  --lineHeight-none: 1;
  --lineHeight-tight: 1.1;
  --lineHeight-normal: 1.5;
  --lineHeight-relaxed: 1.625;
  --fontSize-0: 0.833rem;
  --fontSize-1: 1rem;
  --fontSize-2: 1.2rem;
  --fontSize-3: 1.44rem;
  --fontSize-4: 1.728rem;
  --fontSize-5: 2.074rem;
  --fontSize-6: 2.488rem;
  --fontSize-7: 2.986rem;

  /* Sage palette */
  --color-sage: #6b8f6e;
  --color-sage-light: #e8ede5;
  --color-sage-divider: #ddeadb;
  --color-bg: #f7f9f5;
  --color-surface: #ffffff;
  --color-heading: #1e2d1f;
  --color-text: #2e3829;
  --color-text-secondary: #4a6b4c;
  --color-text-muted: #8aaa8c;
  --color-card-shadow: rgba(107, 143, 110, 0.10);

  /* Font */
  --font-body: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-heading: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

- [ ] **Step 2: Update `body` and `hr` rules**

Find and replace the `body` rule and the `hr` rule in `src/style.css`:

```css
body {
  font-family: var(--font-body);
  font-size: var(--fontSize-1);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.8;
}

hr {
  background: var(--color-sage-divider);
  height: 1px;
  border: 0;
}
```

- [ ] **Step 3: Update link, blockquote, and code styles**

Find and replace these rules:

```css
a {
  color: var(--color-sage);
}

a:hover,
a:focus {
  text-decoration: underline;
}

blockquote {
  color: var(--color-text-secondary);
  margin-left: calc(-1 * var(--spacing-6));
  margin-right: var(--spacing-8);
  padding: var(--spacing-0) var(--spacing-0) var(--spacing-0) var(--spacing-6);
  border-left: 3px solid var(--color-sage);
  font-size: var(--fontSize-1);
  font-style: italic;
  margin-bottom: var(--spacing-8);
}

code {
  background: var(--color-sage-light);
  border-radius: 4px;
  padding: 0.15em 0.4em;
  font-size: 0.9em;
}

pre code {
  background: none;
  padding: 0;
  border-radius: 0;
}

.gatsby-highlight {
  background: var(--color-sage-light);
  border-radius: 6px;
  margin-bottom: var(--spacing-8);
  padding: var(--spacing-4);
  overflow: auto;
}
```

- [ ] **Step 4: Override heading color**

The existing heading rules reference CSS vars that no longer exist (`--color-heading-black`). Add this after the `:root` block to keep headings correct:

```css
h1 {
  font-weight: var(--fontWeight-black);
  font-size: var(--fontSize-6);
  color: var(--color-heading);
}

h2,
h3,
h4,
h5,
h6 {
  font-weight: var(--fontWeight-bold);
  color: var(--color-heading);
}
```

- [ ] **Step 5: Visual check**

Run `gatsby develop` and open `http://localhost:8000`. The page background should be off-white (`#f7f9f5`), body text dark green-brown (`#2e3829`), links sage green (`#6b8f6e`).

- [ ] **Step 6: Commit**

```bash
git add src/style.css
git commit -m "style: replace color palette and font stack with sage design tokens"
```

---

## Task 2: Layout — Sage nav bar

**Files:**
- Modify: `src/components/layout.js`
- Modify: `src/style.css` (add nav + footer classes)

The current `layout.js` renders either a big `<h1>` (home) or a small link (other pages) inside a padded wrapper. We replace it with a full-width sage nav bar consistent on every page. The `title` prop is no longer needed.

- [ ] **Step 1: Rewrite `src/components/layout.js`**

Replace the entire file contents with:

```jsx
import * as React from "react"
import { Link } from "gatsby"

const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div data-is-root-path={isRootPath}>
      <nav className="site-nav">
        <Link to="/" className="site-nav__logo">SHUBO</Link>
        <div className="site-nav__links">
          {isRootPath ? (
            <Link to="/about" className="site-nav__link">About</Link>
          ) : (
            <>
              <Link to="/" className="site-nav__link">&#8592; All posts</Link>
              <Link to="/about" className="site-nav__link">About</Link>
            </>
          )}
        </div>
      </nav>
      <main className="global-wrapper">
        {children}
      </main>
      <footer className="site-footer">
        &#169; {new Date().getFullYear()} Shubo
      </footer>
    </div>
  )
}

export default Layout
```

- [ ] **Step 2: Add nav and footer styles to `src/style.css`**

Add these rules at the end of `src/style.css`:

```css
/* Nav bar */
.site-nav {
  background-color: var(--color-sage);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
}

.site-nav__logo {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-bg);
  text-decoration: none;
  letter-spacing: 0.1em;
}

.site-nav__links {
  display: flex;
  gap: 1.25rem;
}

.site-nav__link {
  font-size: 0.75rem;
  color: rgba(247, 249, 245, 0.8);
  text-decoration: none;
  letter-spacing: 0.05em;
}

.site-nav__link:hover {
  color: var(--color-bg);
  text-decoration: none;
}

/* Global content wrapper */
.global-wrapper {
  margin: 0 auto;
  max-width: var(--maxWidth-wrapper);
  padding: var(--spacing-10) var(--spacing-5);
}

/* Footer */
.site-footer {
  text-align: center;
  padding: var(--spacing-8) var(--spacing-5);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-sage-divider);
}
```

- [ ] **Step 3: Update callers that pass `title` prop (no-op check)**

Search for `<Layout` across the codebase:

```bash
grep -r "<Layout" src/
```

The `title` prop is no longer used in `layout.js`. Existing callers that pass it (`<Layout location={location} title={siteTitle}>`) will still work — React ignores extra props. No changes needed in callers.

- [ ] **Step 4: Visual check**

Reload `http://localhost:8000`:
- Full-width sage nav bar at top, "SHUBO" left, "About" right
- On a post page: "← All posts" and "About" on the right
- No heading element below the nav bar

- [ ] **Step 5: Commit**

```bash
git add src/components/layout.js src/style.css
git commit -m "feat: add full-width sage nav bar, replace conditional header"
```

---

## Task 3: Bio — CSS circle avatar row

**Files:**
- Modify: `src/components/bio.js`
- Modify: `src/style.css` (replace `.bio` rules)

The current Bio uses Gatsby's `StaticImage` for the avatar. We replace it with a CSS circle showing the author's initial.

- [ ] **Step 1: Rewrite `src/components/bio.js`**

Replace the entire file contents with:

```jsx
import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
        }
      }
    }
  `)

  const author = data.site.siteMetadata?.author
  if (!author?.name) return null

  return (
    <div className="bio">
      <div className="bio-avatar" aria-hidden="true">
        {author.name.charAt(0).toUpperCase()}
      </div>
      <div className="bio-text">
        <strong className="bio-name">{author.name}</strong>
        {author.summary && (
          <span className="bio-summary">{author.summary}</span>
        )}
      </div>
    </div>
  )
}

export default Bio
```

- [ ] **Step 2: Replace bio styles in `src/style.css`**

Find the existing `.bio`, `.bio p`, `.bio-avatar` rules and replace them with:

```css
.bio {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: var(--spacing-6);
  margin-bottom: var(--spacing-8);
  border-bottom: 1px solid var(--color-sage-divider);
}

.bio-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-sage);
  color: var(--color-bg);
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bio-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.bio-name {
  font-size: 0.875rem;
  color: var(--color-heading);
}

.bio-summary {
  font-size: 0.8rem;
  color: var(--color-sage);
}
```

Also remove the `.global-wrapper[data-is-root-path="true"] .bio` rule if it still exists.

- [ ] **Step 3: Visual check**

On `http://localhost:8000`:
- Sage circle with "S" on the left
- "Shubo Chao" in dark text, summary in sage below it
- Sage-tinted divider line beneath the bio

- [ ] **Step 4: Commit**

```bash
git add src/components/bio.js src/style.css
git commit -m "feat: restyle bio with CSS circle avatar and sage divider row"
```

---

## Task 4: Home page — Stacked post cards

**Files:**
- Modify: `src/pages/index.js`
- Modify: `src/style.css` (add `.post-card` rules)

The current home page is an `<ol>` with `post-list-item` articles. We replace it with white rounded cards. The first tag in `tags[]` becomes the category label.

- [ ] **Step 1: Rewrite `src/pages/index.js`**

Replace the entire file contents with:

```jsx
import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Bio />
        <p>No blog posts found.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={siteTitle} url={data.site.siteMetadata?.siteUrl} />
      <Bio />
      <div className="post-card-list">
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const category = post.frontmatter.tags?.[0] || null
          const excerpt = post.frontmatter.description || post.excerpt

          return (
            <Link
              key={post.fields.slug}
              to={post.fields.slug}
              className="post-card"
            >
              <div className="post-card__meta">
                {category && (
                  <span className="post-card__category">{category}</span>
                )}
                <span className="post-card__date">{post.frontmatter.date}</span>
              </div>
              <h2 className="post-card__title">{title}</h2>
              <p className="post-card__excerpt">{excerpt}</p>
              <span className="post-card__read-more">Read more &#8594;</span>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`
```

- [ ] **Step 2: Add post card styles to `src/style.css`**

Add these rules at the end of `src/style.css`:

```css
/* Post card list */
.post-card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  display: block;
  background: var(--color-surface);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 1px 4px var(--color-card-shadow);
  text-decoration: none;
  transition: box-shadow 0.15s ease;
}

.post-card:hover {
  box-shadow: 0 3px 10px var(--color-card-shadow);
  text-decoration: none;
}

.post-card__meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.4rem;
}

.post-card__category {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-sage);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.post-card__date {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.post-card__category + .post-card__date::before {
  content: "\00B7";
  margin-right: 0.5rem;
  color: var(--color-text-muted);
}

.post-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.4rem 0;
  line-height: 1.3;
}

.post-card__excerpt {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__read-more {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
```

Also remove the old `.post-list-item`, `.post-list-item p`, `.post-list-item h2`, `.post-list-item header`, `.header-link-home`, `.global-header`, `.main-heading` rules from `src/style.css`.

- [ ] **Step 3: Visual check**

On `http://localhost:8000`:
- Bio row at top
- White rounded cards below, one per post
- Each card: `TAG · MMM DD, YYYY`, bold title, 2-line excerpt, "Read more →"
- Cards lift subtly on hover

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.js src/style.css
git commit -m "feat: replace post list with stacked white cards on home page"
```

---

## Task 5: Blog post page — Styled header with accent rule

**Files:**
- Modify: `src/templates/blog-post.js`
- Modify: `src/style.css` (add `.post-header` rules)

We restyle the post header. The TOC sidebar, article body, Disqus comments, Facebook widget, and prev/next nav are **preserved unchanged**.

- [ ] **Step 1: Update the post header block in `src/templates/blog-post.js`**

Find the `<header>` inside the `<article className="blog-post">`. It currently is:

```
<header>
  <h1 itemProp="headline">{post.frontmatter.title}</h1>
  <p>{post.frontmatter.date}</p>
  <p>
    分類標籤：{post.frontmatter.tags.map(...)}
  </p>
</header>
```

Replace only that `<header>` block with:

```jsx
<header className="post-header">
  <div className="post-header__meta">
    {post.frontmatter.tags?.[0] && (
      <span className="post-header__category">
        {post.frontmatter.tags[0]}
      </span>
    )}
    <span className="post-header__date">{post.frontmatter.date}</span>
  </div>
  <h1 className="post-header__title" itemProp="headline">
    {post.frontmatter.title}
  </h1>
  <p className="post-header__byline">Shubo</p>
  <div className="post-header__rule" />
  <p className="post-header__tags">
    {post.frontmatter.tags.map((tag, i) => (
      <React.Fragment key={i}>
        <Link to={`/tags/${kebabCase(tag)}`}>{tag}</Link>{" "}
      </React.Fragment>
    ))}
  </p>
</header>
```

All other code in `blog-post.js` stays exactly as-is.

- [ ] **Step 2: Add post header styles to `src/style.css`**

Add these rules at the end of `src/style.css`:

```css
/* Post header */
.post-header {
  margin-bottom: var(--spacing-8);
}

.post-header__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.post-header__category {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-sage);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.post-header__date {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.post-header__category + .post-header__date::before {
  content: "\00B7";
  margin-right: 0.5rem;
  color: var(--color-text-muted);
}

.post-header__title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1.3;
  margin: 0 0 0.4rem 0;
}

.post-header__byline {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0 0 0.75rem 0;
}

.post-header__rule {
  width: 28px;
  height: 3px;
  background-color: var(--color-sage);
  border-radius: 2px;
  margin-bottom: 0.75rem;
}

.post-header__tags {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0;
}

.post-header__tags a {
  color: var(--color-sage);
}

/* Post body */
.blog-post section {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text);
}

.blog-post h2,
.blog-post h3,
.blog-post h4 {
  color: var(--color-heading);
  margin-top: var(--spacing-10);
}
```

Also remove the old `.blog-post header`, `.blog-post header h1`, `.blog-post header p` rules from `src/style.css`.

- [ ] **Step 3: Visual check**

Open any post (`http://localhost:8000/blog/aws-intro`). You should see:
- `AWS · NOV 11, 2024` in small sage/muted caps
- Large bold title
- "Shubo" byline in muted text
- 28px sage accent rule
- Tag links below the rule
- TOC sidebar on wide screens still functional
- Disqus and Facebook widget still present below the article

- [ ] **Step 4: Commit**

```bash
git add src/templates/blog-post.js src/style.css
git commit -m "feat: add styled post header with sage accent rule"
```

---

## Task 6: Final pass — Remove dead CSS

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Delete unused rule blocks**

Remove the following selectors from `src/style.css` (no component references them after the rewrites above):

- `.global-header { … }`
- `.main-heading { … }`
- `.header-link-home { … }`
- `.post-list-item { … }`
- `.post-list-item p { … }`
- `.post-list-item h2 { … }`
- `.post-list-item header { … }`
- `.blog-post header { … }` (old block, now replaced by `.post-header`)
- `.blog-post header h1 { … }`
- `.blog-post header p { … }`
- `.global-wrapper[data-is-root-path="true"] .bio { … }`

- [ ] **Step 2: Visual check**

Reload home and a post page. Nothing should have changed visually.

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "style: remove unused legacy CSS classes after redesign"
```

---

## Done

Final visual checklist:

- [ ] Home page: sage nav, bio row with circle avatar, stacked post cards
- [ ] Post page: sage nav with "← All posts", styled post header, accent rule, readable body, TOC still functional, Disqus still present
- [ ] About page: sage nav and off-white background (inherits automatically — no file changes needed)
- [ ] No console errors in the browser
