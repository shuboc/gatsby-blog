# Favicon Design Spec

**Date:** 2026-03-28
**Status:** Approved

## Goal

Replace the existing blank 2-color 16×16 `static/favicon.ico` with a sage-green leaf icon that matches the blog's visual identity.

## Visual Design

**Source:** 64×64 px SVG (`static/favicon.svg`)

| Property | Value |
|---|---|
| Canvas | 64×64 px square, 8px corner radius |
| Background | `#f7f9f5` (site background color) |
| Border | `#ddeadb` (sage divider color), 2px |
| Leaf fill | `#6b8f6e` (sage green) |
| Leaf orientation | Tilted ~35° counter-clockwise |
| Leaf shape | Oval with one end gently tapered (subtle tip) |
| Midrib vein | `#f7f9f5`, 2.5px, full length |
| Lateral veins | `#f7f9f5`, 1.5px, two pairs |

All colors are sourced from existing CSS custom properties in `src/style.css`.

## Generation

Tool: ImageMagick `convert`

Steps:
1. Write SVG to `static/favicon.svg`
2. Run ImageMagick to render the SVG at 16×16 and 32×32 px, pack both into a single ICO

```bash
convert -background none \
  -density 384 static/favicon.svg \
  -define icon:auto-resize=32,16 \
  static/favicon.ico
```

## Files Changed

| File | Action |
|---|---|
| `static/favicon.svg` | Create — SVG source, kept for future edits |
| `static/favicon.ico` | Replace — multi-size ICO (16×16 + 32×32) |

No changes needed to Gatsby config or layout — Gatsby serves `static/favicon.ico` automatically.

## Out of Scope

- `apple-touch-icon.png` / PWA manifest icons (not requested)
- Dark-mode variant
- Animated favicon
