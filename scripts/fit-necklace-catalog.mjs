/**
 * Fit all public/necklace photos to 4:5 cover + emit SKU map
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.join(process.cwd(), 'public', 'necklace');
const OUT = path.join(process.cwd(), 'public', 'necklace', 'catalog');
const W = 1200;
const H = 1500;

const norm = (s) =>
  s
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const skus = [
  {
    slug: 'bamboo-charm-necklace',
    name: 'Bamboo Charm Necklace',
    badge: 'Nature',
    metal: ['S925 Silver'],
    price: 3180,
    limited: false,
    collection: 'private-atelier',
    description:
      'A fine chain with a bamboo charm — slender segments, quiet green memory in metal.',
    story: 'Bamboo that never breaks the line.',
    details: ['Bamboo charm', 'Fine chain', 'Handmade'],
    match: (b) => norm(b) === 'bamboo charm necklace',
    preferredDefault: (f) => /Bamboo charm necklace\.jpg$/i.test(f) || /Bamboo charm necklace\(1\)\.jpg$/i.test(f),
  },
  {
    slug: 'bamboo-charm-necklace-gold',
    name: 'Bamboo Charm Necklace — Gold',
    badge: 'Nature',
    metal: ['18K Gold plated'],
    price: 3380,
    limited: false,
    collection: 'gilded-tide',
    description:
      'The bamboo charm necklace in warm gold — same slender segments, richer light.',
    story: 'Gold for quieter evenings.',
    details: ['Gold-toned charm', 'Fine chain', 'Handmade'],
    match: (b) => norm(b) === 'bamboo charm necklace(gold)',
    preferredDefault: (f) => /Bamboo charm necklace\(gold\)\.jpg$/i.test(f),
  },
  {
    slug: 'bamboo-charm-necklace-silver',
    name: 'Bamboo Charm Necklace — Silver',
    badge: 'Nature',
    metal: ['S925 Silver'],
    price: 3280,
    limited: false,
    collection: 'pearls-of-nacre',
    description:
      'The bamboo charm in cool silver — crisp segments, everyday light.',
    story: 'Silver bamboo for daylight.',
    details: ['S925 silver', 'Bamboo charm', 'Handmade'],
    match: (b) => norm(b) === 'bamboo charm necklace(silver)',
    preferredDefault: (f) => /Bamboo charm necklace\(silver\)\.jpg$/i.test(f),
  },
  {
    slug: 'flower-in-the-rain-necklace-pink',
    name: 'Flower In The Rain Necklace — Pink',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 4280,
    limited: true,
    collection: 'pearls-of-nacre',
    description:
      'A silver branch pendant holding a translucent pink bloom — carved petals, tiny stamens, two fine leaves.',
    story: 'A flower caught after rain, worn close to the collarbone.',
    details: ['Translucent pink flower', 'Branch pendant', 'S925 silver', 'Handmade'],
    match: (b) => norm(b) === 'flower in the rain(pink)' || norm(b) === 'flower in the rain',
    preferredDefault: (f) => /flower in the rain\(pink\)/i.test(f) && !/\(\d+\)/.test(f.replace(/\(pink\)/i, '')),
  },
  {
    slug: 'flower-in-the-rain-necklace-white',
    name: 'Flower In The Rain Necklace — White',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 4280,
    limited: true,
    collection: 'pearls-of-nacre',
    description:
      'The same branch motif with a frosted white flower — cool, luminous, quietly botanical.',
    story: 'White bloom after rain.',
    details: ['Frosted white flower', 'Branch pendant', 'S925 silver', 'Handmade'],
    match: (b) =>
      norm(b) === 'flower in the rain(white)' || norm(b) === 'flower in the rain(white)',
    preferredDefault: (f) => /[Ff]lower in the [Rr]ain\(white\)/i.test(f) && !/\(\d+\)/.test(f.replace(/\(white\)/i, '')),
  },
  {
    slug: 'fresh-redbud-bell-necklace',
    name: 'Fresh Redbud Bell Necklace',
    badge: 'Floral',
    metal: ['S925 Silver', 'Gold accent'],
    price: 4680,
    limited: true,
    collection: 'private-atelier',
    description:
      'Redbud bell blooms on a fine chain — soft petals, botanical fall at the chest.',
    story: 'Spring bells, held still.',
    details: ['Redbud bell motif', 'Fine chain', 'Handmade'],
    match: (b) => norm(b).startsWith('fresh redbud bell'),
    preferredDefault: (f) => /Fresh Redbud Bell\.jpg$/i.test(f),
  },
  {
    slug: 'hollow-butterfly-pendant-gold',
    name: 'Hollow Butterfly Pendant — Gold',
    badge: 'Nature',
    metal: ['18K Gold plated'],
    price: 3980,
    limited: false,
    collection: 'gilded-tide',
    description:
      'A hollow-out butterfly pendant in gold — open wings, light moving through filigree.',
    story: 'Wings drawn as architecture.',
    details: ['Hollow butterfly', 'Gold-toned', 'Fine chain', 'Handmade'],
    match: (b) => norm(b) === 'hollow out butterfly pedant(gold)',
    preferredDefault: (f) => /Hollow out butterfly pedant\(gold\)\.jpg$/i.test(f),
  },
  {
    slug: 'hollow-butterfly-pendant-silver',
    name: 'Hollow Butterfly Pendant — Silver',
    badge: 'Nature',
    metal: ['S925 Silver'],
    price: 3780,
    limited: false,
    collection: 'private-atelier',
    description:
      'A hollow-out butterfly pendant in silver — open wings, cool filigree light.',
    story: 'Silver wings for quieter rooms.',
    details: ['Hollow butterfly', 'S925 silver', 'Fine chain', 'Handmade'],
    match: (b) =>
      norm(b) === 'hollow out butterfly pedant(silver)' ||
      norm(b) === 'hollow out butterfly pedant',
    preferredDefault: (f) =>
      /Hollow out butterfly pedant\(silver\)\.jpg$/i.test(f) ||
      /Hollow out butterfly pedant\.jpg$/i.test(f),
  },
];

function normalizeBase(filename) {
  return filename
    .replace(/\.(jpe?g|png|webp)$/i, '')
    .replace(/\(\d+\)$/, '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function toCoverCard(input, output) {
  let pipeline = sharp(input).rotate();
  try {
    pipeline = pipeline.trim({ threshold: 24 });
  } catch {
    // keep
  }
  const trimmed = await pipeline.toBuffer({ resolveWithObject: true });
  const buf = await sharp(trimmed.data)
    .resize(W, H, { fit: 'cover', position: 'centre', withoutEnlargement: false })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
  const tmp = `${output}.tmp.jpg`;
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, output);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs
    .readdirSync(SRC)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && fs.statSync(path.join(SRC, f)).isFile());
  const assigned = new Set();
  const catalog = [];

  for (const sku of skus) {
    const matched = files.filter((f) => sku.match(normalizeBase(f)));
    if (!matched.length) {
      console.warn('no files for', sku.slug);
      continue;
    }
    matched.forEach((f) => assigned.add(f));

    const sorted = [...matched].sort((a, b) => {
      const ap = sku.preferredDefault(a) ? 0 : 1;
      const bp = sku.preferredDefault(b) ? 0 : 1;
      if (ap !== bp) return ap - bp;
      const ae = a.toLowerCase().endsWith('.jpg') ? 0 : 1;
      const be = b.toLowerCase().endsWith('.jpg') ? 0 : 1;
      if (ae !== be) return ae - be;
      return a.localeCompare(b, undefined, { numeric: true });
    });

    const outNames = [];
    for (let i = 0; i < sorted.length; i++) {
      const srcName = sorted[i];
      const outName = i === 0 ? `${sku.slug}.jpg` : `${sku.slug}-${i + 1}.jpg`;
      const outPath = path.join(OUT, outName);
      await toCoverCard(path.join(SRC, srcName), outPath);
      outNames.push(`/necklace/catalog/${outName}`);
      const m = await sharp(outPath).metadata();
      console.log('cover', outName, `${m.width}x${m.height}`, '←', srcName);
    }

    const wearImage = `/necklace/catalog/wear-${sku.slug}.jpg`;
    catalog.push({
      slug: sku.slug,
      name: sku.name,
      collection: sku.collection,
      category: 'necklaces',
      price: sku.price,
      limited: sku.limited,
      madeToOrder: false,
      badge: sku.badge,
      metal: sku.metal,
      sizes: ['One size'],
      image: outNames[0],
      gallery: [...outNames, wearImage],
      hoverImage: wearImage,
      description: sku.description,
      story: sku.story,
      details: [...sku.details, 'Handmade in Jaipur'],
      care: 'Wipe dry after wear. Keep away from perfume and water. Store alone in the pouch.',
      _sourceFiles: sorted,
      _defaultSource: sorted[0],
    });
  }

  const orphaned = files.filter((f) => !assigned.has(f));
  if (orphaned.length) console.warn('ORPHANS', orphaned);

  const mapPath = path.join(process.cwd(), 'scripts', 'necklace-catalog.json');
  fs.writeFileSync(
    mapPath,
    JSON.stringify({ skus: catalog, orphans: orphaned, totalSource: files.length }, null, 2),
  );
  console.log('skus', catalog.length, 'sources', files.length, 'orphans', orphaned.length);
  console.log('wrote', mapPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
