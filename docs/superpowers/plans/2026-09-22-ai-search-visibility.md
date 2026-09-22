# AI Search Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Emit `BlogPosting` JSON-LD and article-specific OG tags on every blog post page so AI-powered search tools (Perplexity, ChatGPT Search, Google AI Overviews) have structured signals to cite the blog.

**Architecture:** Two focused changes — `seo.js` gains new optional props and emits article-specific markup when `type="article"` is passed; `blog-post.js` extends its GraphQL query to fetch `gitAuthorTime` and an ISO-format date alias, then passes them to `<Seo>`. All other pages are unchanged.

**Tech Stack:** Gatsby 4, React, react-helmet, gatsby-transformer-remark, schema.org JSON-LD

**Spec:** `docs/superpowers/specs/2026-09-22-ai-search-visibility-design.md`

## Global Constraints

- No new npm dependencies
- No content/frontmatter files touched
- All existing `<Seo>` call sites (index, tags pages) must continue to work unchanged — new props are optional with safe defaults
- JSON-LD must be valid per schema.org/BlogPosting — validate at https://validator.schema.org
- `og:type` on non-article pages stays `"website"`

---

## File Map

| File | Change |
|------|--------|
| `src/components/seo.js` | Add `author.name` to useStaticQuery; add `type`, `datePublished`, `dateModified`, `keywords` props; make `og:type` dynamic; add `article:*` OG tags; add BlogPosting JSON-LD |
| `src/templates/blog-post.js` | Add `dateISO: date` alias + `fields { gitAuthorTime }` to GraphQL query; pass 4 new props to `<Seo>` |

---

## Task 1: Update SEO component

**Files:**
- Modify: `src/components/seo.js`

**Interfaces:**
- Produces: `<Seo type="article" datePublished="..." dateModified="..." keywords={[...]} />` — consumed by Task 2

### Steps

- [ ] **Step 1: Add `author.name` to the useStaticQuery in `seo.js`**

  The current query (lines 17–31) does not fetch `author`. Extend it:

  ```js
  graphql`
    query {
      site {
        siteMetadata {
          title
          siteUrl
          description
          author {
            name
          }
          social {
            twitter
          }
        }
      }
    }
  `
  ```

- [ ] **Step 2: Add four new optional props to the function signature**

  Current signature (line 15):
  ```js
  const Seo = ({ description, lang, meta, title, image, url, steps }) => {
  ```

  New signature:
  ```js
  const Seo = ({ description, lang, meta, title, image, url, steps, type, datePublished, dateModified, keywords }) => {
  ```

- [ ] **Step 3: Make `og:type` dynamic**

  In the `meta` array (around line 60–63), replace the hardcoded `og:type`:

  ```js
  // BEFORE:
  {
    property: `og:type`,
    content: `website`,
  },

  // AFTER:
  {
    property: `og:type`,
    content: type === `article` ? `article` : `website`,
  },
  ```

- [ ] **Step 4: Append article-specific OG tags when `type === "article"`**

  After the `.concat(meta)` call on line 88, article tags need to be spliced in. The cleanest approach is to build them as a separate array and concat before `meta`:

  ```js
  // Build just before the return statement, after metaDescription is defined:
  const articleMeta = type === `article` ? [
    {
      property: `article:published_time`,
      content: datePublished,
    },
    {
      property: `article:modified_time`,
      content: dateModified || datePublished,
    },
    ...(keywords || []).map(kw => ({
      property: `article:tag`,
      content: kw,
    })),
  ] : []
  ```

  Then in the `<Helmet>` `meta` prop, change:
  ```js
  // BEFORE:
  ].concat(meta)}

  // AFTER:
  ].concat(articleMeta).concat(meta)}
  ```

- [ ] **Step 5: Add BlogPosting JSON-LD block**

  Inside `<Helmet>`, after the existing `{steps && ...}` block (line 91–111), add:

  ```jsx
  {type === `article` && (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": metaDescription,
        "datePublished": datePublished,
        "dateModified": dateModified || datePublished,
        "url": url,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url,
        },
        "author": {
          "@type": "Person",
          "name": site.siteMetadata.author?.name || `shubo`,
        },
        ...(keywords && keywords.length > 0 && { "keywords": keywords }),
      })}
    </script>
  )}
  ```

