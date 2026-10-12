import fs from 'fs';
import path from 'path';

const src = fs.readFileSync('lib/products.js', 'utf8');
const paths = [...src.matchAll(/"(\/(?:earrings|necklace|bracelets|brooch|rings)\/[^"]+)"/g)].map(
  (m) => m[1],
);
const uniq = [...new Set(paths)];
const miss = uniq.filter((p) => !fs.existsSync(path.join('public', p.replace(/^\//, ''))));
console.log('unique paths', uniq.length, 'missing', miss.length);
miss.forEach((m) => console.log('MISS', m));
