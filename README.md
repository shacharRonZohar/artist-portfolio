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

## Edit content via web CMS (for non-technical editors)

The site uses [Pages CMS](https://pagescms.org) — a free, web-based editor that commits changes directly to this repo. No software to install.

### One-time setup (developer)

1. Invite the editor as a **collaborator** on the GitHub repo (Settings → Collaborators → Add people). They need **Write** access.
2. The `.pages.yml` config file at the repo root is already in place — nothing else to configure.

### For editors

1. Go to **[app.pagescms.org](https://app.pagescms.org)**
2. Sign in with GitHub (the account that was invited as collaborator)
3. Select this repository
4. Click **Artwork** in the sidebar
5. Edit any piece — change the title, swap the image, update the medium/dimensions, etc.
6. Click **Save** — Pages CMS commits to the repo, and the site rebuilds automatically within a minute

You can also add new artwork: click **New entry**, fill in the fields, and upload the image directly in the browser.

## Stack

- Astro 4 — static output, zero client JS
- TypeScript — strict mode
- Content Collections — type-safe markdown content
- Pages CMS — web-based content editing (no server, no database)
- GitHub Actions — build + deploy to Pages