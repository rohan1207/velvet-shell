/**
 * Fit all public/rings photos to 4:5 cover cards + emit SKU map for products.js
 * (96 angles → unique sellable styles, same pattern as bracelets)
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.join(process.cwd(), 'public', 'rings');
const OUT = path.join(process.cwd(), 'public', 'rings', 'catalog');
const W = 1200;
const H = 1500;

/** Unique SKUs — every source file lands in exactly one gallery */
const skus = [
  {
    slug: 'agate-bee-honey-ring',
    name: 'Agate Bee & Honey Ring',
    badge: 'Nature',
    metal: ['18K Gold plated'],
    price: 3480,
    limited: false,
    collection: 'private-atelier',
    description:
      'A gold twig band crowned with a striped bee — black enamel abdomen, open wings, and honey-warm polish.',
    story: 'A garden visitor, held still on the hand.',
    details: ['Gold-toned metal', 'Enamel bee body', 'Organic twig band', 'Handmade'],
    match: (base) => base === 'Agate Stone Bee and Honey',
    preferredDefault: (f) => f === 'Agate Stone Bee and Honey.jpg',
  },
  {
    slug: 'aquamarine-butterfly-ring',
    name: 'Aquamarine Butterfly Ring',
    badge: 'Stone',
    metal: ['S925 Silver', 'Gold accent'],
    price: 4280,
    limited: true,
    collection: 'private-atelier',
    description:
      'A raw aquamarine crystal on a silver branch band, with a tiny gold butterfly perched at the crest.',
    story: 'Stone, wing, and silver twig — quiet flight.',
    details: ['S925 silver band', 'Raw aquamarine', 'Gold butterfly accent', 'Adjustable'],
    match: (base) => base === 'Aquamarine Stone butterfly Ring',
    preferredDefault: (f) => f === 'Aquamarine Stone butterfly Ring.jpg',
  },
  {
    slug: 'bees-kissing-roses-ring',
    name: 'Bees Kissing Roses Ring',
    badge: 'Nature',
    metal: ['S925 Silver', 'Gold accent'],
    price: 3980,
    limited: true,
    collection: 'private-atelier',
    description:
      'Twin bees meet at a rose bloom — detailed wings, soft petals, and a botanical silver setting.',
    story: 'Two bees, one rose — a small romance in metal.',
    details: ['Botanical setting', 'Bee and rose motif', 'Adjustable', 'Handmade'],
    match: (base) =>
      base === 'Bees Kissing Roses' || base === 'Bees kissing roses_',
    preferredDefault: (f) => f === 'Bees Kissing Roses.jpg',
  },
  {
    slug: 'crystal-flower-in-rain-ring',
    name: 'Crystal Flower In Rain Ring',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 3680,
    limited: false,
    collection: 'pearls-of-nacre',
    description:
      'A frosted translucent flower on a silver branch band — soft petals, silver stamens, cool light.',
    story: 'A bloom after rain, worn close to the hand.',
    details: ['S925 silver', 'Frosted crystal flower', 'Branch band', 'Handmade'],
    match: (base) => base === 'Crystal Flower in Rain',
    preferredDefault: (f) => f === 'Crystal Flower in Rain.jpg',
  },
  {
    slug: 'flower-adjustable-ring',
    name: 'Flower Adjustable Ring',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 2980,
    limited: false,
    collection: 'pearls-of-nacre',
    description:
      'An open adjustable ring with a sculpted flower centre — light on the finger, full of quiet detail.',
    story: 'A bloom that finds its size.',
    details: ['Adjustable open form', 'Floral centre', 'Everyday weight', 'Handmade'],
    match: (base) => base === 'Flower adjustable ring',
    preferredDefault: (f) => f === 'Flower adjustable ring.jpg',
  },
  {
    slug: 'flower-adjustable-ring-gold',
    name: 'Flower Adjustable Ring — Gold',
    badge: 'Floral',
    metal: ['18K Gold plated'],
    price: 3180,
    limited: false,
    collection: 'gilded-tide',
    description:
      'The flower adjustable ring in warm gold — same open form, richer light.',
    story: 'Gold for the days that want warmth.',
    details: ['Gold-toned finish', 'Adjustable', 'Floral centre', 'Handmade'],
    match: (base) => base === 'Flower adjustable ring(gold)',
    preferredDefault: (f) => f === 'Flower adjustable ring(gold).jpg',
  },
  {
    slug: 'flower-adjustable-ring-silver',
    name: 'Flower Adjustable Ring — Silver',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 3080,
    limited: false,
    collection: 'pearls-of-nacre',
    description:
      'The flower adjustable ring in cool silver — open band, crisp bloom.',
    story: 'Silver for quieter light.',
    details: ['S925 silver', 'Adjustable', 'Floral centre', 'Handmade'],
    match: (base) => base === 'Flower adjustable ring(silver)',
    preferredDefault: (f) => f === 'Flower adjustable ring(silver).jpg',
  },
  {
    slug: 'flying-swallow-ring',
    name: 'Flying Swallow Ring',
    badge: 'Nature',
    metal: ['S925 Silver'],
    price: 3380,
    limited: false,
    collection: 'private-atelier',
    description:
      'A swallow in mid-flight across an adjustable silver band — light wings, decisive line.',
    story: 'A bird that never lands.',
    details: ['S925 silver', 'Swallow motif', 'Adjustable', 'Handmade'],
    match: (base) => base === 'Flying Swallow Adjustable Ring',
    preferredDefault: (f) => f === 'Flying Swallow Adjustable Ring.jpg',
  },
  {
    slug: 'lily-of-the-valley-ring',
    name: 'Lily Of The Valley Ring',
    badge: 'Crystal',
    metal: ['S925 Silver'],
    price: 4120,
    limited: true,
    collection: 'pearls-of-nacre',
    description:
      'Natural crystal bells along a silver stem — lily of the valley, held as a ring.',
    story: 'Spring, cast in crystal and silver.',
    details: ['Natural crystal drops', 'S925 silver', 'Botanical stem', 'Handmade'],
    match: (base) => base === 'Lily of the Valley Flower Natural Crystal Ring',
    preferredDefault: (f) => f === 'Lily of the Valley Flower Natural Crystal Ring.jpg',
  },
  {
    slug: 'lotus-natural-stone-ring',
    name: 'Lotus Natural Stone Ring',
    badge: 'Stone',
    metal: ['S925 Silver'],
    price: 4480,
    limited: true,
    collection: 'private-atelier',
    description:
      'A lotus bloom set with natural stone — layered petals, cool silver, quiet weight.',
    story: 'Lotus light for the hand.',
    details: ['Natural stone centre', 'Lotus motif', 'S925 silver', 'Handmade'],
    match: (base) => base === 'Lotus Natural Stone Ring',
    preferredDefault: (f) => f === 'Lotus Natural Stone Ring.jpg',
  },
  {
    slug: 'lotus-natural-stone-ring-pink',
    name: 'Lotus Natural Stone Ring — Pink',
    badge: 'Stone',
    metal: ['S925 Silver'],
    price: 4580,
    limited: true,
    collection: 'private-atelier',
    description:
      'The lotus natural stone ring in a soft pink stone — same petal architecture, warmer heart.',
    story: 'Pink lotus, quieter fire.',
    details: ['Pink natural stone', 'Lotus motif', 'S925 silver', 'Handmade'],
    match: (base) => base === 'Lotus Natural Stone Ring(pink)',
    preferredDefault: (f) => f === 'Lotus Natural Stone Ring(pink).jpg',
  },
  {
    slug: 'pencil-shaving-ring-gold',
    name: 'Pencil Shaving Ring — Gold',
    badge: 'Sculptural',
    metal: ['18K Gold plated'],
    price: 3280,
    limited: false,
    collection: 'the-shell-edit',
    description:
      'A sculptural gold band coiled like a pencil shaving — continuous ribbon, soft spiral.',
    story: 'A line that learned to turn.',
    details: ['Gold-toned metal', 'Spiral ribbon form', 'Statement band', 'Handmade'],
    match: (base) => base === 'Pencil shaving shape(gold)',
    preferredDefault: (f) => f === 'Pencil shaving shape(gold).jpg',
  },
  {
    slug: 'pencil-shaving-ring-silver',
    name: 'Pencil Shaving Ring — Silver',
    badge: 'Sculptural',
    metal: ['S925 Silver'],
    price: 3180,
    limited: false,
    collection: 'the-shell-edit',
    description:
      'The pencil-shaving spiral in silver — cool ribbon, continuous coil.',
    story: 'Silver that turns once, then again.',
    details: ['S925 silver', 'Spiral ribbon form', 'Statement band', 'Handmade'],
    match: (base) =>
      base === 'Pencil shaving shape(silver)' || base === 'Pencil shaving shape',
    preferredDefault: (f) => f === 'Pencil shaving shape(silver).jpg',
  },
  {
    slug: 'phalaenopsis-flower-ring',
    name: 'Phalaenopsis Flower Ring',
    badge: 'Floral',
    metal: ['S925 Silver', 'Gold accent'],
    price: 4380,
    limited: true,
    collection: 'private-atelier',
    description:
      'An orchid bloom ring — broad phalaenopsis petals, fine centre, botanical silver work.',
    story: 'Orchid stillness, worn.',
    details: ['Phalaenopsis motif', 'Detailed petals', 'Adjustable', 'Handmade'],
    match: (base) => base === 'Phalaenopsis Flower Ring',
    preferredDefault: (f) => f === 'Phalaenopsis Flower Ring.jpg',
  },
  {
    slug: 'phalaenopsis-flower-ring-silver',
    name: 'Phalaenopsis Flower Ring — Silver',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 4280,
    limited: true,
    collection: 'private-atelier',
    description:
      'The phalaenopsis orchid ring in full silver — cool petals, precise veins.',
    story: 'Silver orchid for quieter rooms.',
    details: ['S925 silver', 'Orchid motif', 'Adjustable', 'Handmade'],
    match: (base) => base === 'Phalaenopsis Flower Ring(silver)',
    preferredDefault: (f) => f === 'Phalaenopsis Flower Ring(silver).jpg',
  },
  {
    slug: 'pink-gems-stone-ring',
    name: 'Pink Gems Stone Ring',
    badge: 'Stone',
    metal: ['S925 Silver'],
    price: 3920,
    limited: false,
    collection: 'pearls-of-nacre',
    description:
      'A silver setting holding soft pink gemstones — luminous, feminine, made for stacking or alone.',
    story: 'Pink light, held in silver.',
    details: ['Pink gemstones', 'S925 silver', 'Everyday luxury', 'Handmade'],
    match: (base) => base === 'Pink gems stone rings',
    preferredDefault: (f) => f === 'Pink gems stone rings.jpg',
  },
  {
    slug: 'pomegranate-branch-ring',
    name: 'Pomegranate Branch Ring',
    badge: 'Nature',
    metal: ['S925 Silver', 'Gold accent'],
    price: 4680,
    limited: true,
    collection: 'private-atelier',
    description:
      'Pomegranate fruit and leaves on a branch band — ripe form, fine leaf work, botanical weight.',
    story: 'Fruit of the branch, worn as a seal.',
    details: ['Pomegranate motif', 'Leaf and branch detail', 'Adjustable', 'Handmade'],
    match: (base) => base.replace(/\u00a0/g, ' ').trim() === 'Pomegranate Fruits Leaves Branch',
    preferredDefault: (f) => /Pomegranate Fruits Leaves Branch/.test(f) && !/\(\d+\)/.test(f),
  },
];

