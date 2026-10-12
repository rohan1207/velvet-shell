import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const input =
  'C:/Users/rohan/.cursor/projects/c-Projects-Velvel-shell/assets/c__Users_rohan_AppData_Roaming_Cursor_User_workspaceStorage_391c8edffbdaa937440f995ad480317b_images_image-84cf2e5c-13e4-4e17-b01e-3f29ab51edec.png';
const output = path.resolve('public/categories/chain.png');

if (!fs.existsSync(input)) {
  console.error('MISSING', input);
  process.exit(1);
}

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
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

console.log('wrote', output);
