import fs from 'fs';

const catalog = JSON.parse(fs.readFileSync('scripts/earrings-catalog.json', 'utf8')).skus;
const drop = new Set([
  'tide-drops',
  'shell-studs',
  'whisper-hoops',
  'dusk-studs',
  'honey-bee-studs',
]);
const src = fs.readFileSync('lib/products.js', 'utf8');

const start = src.indexOf('export const products = [');
const arrStart = src.indexOf('[', start);
const endMarker = '\n];\n\nexport function getProduct';
const end = src.indexOf(endMarker);
if (start < 0 || end < 0) throw new Error('products markers not found');

const before = src.slice(0, arrStart + 1);
const after = src.slice(end);
const oldArraySource = src.slice(arrStart, end + 2).replace(/;$/, '');
const products = Function(`return ${oldArraySource}`)();

const kept = products.filter((p) => !drop.has(p.slug) && p.category !== 'earrings');
const earrings = catalog.map(({ _sourceFiles, _defaultSource, ...p }) => p);
const next = [...kept, ...earrings];

function toJs(value, depth = 1) {
  const pad = '  '.repeat(depth);
  const pad0 = '  '.repeat(Math.max(depth - 1, 0));
  if (Array.isArray(value)) {
    const simple = value.every(
      (v) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null,
    );
    if (simple) {
      if (value.length && typeof value[0] === 'string' && value[0].startsWith('/')) {
        return `[\n${value.map((v) => `${pad}${JSON.stringify(v)}`).join(',\n')},\n${pad0}]`;
      }
      return `[${value.map((v) => JSON.stringify(v)).join(', ')}]`;
    }
    return `[\n${value.map((v) => `${pad}${toJs(v, depth + 1)}`).join(',\n')},\n${pad0}]`;
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    return `{\n${keys.map((k) => `${pad}${k}: ${toJs(value[k], depth + 1)}`).join(',\n')},\n${pad0}}`;
  }
  return JSON.stringify(value);
}

const body = next.map((p) => toJs(p, 2)).join(',\n');
fs.writeFileSync('lib/products.js', `${before}\n${body}\n${after}`);
console.log('kept', kept.length, 'earrings', earrings.length, 'total', next.length);
console.log(earrings.map((r) => r.slug).join('\n'));
