# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `/about` page with a centered hero-style bio (large avatar, name, summary) using existing CSS custom properties.

**Architecture:** New Gatsby page at `src/pages/about.js` pulls author data via `useStaticQuery` (same as Bio). New `.about-hero` CSS block in `src/style.css`. No changes to existing components.

**Tech Stack:** Gatsby 4, React, plain CSS custom properties.

---

### Task 1: Add `.about-hero` CSS

**Files:**
- Modify: `src/style.css` (append after `.bio-summary` block, around line 323)

- [ ] **Step 1: Add the CSS block**

In `src/style.css`, append after the `.bio-summary` closing brace (after line 323):

```css
/* About page */

.about-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-16) var(--spacing-0);
  gap: var(--spacing-6);
}

.about-hero__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-sage);
  color: var(--color-bg);
  font-size: var(--fontSize-4);
  font-weight: var(--fontWeight-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.about-hero__name {
  font-size: var(--fontSize-4);
  font-weight: var(--fontWeight-bold);
  color: var(--color-heading);
  margin: var(--spacing-0);
}

.about-hero__summary {
  font-size: var(--fontSize-2);
  color: var(--color-text-secondary);
  margin: var(--spacing-0);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/style.css
git commit -m "style: add about-hero CSS for about page"
```

---

### Task 2: Create the About page

**Files:**
- Create: `src/pages/about.js`

- [ ] **Step 1: Create the file**

```jsx
import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const AboutPage = ({ location }) => {
  const data = useStaticQuery(graphql`
    query AboutQuery {
      site {
        siteMetadata {
          title
          siteUrl
          author {
            name
            summary
          }
        }
      }
    }
  `)

  const { title, siteUrl, author } = data.site.siteMetadata

  return (
    <Layout location={location} title={title}>
      <Seo title="About" url={siteUrl + "/about/"} />
      <div className="about-hero">
        <div className="about-hero__avatar" aria-hidden="true">
          {author.name.charAt(0).toUpperCase()}
        </div>
        <p className="about-hero__name">{author.name}</p>
        {author.summary && (
          <p className="about-hero__summary">{author.summary}</p>
        )}
      </div>
    </Layout>
  )
}

export default AboutPage
```

- [ ] **Step 2: Verify visually**

Run: `npm run develop`

Visit: `http://localhost:8000/about`

Expected: centered 80px sage-green circle with "S" initial, bold name below, summary in muted green. Nav shows "← All posts" and "About" links.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.js
git commit -m "feat: add /about page with hero bio layout"
```
