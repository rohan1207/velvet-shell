const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/rings');
const productsPath = path.join(__dirname, '../lib/products.js');

const files = fs
  .readdirSync(dir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !f.startsWith('_'));

const bySlug = {};
for (const f of files) {
  let m = f.match(/^(.+)-hero\.(jpe?g|png|webp)$/i);
  let slug;
  let idx;
  if (m) {
    slug = m[1];
    idx = 1;
  } else {
    m = f.match(/^(.+)-(\d+)\.(jpe?g|png|webp)$/i);
    if (!m) continue;
    slug = m[1];
    idx = Number(m[2]);
  }
  if (!bySlug[slug]) bySlug[slug] = [];
  bySlug[slug].push({ f, idx });
}

for (const slug of Object.keys(bySlug)) {
  bySlug[slug].sort((a, b) => a.idx - b.idx);
}

// Fold gold pink-gems variant into main pink-gems product gallery
if (bySlug['pink-gems-stone-ring-gold'] && bySlug['pink-gems-stone-ring']) {
  bySlug['pink-gems-stone-ring'].push(
    ...bySlug['pink-gems-stone-ring-gold'].map((x, i) => ({ f: x.f, idx: 100 + i })),
  );
}

let src = fs.readFileSync(productsPath, 'utf8');
let updated = 0;

for (const slug of Object.keys(bySlug)) {
  if (slug === 'pink-gems-stone-ring-gold') continue;
  const imgs = bySlug[slug].map((x) => `/rings/${x.f}`);
  if (!imgs.length) continue;

  const hero = imgs[0];
  const hover = imgs[1] || imgs[0];
  const galleryLiteral = `[\n${imgs.map((p) => `      "${p}"`).join(',\n')},\n    ]`;

  const escaped = slug.replace(/-/g, '\\-');
  const re = new RegExp(
    `(slug:\\s*"${escaped}"[\\s\\S]*?)(image:\\s*"[^"]*")([\\s\\S]*?)(gallery:\\s*\\[[\\s\\S]*?\\])([\\s\\S]*?)(hoverImage:\\s*"[^"]*")`,
  );

  if (!re.test(src)) {
    console.log('MISS', slug);
    continue;
  }

  src = src.replace(re, (_full, a, _imagePart, mid, _galleryPart, mid2) => {
    updated += 1;
    return `${a}image: "${hero}"${mid}gallery: ${galleryLiteral}${mid2}hoverImage: "${hover}"`;
  });
  console.log('OK', slug, imgs.length);
}

fs.writeFileSync(productsPath, src);
console.log('updated', updated);
