import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ASSETS =
  'C:/Users/rohan/.cursor/projects/c-Projects-Velvel-shell/assets';
const OUT = path.resolve('public/categories');

const jobs = [
  {
    out: 'ring.png',
    src: 'c__Users_rohan_AppData_Roaming_Cursor_User_workspaceStorage_391c8edffbdaa937440f995ad480317b_images_99e6243c-624d-4911-bf4e-ffe58d5cd53d.png',
  },
  {
    out: 'bracelate.png',
    src: 'c__Users_rohan_AppData_Roaming_Cursor_User_workspaceStorage_391c8edffbdaa937440f995ad480317b_images_9824c98b-3817-4f2d-906b-f4a85dfabb59.png',
  },
  {
    out: 'necklace.png',
    src: 'c__Users_rohan_AppData_Roaming_Cursor_User_workspaceStorage_391c8edffbdaa937440f995ad480317b_images_224d8aed-621a-44cd-a2fc-17f79413329d.png',
  },
  {
    out: 'earrings.png',
    src: 'c__Users_rohan_AppData_Roaming_Cursor_User_workspaceStorage_391c8edffbdaa937440f995ad480317b_images_583005a5-955d-43bf-8350-4b7717bf13f2.png',
  },
  {
    out: 'chain.png',
    src: 'c__Users_rohan_AppData_Roaming_Cursor_User_workspaceStorage_391c8edffbdaa937440f995ad480317b_images_8edf8357-c652-4954-8e79-52d00d537ff1.png',
  },
  {
    out: 'anklet.png',
    src: 'c__Users_rohan_AppData_Roaming_Cursor_User_workspaceStorage_391c8edffbdaa937440f995ad480317b_images_5f450b8b-57b1-4f8f-becd-f895c493c8a3.png',
  },
  {
    out: 'pendant.png',
    src: 'c__Users_rohan_AppData_Roaming_Cursor_User_workspaceStorage_391c8edffbdaa937440f995ad480317b_images_7b706a99-8136-4c0b-b3af-227ccd8928f2.png',
  },
];

fs.mkdirSync(OUT, { recursive: true });

async function cutBlack(input, output) {
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const N = width * height;
  const isBg = new Uint8Array(N);

  const nearBlack = (i) => {
    const o = i * channels;
    return data[o] < 28 && data[o + 1] < 28 && data[o + 2] < 28;
  };

  const q = [];
  for (let x = 0; x < width; x++) q.push(x, (height - 1) * width + x);
  for (let y = 0; y < height; y++) q.push(y * width, y * width + width - 1);

  while (q.length) {
    const i = q.pop();
    if (i < 0 || i >= N || isBg[i] || !nearBlack(i)) continue;
    isBg[i] = 1;
    const x = i % width;
    const y = (i / width) | 0;
    if (x > 0) q.push(i - 1);
    if (x < width - 1) q.push(i + 1);
    if (y > 0) q.push(i - width);
    if (y < height - 1) q.push(i + width);
  }

  for (let i = 0; i < N; i++) {
    if (!isBg[i]) continue;
    const o = i * channels;
    data[o] = data[o + 1] = data[o + 2] = 0;
    data[o + 3] = 0;
  }

  await sharp(data, { raw: { width, height, channels } })
    .resize(640, 640, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toFile(output);
}

for (const job of jobs) {
  const input = path.join(ASSETS, job.src);
  if (!fs.existsSync(input)) {
    console.error('MISSING', input);
    process.exit(1);
  }
  const output = path.join(OUT, job.out);
  await cutBlack(input, output);
  console.log('wrote', job.out);
}

// Remove brooch asset if present
for (const dead of ['brooch.png', 'choker.png']) {
  const p = path.join(OUT, dead);
  if (fs.existsSync(p)) {
    // keep choker file if unused; only delete brooch
  }
}
const brooch = path.join(OUT, 'brooch.png');
if (fs.existsSync(brooch)) fs.unlinkSync(brooch);

console.log('done');
