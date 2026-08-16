#!/usr/bin/env node
import { readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';

const IMAGES_DIR = 'public/images/art';
const CONTENT_DIR = 'src/content/art';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);

function cleanName(name) {
  return name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    || 'untitled';
}

function titleCase(str) {
  return str
    .split(/[-\s]+/)
    .map((word) => word ? word[0].toUpperCase() + word.slice(1) : '')
    .join(' ');
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else {
      yield path;
    }
  }
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function generate() {
  const artists = (await readdir(IMAGES_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  let created = 0;
  let skipped = 0;

  for (const artist of artists) {
    const artistPath = join(IMAGES_DIR, artist);
    const collections = (await readdir(artistPath, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const collection of collections) {
      const collectionPath = join(artistPath, collection);
      const seen = new Set();

      for await (const filePath of walk(collectionPath)) {
        const filename = filePath.slice(collectionPath.length + 1);
        const ext = extname(filename).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext)) continue;

        const base = cleanName(filename);
        let slug = base;
        let counter = 1;
        while (seen.has(slug)) {
          slug = `${base}-${counter++}`;
        }
        seen.add(slug);

        const contentPath = join(CONTENT_DIR, artist, collection, `${slug}.md`);
        if (await exists(contentPath)) {
          skipped++;
          continue;
        }

        const index = Array.from(seen).indexOf(slug) + 1;
        const title = `${titleCase(collection)} ${index}`;
        const imagePath = `images/art/${artist}/${collection}/${filename}`;
        const date = new Date().toISOString().split('T')[0];

        const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
artist: "${artist}"
collection: "${collection}"
image: "${imagePath.replace(/"/g, '\\"')}"
date: ${date}
order: 0
---

`;

        await mkdir(dirname(contentPath), { recursive: true });
        await writeFile(contentPath, frontmatter);
        created++;
      }
    }
  }

  console.log(`Created ${created} artwork entries, skipped ${skipped} existing.`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});