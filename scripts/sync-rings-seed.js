const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../lib/products.js');
const seedPath = path.join(__dirname, '../admin/data/seed.json');

const src = fs.readFileSync(productsPath, 'utf8');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

// Pull ring product image blocks from products.js
const ringBlocks = [...src.matchAll(/\{\s*slug:\s*"([^"]+)"[\s\S]*?category:\s*"rings"[\s\S]*?care:\s*"[^"]*",\s*\}/g)];

const bySlug = {};
for (const m of ringBlocks) {
  const block = m[0];
  const slug = m[1];
  const image = (block.match(/image:\s*"([^"]+)"/) || [])[1];
  const hoverImage = (block.match(/hoverImage:\s*"([^"]+)"/) || [])[1];
  const galleryMatch = block.match(/gallery:\s*(\[[\s\S]*?\])/);
  let gallery = [];
  if (galleryMatch) {
    gallery = [...galleryMatch[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  }
  bySlug[slug] = { image, hoverImage, gallery };
}

let n = 0;
if (Array.isArray(seed.products)) {
  seed.products = seed.products.map((p) => {
    if (p.category !== 'rings' || !bySlug[p.slug]) return p;
    const next = bySlug[p.slug];
    n += 1;
    return {
      ...p,
      image: next.image,
      hoverImage: next.hoverImage,
      gallery: next.gallery,
    };
  });
}

// Also fix nested lookbook / testimonial style refs in seed if present
const json = JSON.stringify(seed, null, 2);
const replaced = json
  .replace(/\/rings\/catalog\/wear-([a-z0-9-]+)\.jpg/g, '/rings/$1-hero.jpg')
  .replace(/\/rings\/catalog\/([a-z0-9-]+)\.jpg/g, '/rings/$1-hero.jpg')
  .replace(/\/rings\/catalog\/([a-z0-9-]+)-(\d+)\.jpg/g, '/rings/$1-$2.jpg');

fs.writeFileSync(seedPath, replaced);
console.log('synced ring products in seed:', n);
