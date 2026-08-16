import { defineConfig } from 'astro/config';

// ponytail: base path is '/repo-name/' for project pages, '/' for user pages or custom domain.
// Set via env var so CI doesn't need code edits per repo.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1] ?? 'portfolio';

export default defineConfig({
  site: 'https://example.github.io',
  base: process.env.BASE_URL ?? `/${repoName}/`,
});