function normalizeBase(filename) {
  return filename
    .replace(/\.jpg$/i, '')
    .replace(/\(\d+\)$/, '')
    .replace(/\u00a0/g, ' ')
    .trim();
}

function slugifyFile(filename) {
  return filename
    .replace(/\.jpg$/i, '')
    .replace(/\u00a0/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function toCoverCard(input, output) {
  let pipeline = sharp(input).rotate();
  try {
    pipeline = pipeline.trim({ threshold: 24 });
  } catch {
    // keep untrimmed
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
  const files = fs.readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.jpg'));
  const assigned = new Set();
  const catalog = [];

  for (const sku of skus) {
    const matched = files.filter((f) => sku.match(normalizeBase(f)));
    if (!matched.length) {
      console.warn('no files for', sku.slug);
      continue;
    }
    matched.forEach((f) => assigned.add(f));

    // Sort: preferred default first, then unnumbered, then numbered
    const sorted = [...matched].sort((a, b) => {
      const ap = sku.preferredDefault(a) ? 0 : 1;
      const bp = sku.preferredDefault(b) ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return a.localeCompare(b, undefined, { numeric: true });
    });

    const outNames = [];
    for (let i = 0; i < sorted.length; i++) {
      const srcName = sorted[i];
      const outName =
        i === 0 ? `${sku.slug}.jpg` : `${sku.slug}-${i + 1}.jpg`;
      const outPath = path.join(OUT, outName);
      await toCoverCard(path.join(SRC, srcName), outPath);
      outNames.push(`/rings/catalog/${outName}`);
      const m = await sharp(outPath).metadata();
      console.log('cover', outName, `${m.width}x${m.height}`, '←', srcName);
    }

    const defaultImage = outNames[0];
    const wearImage = `/rings/catalog/wear-${sku.slug}.jpg`;
    catalog.push({
      slug: sku.slug,
      name: sku.name,
      collection: sku.collection,
      category: 'rings',
      price: sku.price,
      limited: sku.limited,
      madeToOrder: false,
      badge: sku.badge,
      metal: sku.metal,
      sizes: ['5', '6', '7', '8', '9', 'Adjustable'],
      image: defaultImage,
      gallery: [...outNames, wearImage],
      hoverImage: wearImage,
      description: sku.description,
      story: sku.story,
      details: [...sku.details, 'Handmade in Jaipur'],
      care: 'Remove before bathing. Wipe dry after wear. Store alone in the pouch.',
      _sourceFiles: sorted,
      _defaultSource: sorted[0],
    });
  }

  const orphaned = files.filter((f) => !assigned.has(f));
  if (orphaned.length) {
    console.warn('ORPHANS', orphaned);
  }

  // Also write every raw file into catalog/all for completeness (optional alias)
  const mapPath = path.join(process.cwd(), 'scripts', 'rings-catalog.json');
  fs.writeFileSync(mapPath, JSON.stringify({ skus: catalog, orphans: orphaned, totalSource: files.length }, null, 2));
  console.log('skus', catalog.length, 'sources', files.length, 'orphans', orphaned.length);
  console.log('wrote', mapPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
