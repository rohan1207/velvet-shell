/**
 * Sync admin/data/seed.json product images from lib/products.js
 */
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../lib/products.js');
const seedPath = path.join(__dirname, '../admin/data/seed.json');

const src = fs.readFileSync(productsPath, 'utf8');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const bySlug = {};
const re =
  /\{\s*slug:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]*)"[\s\S]*?gallery:\s*(\[[\s\S]*?\])[\s\S]*?hoverImage:\s*"([^"]*)"/g;
let m;
while ((m = re.exec(src))) {
  const slug = m[1];
  const image = m[2];
  const gallery = [...m[3].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  const hoverImage = m[4];
  // skip collection/category objects that somehow match — only keep product-like paths
  if (!image.startsWith('/')) continue;
  bySlug[slug] = { image, gallery, hoverImage };
}

let n = 0;
if (Array.isArray(seed.products)) {
  seed.products = seed.products.map((p) => {
    const next = bySlug[p.slug];
    if (!next) return p;
    n += 1;
    return { ...p, image: next.image, hoverImage: next.hoverImage, gallery: next.gallery };
  });
}

let json = JSON.stringify(seed, null, 2);
// Rewrite any leftover catalog refs in seed to root heroes / wear
json = json
  .replace(
    /\/(earrings|necklace|bracelets|brooch|rings)\/catalog\/wear-([a-z0-9-]+)\.(jpe?g|png|webp)/gi,
    '/$1/$2-wear.$3',
  )
  .replace(
    /\/(earrings|necklace|bracelets|brooch|rings)\/catalog\/([a-z0-9-]+?)(?:-v\d+)?(?:-(\d+))?\.(jpe?g|png|webp)/gi,
    (full, folder, slug, num, ext) => {
      if (num) return `/${folder}/${slug}-${num}.${ext}`;
      return `/${folder}/${slug}-hero.${ext}`;
    },
  );

fs.writeFileSync(seedPath, json);
console.log('synced seed products:', n);
console.log('catalog leftovers:', (json.match(/\/catalog\//g) || []).length);