- [ ] **Step 6: Update PropTypes**

  Replace the existing `Seo.propTypes` block (lines 122–127):

  ```js
  Seo.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf([`article`, `website`]),
    datePublished: PropTypes.string,
    dateModified: PropTypes.string,
    keywords: PropTypes.arrayOf(PropTypes.string),
  }
  ```

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/seo.js
  git commit -m "feat: add BlogPosting JSON-LD and article OG tags to SEO component"
  ```

---

## Task 2: Wire up blog-post template

**Files:**
- Modify: `src/templates/blog-post.js:134-185`

**Interfaces:**
- Consumes: `<Seo type datePublished dateModified keywords>` from Task 1
- `fields.gitAuthorTime` — ISO 8601 string from `gatsby-node.js` (format `%aI`, e.g. `"2020-01-15T10:23:00+08:00"`)
- `dateISO` — raw ISO date string from frontmatter (e.g. `"2020-01-15T00:00:00.000Z"`)

### Steps

- [ ] **Step 1: Add `dateISO` alias and `fields.gitAuthorTime` to the GraphQL query**

  In the `markdownRemark(id: { eq: $id })` query block (lines 149–167), add two fields:

  ```graphql
  markdownRemark(id: { eq: $id }) {
    id
    excerpt(pruneLength: 160)
    html
    tableOfContents
    fields {
      gitAuthorTime
    }
    frontmatter {
      title
      date(formatString: "MMMM DD, YYYY")
      dateISO: date
      description
      tags
      image {
        publicURL
      }
      steps {
        name
        text
      }
    }
  }
  ```

  Note: `dateISO: date` is a GraphQL field alias — it queries the same `date` field without a `formatString`, which returns the raw ISO string (e.g. `"2020-01-15T00:00:00.000Z"`).

- [ ] **Step 2: Pass new props to `<Seo>`**

  The existing `<Seo>` call is at lines 52–58:

  ```jsx
  // BEFORE:
  <Seo
    title={post.frontmatter.title}
    description={post.frontmatter.description || post.excerpt}
    image={post.frontmatter.image && data.site.siteMetadata.siteUrl + post.frontmatter.image?.publicURL}
    url={data.site.siteMetadata?.siteUrl + location.pathname}
    steps={post.frontmatter.steps}
  />

  // AFTER:
  <Seo
    title={post.frontmatter.title}
    description={post.frontmatter.description || post.excerpt}
    image={post.frontmatter.image && data.site.siteMetadata.siteUrl + post.frontmatter.image?.publicURL}
    url={data.site.siteMetadata?.siteUrl + location.pathname}
    steps={post.frontmatter.steps}
    type="article"
    datePublished={post.frontmatter.dateISO}
    dateModified={post.fields.gitAuthorTime}
    keywords={post.frontmatter.tags}
  />
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/templates/blog-post.js
  git commit -m "feat: pass datePublished, dateModified, keywords to SEO on blog posts"
  ```

---

## Task 3: Build and verify

**Files:** None modified

### Steps

- [ ] **Step 1: Run production build**

  ```bash
  npm run build
  ```

  Expected: build completes without errors. If Gatsby warns about unrecognised field `fields.gitAuthorTime`, add `gitAuthorTime: String` to the `Fields` type in `gatsby-node.js`:

  ```js
  type Fields {
    slug: String
    gitAuthorTime: String
  }
  ```

- [ ] **Step 2: Inspect a generated post HTML file**

  Find any post HTML file in `public/`:
  ```bash
  find public -name 'index.html' | grep -v '^public/index.html' | head -1
  ```

  Then check for the four expected signals:
  ```bash
  # Should output: <meta property="og:type" content="article"/>
  grep 'og:type' public/<post-path>/index.html

  # Should output article:published_time and article:modified_time lines
  grep 'article:' public/<post-path>/index.html

  # Should output the BlogPosting JSON-LD block
  grep -A 20 'application/ld+json' public/<post-path>/index.html | grep BlogPosting
  ```

- [ ] **Step 3: Validate the JSON-LD**

  Extract the JSON-LD from any post's HTML and paste it at https://validator.schema.org — should show zero errors for `BlogPosting`.

  Alternatively use Google's Rich Results Test at https://search.google.com/test/rich-results for the live URL after deploy.

- [ ] **Step 4: Confirm homepage is unchanged**

  ```bash
  grep 'og:type' public/index.html
  # Expected: content="website"  (NOT "article")

  grep 'BlogPosting' public/index.html
  # Expected: no output (JSON-LD not emitted on homepage)
  ```

- [ ] **Step 5: Final commit (if Step 1 required gatsby-node.js fix)**

  Only commit if `gatsby-node.js` was modified in Step 1:
  ```bash
  git add gatsby-node.js
  git commit -m "fix: add gitAuthorTime to Fields schema type definition"
  ```
