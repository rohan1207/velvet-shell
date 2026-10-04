import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assets = path.join(
  process.env.USERPROFILE || '',
  '.cursor',
  'projects',
  'c-Projects-Velvel-shell',
  'assets',
);
const dir = path.join(process.cwd(), 'public', 'necklace', 'catalog');
const catalog = JSON.parse(fs.readFileSync('scripts/necklace-catalog.json', 'utf8')).skus;

for (const s of catalog) {
  const name = `wear-${s.slug}.jpg`;
  const src = path.join(assets, name);
  const dest = path.join(dir, name);
  if (!fs.existsSync(src)) {
    console.warn('MISSING', name);
    continue;
  }
  fs.copyFileSync(src, dest);

  let pipeline = sharp(dest).rotate();
  try {
    pipeline = pipeline.trim({ threshold: 20 });
  } catch {
    // keep
  }
  const t = await pipeline.toBuffer({ resolveWithObject: true });
  const buf = await sharp(t.data)
    .resize(1200, 1500, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
  const tmp = `${dest}.tmp.jpg`;
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, dest);
  const m = await sharp(dest).metadata();
  console.log(name, `${m.width}x${m.height}`);
}

const products = fs.readFileSync('lib/products.js', 'utf8');
console.log({
  wearFitted: catalog.length,
  necklacesInProducts: (products.match(/category: "necklaces"/g) || []).length,
  catalogJpgs: fs.readdirSync(dir).filter((f) => f.endsWith('.jpg')).length,
});
