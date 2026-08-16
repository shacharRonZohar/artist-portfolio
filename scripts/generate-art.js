import { readdir, stat, mkdir, writeFile, rm } from 'node:fs/promises';
import { join, extname } from 'node:path';

const IMAGES_DIR = 'public/images/art';
const CONTENT_DIR = 'src/content/art';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);

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

async function cleanupContentDir(artist) {
  const artistContentDir = join(CONTENT_DIR, artist);
  if (!(await exists(artistContentDir))) return;
  for (const entry of await readdir(artistContentDir, { withFileTypes: true })) {
    const path = join(artistContentDir, entry.name);
    if (entry.isDirectory()) {
      await rm(path, { recursive: true, force: true });
    } else if (entry.name.endsWith('.md')) {
      // Only remove generated entries, keep manually named files if needed.
      // For now, remove all .md at artist level so we can regenerate with consistent names.
      await rm(path, { force: true });
    }
  }
}

async function generate() {
  const artists = (await readdir(IMAGES_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  let created = 0;
  let skipped = 0;

  for (const artist of artists) {
    await cleanupContentDir(artist);
    await mkdir(join(CONTENT_DIR, artist), { recursive: true });

    const artistPath = join(IMAGES_DIR, artist);
    const collections = (await readdir(artistPath, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const collection of collections) {
      const collectionPath = join(artistPath, collection);
      let index = 0;

      for await (const filePath of walk(collectionPath)) {
        const filename = filePath.slice(collectionPath.length + 1);
        const ext = extname(filename).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext)) continue;

        index++;
        const slug = `${collection}-${index}`;
        const contentPath = join(CONTENT_DIR, artist, `${slug}.md`);
        if (await exists(contentPath)) {
          skipped++;
          continue;
        }

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