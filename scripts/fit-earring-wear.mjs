import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public', 'earrings', 'catalog');
const wears = fs.readdirSync(dir).filter((f) => f.startsWith('wear-') && f.endsWith('.jpg'));

for (const f of wears) {
  const p = path.join(dir, f);
  let pipeline = sharp(p).rotate();
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
  const tmp = `${p}.tmp.jpg`;
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, p);
  const m = await sharp(p).metadata();
  console.log(f, `${m.width}x${m.height}`);
}

const products = fs.readFileSync('lib/products.js', 'utf8');
console.log({
  wearFitted: wears.length,
  earringsInProducts: (products.match(/category: "earrings"/g) || []).length,
  catalogJpgs: fs.readdirSync(dir).filter((f) => f.endsWith('.jpg')).length,
});
