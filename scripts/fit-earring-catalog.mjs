/**
 * Fit all public/earrings photos to 4:5 cover + emit SKU map (same pattern as rings/bracelets)
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.join(process.cwd(), 'public', 'earrings');
const OUT = path.join(process.cwd(), 'public', 'earrings', 'catalog');
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
    slug: 'autumn-tree-branch-earrings',
    name: 'Autumn Tree Branch Earrings',
    badge: 'Nature',
    metal: ['S925 Silver'],
    price: 3280,
    limited: false,
    collection: 'private-atelier',
    description: 'Silver branch earrings drawn like late autumn wood — organic line, quiet weight at the ear.',
    story: 'A tree held small enough for everyday.',
    details: ['S925 silver', 'Branch motif', 'Lightweight drop', 'Handmade'],
    match: (b) => norm(b).startsWith('autum tree branch'),
    preferredDefault: (f) => /Autum Tree Branch\(silver\)\.jpg$/i.test(f),
  },
  {
    slug: 'chrysanthemum-dangle-earrings',
    name: 'Chrysanthemum Dangle Earrings',
    badge: 'Floral',
    metal: ['S925 Silver', 'Gold accent'],
    price: 4580,
    limited: true,
    collection: 'private-atelier',
    description: 'Long chrysanthemum drops — silver outer petals, gold centres, French hooks.',
    story: 'A bloom that falls with intention.',
    details: ['Two-tone floral', 'Long dangle', 'French hooks', 'Handmade'],
    match: (b) => norm(b).startsWith('chrysanthemum flower dangle'),
    preferredDefault: (f) => /Chrysanthemum Flower Dangle Long\.jpg$/i.test(f),
  },
  {
    slug: 'dragonfly-baroque-pearl-earrings',
    name: 'Dragonfly Baroque Pearl Earrings',
    badge: 'Pearl',
    metal: ['S925 Silver', 'Gold accent'],
    price: 4880,
    limited: true,
    collection: 'pearls-of-nacre',
    description: 'Removable dragonfly forms with baroque pearls — assembleable, luminous, quietly dramatic.',
    story: 'Wings and pearl, worn as a private sky.',
    details: ['Baroque pearl', 'Dragonfly motif', 'Removable assembleable', 'Handmade'],
    match: (b) => norm(b).startsWith('dragonflyremovable'),
    preferredDefault: (f) => /Dragonflyremovable assembleable baroque pearl\.jpg$/i.test(f),
  },
  {
    slug: 'dripping-honey-bee-earrings',
    name: 'Dripping Honey & Bee Earrings',
    badge: 'Nature',
    metal: ['18K Gold plated'],
    price: 3680,
    limited: false,
    collection: 'the-shell-edit',
    description: 'Honey-drip forms with a tiny bee — warm gold, playful precision.',
    story: 'Sweetness, drawn in metal.',
    details: ['Gold-toned metal', 'Bee and honey motif', 'Drop form', 'Handmade'],
    match: (b) => norm(b).startsWith('dripping honey'),
    preferredDefault: (f) => /Dripping honey &bee\.jpg$/i.test(f),
  },
  {
    slug: 'epipremnum-dangle-earrings',
    name: 'Epipremnum Dangle Earrings',
    badge: 'Nature',
    metal: ['S925 Silver'],
    price: 3380,
    limited: false,
    collection: 'private-atelier',
    description: 'Trailing epipremnum leaf drops — botanical silver, soft movement.',
    story: 'A houseplant, made elegant.',
    details: ['Leaf motif', 'Dangle drop', 'S925 silver', 'Handmade'],
    match: (b) => norm(b).startsWith('epipremnum'),
    preferredDefault: (f) => /Epipremnum Aureum Dangle Drop/i.test(f) && /\.jpg$/i.test(f) && !/\(\d+\)/.test(f),
  },
  {
    slug: 'flower-design-dangle-earrings',
    name: 'Flower Design Dangle Earrings',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 3180,
    limited: false,
    collection: 'pearls-of-nacre',
    description: 'Sculpted flower dangles — clean petals, everyday silver light.',
    story: 'A flower that learned to hang.',
    details: ['Floral dangle', 'S925 silver', 'Everyday weight', 'Handmade'],
    match: (b) => norm(b) === 'flower design dangle earring',
    preferredDefault: (f) => /Flower Design Dangle Earring\.jpg$/i.test(f),
  },
  {
    slug: 'gold-flower-dangle-earrings',
    name: 'Gold Flower Dangle Earrings',
    badge: 'Floral',
    metal: ['18K Gold plated'],
    price: 3380,
    limited: false,
    collection: 'gilded-tide',
    description: 'Gold-plated flower dangles — warmer light, same botanical line.',
    story: 'Gold for softer evenings.',
    details: ['Gold-plated finish', 'Floral dangle', 'Lightweight', 'Handmade'],
    match: (b) => norm(b).startsWith('gold plated flower design'),
    preferredDefault: (f) => /Gold Plated Flower Design Dangle Earring\.png$/i.test(f),
  },
  {
    slug: 'flower-earring-gold',
    name: 'Flower Earrings — Gold',
    badge: 'Floral',
    metal: ['18K Gold plated'],
    price: 2980,
    limited: false,
    collection: 'gilded-tide',
    description: 'Compact gold flower earrings — soft petals, warm polish.',
    story: 'A bloom that stays close to the ear.',
    details: ['Gold-toned', 'Floral form', 'Stud or drop', 'Handmade'],
    match: (b) => norm(b) === 'flower earring(gold)',
    preferredDefault: (f) => /Flower earring\(gold\)\.jpg$/i.test(f),
  },
  {
    slug: 'flower-earring-silver',
    name: 'Flower Earrings — Silver',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 2880,
    limited: false,
    collection: 'pearls-of-nacre',
    description: 'Silver flower earrings — cool petals, quiet shine.',
    story: 'Silver bloom for daylight.',
    details: ['S925 silver', 'Floral form', 'Everyday', 'Handmade'],
    match: (b) => norm(b) === 'flower earring(silver)',
    preferredDefault: (f) => /Flower earring\(silver\)\.jpg$/i.test(f),
  },
  {
    slug: 'forget-me-not-hoop-earrings',
    name: 'Forget-Me-Not Flower Hoops',
    badge: 'Floral',
    metal: ['18K Gold plated'],
    price: 3980,
    limited: true,
    collection: 'private-atelier',
    description: 'Curved gold hoops clustered with forget-me-not blooms — textured petals, soft curve.',
    story: 'A garden along the ear.',
    details: ['Gold-toned', 'Floral hoop', 'Organic texture', 'Handmade'],
    match: (b) => norm(b) === 'forget-me-not flower hoop',
    preferredDefault: (f) => /Forget-me-not Flower Hoop\.jpg$/i.test(f),
  },
  {
    slug: 'forget-me-not-flower-earrings',
    name: 'Forget-Me-Not Flower Earrings',
    badge: 'Floral',
    metal: ['S925 Silver', 'Gold accent'],
    price: 3480,
    limited: false,
    collection: 'private-atelier',
    description: 'Forget-me-not blooms as earrings — delicate petals, botanical detail.',
    story: 'Small flowers, serious craft.',
    details: ['Forget-me-not motif', 'Lightweight', 'Handmade'],
    match: (b) => norm(b) === 'forget-me-not flower',
    preferredDefault: (f) => /Forget-me-not Flower/.test(f) && !/Hoop/i.test(f) && !/\(\d+\)/.test(f),
  },
  {
    slug: 'french-iris-long-drop-earrings',
    name: 'French Iris Long Drop Earrings',
    badge: 'Floral',
    metal: ['S925 Silver', 'Gold accent'],
    price: 4280,
    limited: true,
    collection: 'private-atelier',
    description: 'French-style iris long drops — elongated bloom, refined fall.',
    story: 'Iris, drawn for evening.',
    details: ['Iris motif', 'Long drop', 'French style', 'Handmade'],
    match: (b) => norm(b).startsWith('french style iris'),
    preferredDefault: (f) => /French Style Iris Flower Long Drop\.jpg$/i.test(f),
  },
  {
    slug: 'clover-pearl-dangle-earrings',
    name: 'Four-Leaf Clover Pearl Drops',
    badge: 'Pearl',
    metal: ['S925 Silver'],
    price: 4680,
    limited: true,
    collection: 'pearls-of-nacre',
    description: 'Classic four-leaf clover drops with freshwater pearls — luminous, lucky, light.',
    story: 'Pearl and clover, held as light.',
    details: ['Freshwater pearl', 'Clover motif', 'Dangle drop', 'Handmade'],
    match: (b) => norm(b).includes('four-leaf clover') || norm(b).includes('four-leaf clover'),
    preferredDefault: (f) => /Four-leaf Clover/i.test(f) && /\.jpg$/i.test(f) && !/\(\d+\)/.test(f),
  },
  {
    slug: 'honeybee-stud-earrings',
    name: 'Honeybee Stud Earrings',
    badge: 'Nature',
    metal: ['18K Gold plated'],
    price: 2680,
    limited: false,
    collection: 'the-shell-edit',
    description: 'Tiny honeybee studs — polished wings, frosted abdomen, everyday charm.',
    story: 'A garden detail for every day.',
    details: ['Bee stud', 'Gold-toned', 'Post and butterfly', 'Handmade'],
    match: (b) => norm(b) === 'honeybee stud',
    preferredDefault: (f) => /Honeybee stud\.jpg$/i.test(f),
  },
  {
    slug: 'honeybee-drop-earrings',
    name: 'Honeybee Drop Earrings',
    badge: 'Nature',
    metal: ['18K Gold plated', 'S925 Silver'],
    price: 3180,
    limited: false,
    collection: 'the-shell-edit',
    description: 'Honeybee drop earrings — golden bees with quiet movement at the ear.',
    story: 'Flight, paused.',
    details: ['Bee motif', 'Drop form', 'Handmade'],
    match: (b) =>
      norm(b) === 'honeybee earring' ||
      norm(b) === 'honey bee golden' ||
      norm(b) === 'honey bee golden(silver)',
    preferredDefault: (f) => /honeybee earring\.jpg$/i.test(f) || /honey bee golden\.jpg$/i.test(f),
  },
  {
    slug: 'iris-flower-dangle-earrings',
    name: 'Iris Flower Dangle Earrings',
    badge: 'Floral',
    metal: ['S925 Silver', 'Gold accent'],
    price: 4180,
    limited: true,
    collection: 'private-atelier',
    description: 'Iris flower dangles — layered petals, soft fall, botanical silver work.',
    story: 'Iris light for the ear.',
    details: ['Iris motif', 'Dangle', 'Handmade'],
    match: (b) => norm(b) === 'iris flower dangle',
    preferredDefault: (f) => /Iris Flower Dangle\.jpg$/i.test(f),
  },
  {
    slug: 'iris-flower-earrings',
    name: 'Iris Flower Earrings',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 3480,
    limited: false,
    collection: 'private-atelier',
    description: 'Iris blooms as earrings — sculpted petals, cool silver.',
    story: 'A single iris, twice.',
    details: ['Iris motif', 'S925 silver', 'Handmade'],
    match: (b) => norm(b) === 'iris flower',
    preferredDefault: (f) => /^Iris flower\.jpg$/i.test(f),
  },
  {
    slug: 'iris-long-drop-earrings',
    name: 'Iris Flower Long Drop Earrings',
    badge: 'Floral',
    metal: ['S925 Silver', 'Gold accent'],
    price: 4380,
    limited: true,
    collection: 'private-atelier',
    description: 'Long iris drops — elongated bloom and leaf, made to move.',
    story: 'Length is the luxury.',
    details: ['Long drop', 'Iris motif', 'Handmade'],
    match: (b) => norm(b).includes('iris') && norm(b).includes('long drop') && !norm(b).startsWith('french'),
    preferredDefault: (f) => /iris flower long drop\.jpg$/i.test(f),
  },
  {
    slug: 'leaf-hoop-earrings',
    name: 'Leaf Hoop Earrings',
    badge: 'Nature',
    metal: ['S925 Silver'],
    price: 3580,
    limited: false,
    collection: 'private-atelier',
    description: 'Leaf-wrapped hoops — botanical silver, open circle, soft shine.',
    story: 'A leaf that learned the shape of a hoop.',
    details: ['Leaf hoop', 'S925 silver', 'Handmade'],
    match: (b) => norm(b) === 'leaf hoop earring',
    preferredDefault: (f) => /Leaf Hoop Earring\.jpg$/i.test(f),
  },
  {
    slug: 'lilac-designer-drop-earrings',
    name: 'Lilac Flower Designer Drops',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 4480,
    limited: true,
    collection: 'private-atelier',
    description: 'Designer lilac drops — clustered blooms, refined fall.',
    story: 'Lilac, held as architecture.',
    details: ['Lilac motif', 'Designer drop', 'Handmade'],
    match: (b) => norm(b).startsWith('lilac flower'),
    preferredDefault: (f) => /Lilac Flower Designer Drop Earring/.test(f) && !/\(\d+\)/.test(f),
  },
  {
    slug: 'pearl-leaf-stud-earrings',
    name: 'Pearl & Crystal Leaf Studs',
    badge: 'Pearl',
    metal: ['S925 Silver'],
    price: 2780,
    limited: false,
    collection: 'pearls-of-nacre',
    description: 'Minimalist pearl studs with crystal rhinestone leaf accents — light, luminous, precise.',
    story: 'Pearl with a leaf of light.',
    details: ['Pearl stud', 'Crystal leaf accent', 'Minimalist', 'Handmade'],
    match: (b) => norm(b).includes('minimalist pearl') || norm(b).includes('minimalist pearl earring'),
    preferredDefault: (f) => /Minimalist Pearl Earrings Crystal Rhinestone Leaf Stud Earrings\.jpg$/i.test(f),
  },
  {
    slug: 'olive-leaf-earrings',
    name: 'Olive Leaf Earrings',
    badge: 'Nature',
    metal: ['S925 Silver'],
    price: 2980,
    limited: false,
    collection: 'private-atelier',
    description: 'Olive leaves in silver — slender, Mediterranean, quietly classic.',
    story: 'A leaf of peace, worn twice.',
    details: ['Olive leaf motif', 'S925 silver', 'Handmade'],
    match: (b) => norm(b).startsWith('olives leaves'),
    preferredDefault: (f) => /Olives leaves\.jpg$/i.test(f),
  },
  {
    slug: 'phalaenopsis-hoop-earrings',
    name: 'Phalaenopsis Flower Hoops',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 4680,
    limited: true,
    collection: 'private-atelier',
    description: 'Orchid blooms on silver hoops — phalaenopsis petals, open circle.',
    story: 'Orchid stillness, circling the ear.',
    details: ['Phalaenopsis motif', 'Hoop form', 'Handmade'],
    match: (b) => norm(b).startsWith('phalaenopsis flower hoop'),
    preferredDefault: (f) => /Phalaenopsis Flower Hoop\.jpg$/i.test(f),
  },
  {
    slug: 'retro-circle-drop-earrings',
    name: 'Retro Circle Drop Earrings',
    badge: 'Vintage',
    metal: ['S925 Silver', 'Gold accent'],
    price: 3280,
    limited: false,
    collection: 'gilded-tide',
    description: 'Retro French vintage circle drops — simple geometry, soft shine.',
    story: 'A circle that remembers Paris.',
    details: ['Circle drop', 'Vintage inspired', 'Handmade'],
    match: (b) => norm(b).startsWith('retro french'),
    preferredDefault: (f) => /Retro French Vintage Simple Circle Drop\.jpg$/i.test(f),
  },
  {
    slug: 'tulip-blossom-dangle-earrings',
    name: 'Tulip Blossom Long Leaf Dangles',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 4080,
    limited: true,
    collection: 'private-atelier',
    description: 'Tulip blossoms with long leaf dangles — spring form, elongated line.',
    story: 'Tulip and leaf, falling together.',
    details: ['Tulip motif', 'Long leaf dangle', 'Handmade'],
    match: (b) => norm(b).startsWith('tulip blossom'),
    preferredDefault: (f) => /Tulip Blossom Long Leaf Dangle\.jpg$/i.test(f),
  },
  {
    slug: 'curved-branch-asymmetric-earrings',
    name: 'Curved Branch Asymmetric Earrings',
    badge: 'Nature',
    metal: ['S925 Silver'],
    price: 3880,
    limited: true,
    collection: 'private-atelier',
    description: 'Asymmetric curved branches and leaves — two different falls, one language.',
    story: 'Not a pair that mirrors — a pair that converses.',
    details: ['Asymmetric pair', 'Branch and leaf', 'Handmade'],
    match: (b) => norm(b).startsWith('curved branches'),
    preferredDefault: (f) => /curved branches &leaves asymmetric\.jpg$/i.test(f),
  },
  {
    slug: 'wild-rose-stud-earrings',
    name: 'Wild Rose Flower Studs',
    badge: 'Floral',
    metal: ['S925 Silver'],
    price: 2580,
    limited: false,
    collection: 'pearls-of-nacre',
    description: 'Wild rose studs — open petals, soft centre, everyday bloom.',
    story: 'A rose that stays.',
    details: ['Rose stud', 'S925 silver', 'Handmade'],
    match: (b) => norm(b).startsWith('wild rose'),
    preferredDefault: (f) => /wild Rose flower stud\.jpg$/i.test(f),
  },
  {
    slug: 'atelier-lfja-earrings',
    name: 'Atelier LFJA Earrings',
    badge: 'Atelier',
    metal: ['S925 Silver'],
    price: 3680,
    limited: true,
    collection: 'private-atelier',
    description: 'Private atelier earring edits from the LFJA study — refined form, catalog light.',
    story: 'A number that became a piece.',
    details: ['Atelier edit', 'Limited angles', 'Handmade'],
    match: (b) => /lfja/i.test(b) || /白底/.test(b),
    preferredDefault: (f) => /LFJA0091/.test(f),
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
      // prefer jpg over png for default gallery order after preferred
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
      outNames.push(`/earrings/catalog/${outName}`);
      const m = await sharp(outPath).metadata();
      console.log('cover', outName, `${m.width}x${m.height}`, '←', srcName);
    }

    const wearImage = `/earrings/catalog/wear-${sku.slug}.jpg`;
    catalog.push({
      slug: sku.slug,
      name: sku.name,
      collection: sku.collection,
      category: 'earrings',
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
      care: 'Remove before bathing. Wipe dry after wear. Store hanging or lying flat.',
      _sourceFiles: sorted,
      _defaultSource: sorted[0],
    });
  }

  const orphaned = files.filter((f) => !assigned.has(f));
  if (orphaned.length) console.warn('ORPHANS', orphaned);

  const mapPath = path.join(process.cwd(), 'scripts', 'earrings-catalog.json');
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
