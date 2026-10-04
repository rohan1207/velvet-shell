/**
 * Fit bracelet DEFAULT card images to exact 4:5 by COVER (fills card, no letterbox bars).
 * Trims near-uniform borders first (white studio / old padded frames).
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.join(process.cwd(), 'public', 'bracelets');
const OUT = path.join(process.cwd(), 'public', 'bracelets', 'catalog');
const W = 1200;
const H = 1500;

const primaries = [
  // Dark lifestyle square — covers 4:5 cleanly (white studio looked letterboxed)
  ['Flower in the rain(pink).jpg', 'flower-rain-pink.jpg'],
  ['Flower in the Rain2.jpg', 'flower-rain-white.jpg'],
  ['Flower in the Rain1.jpg', 'flower-rain-pair.jpg'],
  ['Forget me not Flower Bangles.jpg', 'forget-me-not-bangles.jpg'],
  ['Forget me not Flower.jpg', 'forget-me-not-cuff.jpg'],
  ['Lotus Whisper(pink).jpg', 'lotus-whisper-pink.jpg'],
  ['Lotus Whisper(green).jpg', 'lotus-whisper-green.jpg'],
  ['Lotus Whisper3.jpg', 'lotus-whisper-pair.jpg'],
  ['Lotus Whisper Bangles(pink).jpg', 'lotus-bangle-pink.jpg'],
  ['Lotus Whisper Bangles(green).jpg', 'lotus-bangle-green.jpg'],
];

async function toCoverCard(input, output) {
  // Strip old cream/white letterbox bars, then fill 4:5
  let pipeline = sharp(input).rotate();
  try {
    pipeline = pipeline.trim({ threshold: 24 });
  } catch {
    // keep untrimmed if trim fails
  }

  const trimmed = await pipeline.toBuffer({ resolveWithObject: true });
  const buf = await sharp(trimmed.data)
    .resize(W, H, {
      fit: 'cover',
      position: 'centre',
      withoutEnlargement: false,
    })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();

  const tmp = `${output}.tmp.jpg`;
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, output);
}

async function main() {
  for (const [srcName, outName] of primaries) {
    const src = path.join(SRC, srcName);
    const base = outName.replace(/\.jpg$/, '');
    const outs = [
      path.join(OUT, outName),
      path.join(OUT, `${base}-v3.jpg`),
    ];
    if (!fs.existsSync(src)) {
      console.warn('missing', srcName);
      continue;
    }
    for (const out of outs) {
      await toCoverCard(src, out);
      const m = await sharp(out).metadata();
      console.log('cover', path.basename(out), `${m.width}x${m.height}`);
    }
  }

  // Re-cover gallery angles that still have baked-in pad bars
  const gallery = fs
    .readdirSync(OUT)
    .filter(
      (f) =>
        f.endsWith('.jpg') &&
        !f.startsWith('wear-') &&
        !f.endsWith('-v2.jpg') &&
        !primaries.some(([, name]) => name === f) &&
        /-\d+\.jpg$/.test(f),
    );

  for (const name of gallery) {
    const file = path.join(OUT, name);
    await toCoverCard(file, file);
    const m = await sharp(file).metadata();
    console.log('gallery', name, `${m.width}x${m.height}`);
  }

  console.log('done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
