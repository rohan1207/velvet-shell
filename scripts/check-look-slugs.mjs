import fs from 'fs';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const assets = path.join(
  process.env.USERPROFILE || '',
  '.cursor',
  'projects',
  'c-Projects-Velvel-shell',
  'assets',
);
const images = path.join(process.cwd(), 'public', 'images');
mkdirSync(images, { recursive: true });

for (const name of ['look-ear-wrist.jpg', 'look-collar-lapel.jpg']) {
  const src = path.join(assets, name);
  const dest = path.join(images, name);
  if (!existsSync(src)) {
    console.warn('missing asset', name);
    continue;
  }
  copyFileSync(src, dest);
  console.log('copied', name);
}

const s = fs.readFileSync('lib/products.js', 'utf8');
for (const slug of [
  'phalaenopsis-hoop-earrings',
  'flower-in-the-rain-pink',
  'flower-adjustable-ring-silver',
  'flower-in-the-rain-necklace-pink',
  'calla-lily-brooch-gold',
  'flower-adjustable-ring',
]) {
  console.log(slug, s.includes(`slug: "${slug}"`) ? 'OK' : 'MISSING');
}
