# Artist Portfolio

Static artist portfolio built with Astro + TypeScript. Deploys to GitHub Pages via GitHub Actions.

## Run locally

```bash
npm install
npm run dev
```

Site at http://localhost:4321

## Add artwork

1. Drop the image into `public/images/art/`
2. Create a markdown file in `src/content/art/` with this frontmatter:

```yaml
---
title: "Untitled No. 4"
description: "Short description"
image: "images/art/your-image.jpg"
date: 2024-08-01
medium: "Oil on canvas"
dimensions: "24 x 36 in"
order: 1
---

Optional longer description in markdown here.
```

3. `git push` — the site rebuilds and deploys automatically.

The `order` field controls sort position (higher = first). Ties break by date (newer first).

## Deploy to GitHub Pages

1. Push the repo to GitHub.
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` handles build + deploy on every push to `main`/`master`.

The base path auto-detects from `GITHUB_REPOSITORY`. For a custom domain, set `site` in `astro.config.mjs` and `BASE_URL=/` as an env var in the workflow.

## Edit the About page

Edit `src/pages/about.astro` — add bio, artist statement, contact info.

## Stack

- Astro 4 — static output, zero client JS
- TypeScript — strict mode
- Content Collections — type-safe markdown content
- GitHub Actions — build + deploy to Pages