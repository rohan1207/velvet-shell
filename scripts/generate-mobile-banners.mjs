/**
 * LEGACY FALLBACK ONLY — simple attention crop of desktop banners.
 *
 * Prefer AI-recomposed phone banners (full product visible, nature scene intact,
 * portrait 9:16). Never run this with --force after AI regenerations, or crops
 * will overwrite them.
 *
 * Default: only fills MISSING /images/mobile/… files.
 * Force crop overwrite: node scripts/generate-mobile-banners.mjs --force
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const force = process.argv.includes('--force');

const EXTRA = [
  'images/category-banner-bracelets.jpg',
  'images/category-banner-brooches.jpg',
  'images/category-banner-earrings.jpg',
  'images/category-banner-gifting.jpg',
  'images/category-banner-necklaces.jpg',
  'images/category-banner-rings.jpg',
  'images/category-banner-shop.jpg',
  'images/hero-gifting-beach.jpg',
  'images/hero-gifting-nature-story.jpg',
  'images/hero-campaign.jpg',
  'images/home-slide-bee.jpg',
  'images/home-slide-calla.jpg',
  'images/home-slide-meadow.jpg',
  'images/home-slide-moss.jpg',
  'images/banner-slide-atelier.png',
  'images/banner-slide-offer.png',
  'images/banner-slide-unique.png',
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function collectSources() {
  const set = new Set();
  for (const file of walk(path.join(publicDir, 'images', 'banners'))) {
    set.add(path.relative(publicDir, file).replace(/\\/g, '/'));
  }
  for (const rel of EXTRA) {
    const full = path.join(publicDir, rel);
    if (fs.existsSync(full)) set.add(rel.replace(/\\/g, '/'));
  }
  return [...set].sort();
}

async function makeMobile(rel) {
  const input = path.join(publicDir, rel);
  const outRel = `images/mobile/${rel.replace(/^images\//, '')}`;
  const output = path.join(publicDir, outRel);

  if (!force && fs.existsSync(output)) {
    return { rel, outRel, skipped: true };
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  const meta = await sharp(input).metadata();
  const width = 1080;
  const height = 1920;

  let pipeline = sharp(input).rotate().resize(width, height, {
    fit: 'cover',
    position: 'attention',
  });

  const ext = path.extname(output).toLowerCase();
  if (ext === '.png') {
    await pipeline.png({ quality: 90, compressionLevel: 8 }).toFile(output);
  } else if (ext === '.webp') {
    await pipeline.webp({ quality: 88 }).toFile(output);
  } else {
    await pipeline.jpeg({ quality: 88, mozjpeg: true }).toFile(output);
  }

  return { rel, outRel, src: `${meta.width}x${meta.height}`, skipped: false };
}

async function main() {
  const sources = collectSources();
  console.log(
    force
      ? `FORCE crop overwrite for ${sources.length} banners (destroys AI recompositions)…`
      : `Fill missing phone banners only (${sources.length} sources). Existing files kept.`,
  );
  let ok = 0;
  let skip = 0;
  let fail = 0;
  for (const rel of sources) {
    try {
      const result = await makeMobile(rel);
      if (result.skipped) {
        skip += 1;
        console.log(`· skip (exists) ${result.rel}`);
      } else {
        ok += 1;
        console.log(`✓ ${result.rel} (${result.src}) → /${result.outRel}`);
      }
    } catch (err) {
      fail += 1;
      console.error(`✗ ${rel}: ${err.message}`);
    }
  }
  console.log(`Done. ${ok} created, ${skip} kept, ${fail} failed.`);
}

main();
