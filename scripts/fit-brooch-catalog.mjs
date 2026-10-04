/**
 * Fit all public/brooch photos to 4:5 cover + emit SKU map (category: cuffs / Brooches)
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.join(process.cwd(), 'public', 'brooch');
const OUT = path.join(process.cwd(), 'public', 'brooch', 'catalog');
const W = 1200;
const H = 1500;

const norm = (s) =>
  s
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Strip trailing angle numbers glued without parentheses: Calla Lilly(gold)1 → calla lilly(gold) */
function familyKey(filename) {
  return norm(
    filename
      .replace(/\.(jpe?g|png|webp)$/i, '')
      .replace(/\(\d+\)$/, '')
      .replace(/\d+$/, '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

const skus = [
  {
    slug: 'calla-lily-brooch-gold',
    name: 'Calla Lily Brooch — Gold',
    badge: 'Brooch',
    metal: ['18K Gold plated'],
    price: 2480,
    limited: false,
    collection: 'gilded-tide',
    description:
      'A slender calla lily pin in gold — matte petal within, polished stem without, warm stamen detail.',
    story: 'A single bloom, pinned with intention.',
    details: ['Gold-toned finish', 'Lapel / hat pin', 'Matte and polish contrast', 'Handmade'],
    match: (key) => key === 'calla lilly(gold)' || key === 'calla lily(gold)',
    preferredDefault: (f) => /Calla Lilly\(gold\)1\.jpg$/i.test(f),
  },
  {
    slug: 'calla-lily-brooch-silver',
    name: 'Calla Lily Brooch — Silver',
    badge: 'Brooch',
    metal: ['S925 Silver'],
    price: 2380,
    limited: false,
    collection: 'private-atelier',
    description:
      'A slender calla lily pin in silver — cool petal, polished stem, quiet botanical line.',
    story: 'Silver calla for quieter cloth.',
    details: ['S925 silver', 'Lapel / hat pin', 'Handmade'],
    match: (key) => key === 'calla lilly(silver)' || key === 'calla lily(silver)',
    preferredDefault: (f) => /Calla Lilly\(silver\)2\.jpg$/i.test(f),
  },
  {
    slug: 'calla-lily-brooch',
    name: 'Calla Lily Brooch',
    badge: 'Brooch',
    metal: ['S925 Silver', '18K Gold accents'],
    price: 2280,
    limited: false,
    collection: 'private-atelier',
    description:
      'The calla lily pin — sculptural bloom and stem, made to sit lightly on lapel or scarf.',
    story: 'One flower, held still.',
    details: ['Calla lily form', 'Lapel / hat pin', 'Handmade'],
    match: (key) => key === 'calla lilly' || key === 'calla lily',
    preferredDefault: (f) => /Calla Lilly4\.jpg$/i.test(f) || /Calla lilly6\.jpg$/i.test(f),
  },
  {
    slug: 'nandina-flower-brooch',
    name: 'Nandina Flower Brooch',
    badge: 'Brooch',
    metal: ['S925 Silver'],
    price: 2680,
    limited: true,
    collection: 'private-atelier',
    description:
      'A nandina bloom pin — layered petals, botanical silver, light enough for everyday cloth.',
    story: 'Heavenly bamboo, worn as a flower.',
    details: ['Nandina motif', 'Brooch pin', 'Handmade'],
    match: (key) => key.startsWith('nandina flower'),
    preferredDefault: (f) => /Nandina flower1\.png$/i.test(f),
  },
  {
    slug: 'sacred-bamboo-flower-brooch',
    name: 'Sacred Bamboo Flower Brooch',
    badge: 'Brooch',
    metal: ['S925 Silver', 'Gold accent'],
    price: 2780,
    limited: true,
    collection: 'private-atelier',
    description:
      'Sacred bamboo flower pin — delicate bloom, fine stem, quiet presence on the lapel.',
    story: 'Bamboo light, pinned once.',
    details: ['Sacred bamboo flower', 'Brooch pin', 'Handmade'],
    match: (key) => key.startsWith('sacred bamboo flower'),
    preferredDefault: (f) => /Sacred Bamboo Flower1\.png$/i.test(f),
  },
];

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
    const matched = files.filter((f) => sku.match(familyKey(f)));
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
      outNames.push(`/brooch/catalog/${outName}`);
      const m = await sharp(outPath).metadata();
      console.log('cover', outName, `${m.width}x${m.height}`, '←', srcName);
    }

    const wearImage = `/brooch/catalog/wear-${sku.slug}.jpg`;
    catalog.push({
      slug: sku.slug,
      name: sku.name,
      collection: sku.collection,
      category: 'cuffs',
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
      care: 'Pin through fabric gently. Store alone in the pouch.',
      _sourceFiles: sorted,
      _defaultSource: sorted[0],
    });
  }

  const orphaned = files.filter((f) => !assigned.has(f));
  if (orphaned.length) {
    console.warn('ORPHANS');
    for (const f of orphaned) console.warn(' ', f, '→', familyKey(f));
  }

  const mapPath = path.join(process.cwd(), 'scripts', 'brooch-catalog.json');
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
