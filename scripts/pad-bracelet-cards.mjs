/**
 * Pad bracelet product images to card aspect 4:5 without cropping.
 * Usage: node scripts/pad-bracelet-cards.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'public', 'bracelets');
const OUT = path.join(ROOT, 'public', 'bracelets', 'catalog');

const WIDTH = 1200;
const HEIGHT = 1500; // 4:5 — matches product cards
const BG = { r: 250, g: 247, b: 242, alpha: 1 }; // pearl

/** Best original product shot per SKU (+ extra gallery angles) */
const jobs = [
  {
    out: 'flower-rain-pink.jpg',
    sources: ['Flower In The Rain(pink)1.jpg', 'Flower in the rain(pink).jpg', 'Flower in the rain(pink)(1).jpg'],
  },
  {
    out: 'flower-rain-white.jpg',
    sources: ['Flower in the Rain2.jpg', 'Flower in the Rain4.jpg', 'Flower in the rain3.jpg'],
  },
  {
    out: 'forget-me-not-bangles.jpg',
    sources: [
      'Forget me not Flower Bangles.jpg',
      'Forget me not Flower Bangles(1).jpg',
      'Forget me not Flower Bangles(2).jpg',
      'Forget me not Flower Bangles(3).jpg',
      'Forget me not Flower Bangles3.jpg',
    ],
  },
  {
    out: 'forget-me-not-cuff.jpg',
    sources: [
      'Forget me not Flower.jpg',
      'Forget me not Flower(1).jpg',
      'Forget me not Flower(2).jpg',
      'Forget-me-not Flower_.jpg',
    ],
  },
  {
    out: 'lotus-whisper-pink.jpg',
    sources: ['Lotus Whisper(pink).jpg', 'Lotus Whisper(pink)3.jpg', 'Lotus Whispers(pink)2.jpg'],
  },
  {
    out: 'lotus-whisper-green.jpg',
    sources: ['Lotus Whisper(green).jpg', 'Lotus Whisper(green)2.jpg', 'Lotus Whisper(green)7.jpg'],
  },
  {
    out: 'lotus-bangle-pink.jpg',
    sources: ['Lotus Whisper Bangles(pink).jpg', 'Lotus Whispers Bangles(pink)1.jpg'],
  },
  {
    out: 'lotus-bangle-green.jpg',
    sources: ['Lotus Whisper Bangles(green).jpg', 'Lotus Whispers Bangles (green)1.jpg'],
  },
  // Pair / edit shots as extra browsable pieces (so more folder images appear in shop)
  {
    out: 'flower-rain-pair.jpg',
    sources: ['Flower in the Rain1.jpg'],
  },
  {
    out: 'lotus-whisper-pair.jpg',
    sources: ['Lotus Whisper3.jpg'],
  },
];

async function padToCard(inputPath, outputPath) {
  const input = sharp(inputPath).rotate(); // honor EXIF
  const meta = await input.metadata();
  const imgW = meta.width || WIDTH;
  const imgH = meta.height || HEIGHT;

  // Fit entire image inside 4:5 (contain), then composite on pearl canvas
  const fitted = await sharp(inputPath)
    .rotate()
    .resize(WIDTH, HEIGHT, {
      fit: 'contain',
      background: BG,
      withoutEnlargement: false,
    })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();

  await sharp(fitted).toFile(outputPath);
  return { imgW, imgH, out: outputPath };
}

async function padWear(name) {
  const wearSrc = path.join(OUT, name);
  if (!fs.existsSync(wearSrc)) return null;
  const tmp = path.join(OUT, `_${name}`);
  await padToCard(wearSrc, tmp);
  fs.renameSync(tmp, wearSrc);
  return wearSrc;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const job of jobs) {
    const primary = job.sources.find((f) => fs.existsSync(path.join(SRC, f)));
    if (!primary) {
      console.warn('MISSING primary for', job.out, job.sources);
      continue;
    }
    const outPath = path.join(OUT, job.out);
    await padToCard(path.join(SRC, primary), outPath);
    console.log('card', job.out, '←', primary);

    // Extra gallery angles: pad remaining sources
    let g = 2;
    for (const src of job.sources.slice(1)) {
      const full = path.join(SRC, src);
      if (!fs.existsSync(full)) continue;
      const galleryName = job.out.replace(/\.jpg$/i, `-${g}.jpg`);
      await padToCard(full, path.join(OUT, galleryName));
      console.log('  gallery', galleryName, '←', src);
      g += 1;
    }
  }

  // Pad existing wear images to same 4:5 so hover matches card
  const wearFiles = fs.readdirSync(OUT).filter((f) => f.startsWith('wear-') && f.endsWith('.jpg'));
  for (const f of wearFiles) {
    await padWear(f);
    console.log('wear padded', f);
  }

  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
