# About Page Design

**Date:** 2026-03-28

## Goal

Create a `/about` page that displays the author bio scaled up visually — a hero-style presentation of the same name + summary already shown in the home page bio strip.

## Scope

- New file: `src/pages/about.js`
- New CSS block: `.about-hero` in `src/style.css`
- No changes to `src/components/bio.js` or any other existing file

## Page Structure

Standard Gatsby page using the existing `Layout` and `Seo` components. No GraphQL page query needed beyond what's required for the layout title — reuse the `useStaticQuery` pattern from Bio or add a minimal page query.

Content is a single centered `.about-hero` section:

- **Avatar:** 80px circle, `--color-sage` background, large white initial (same as bio but 2× size)
- **Name:** `--fontSize-4` (1.728rem), `--fontWeight-bold`, `--color-heading`
- **Summary:** `--fontSize-2` (1.2rem), `--color-text-secondary`
- Layout: vertical stack, centered, generous vertical padding

## CSS

New `.about-hero`, `.about-hero__avatar`, `.about-hero__name`, `.about-hero__summary` classes added to `src/style.css`. All colors and font sizes use existing CSS custom properties from `:root` — no hardcoded values.

## What is NOT included

- No social links
- No contact info
- No extended written content
- No changes to the existing Bio component
