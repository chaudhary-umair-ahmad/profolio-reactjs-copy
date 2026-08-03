import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyKsaDailyFieldLayer } from '../applyDailyFieldLayer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ksa = join(__dirname, '..');

function mergeCommon(flowOnly) {
  const common = JSON.parse(readFileSync(join(ksa, 'dynamicFieldsCommon.json'), 'utf8'));
  return {
    dynamic_fields: [...(common.dynamic_fields || []), ...(flowOnly?.dynamic_fields || [])],
  };
}

const longOnly = JSON.parse(readFileSync(join(ksa, 'shared/dynamicFieldsResponse.json'), 'utf8'));
const defaultDaily = join(__dirname, 'dynamicFieldsResponse.json');
const dailyPath = process.argv[2] || (existsSync(defaultDaily) ? defaultDaily : null);
if (!dailyPath) {
  console.error(
    'Usage: node buildDailyFieldLayer.mjs <path-to-daily-only-trimmed.json>\n' +
      'Example: after buildStaticDynamicFields.mjs, pass ' +
      defaultDaily,
  );
  process.exit(1);
}
const dailyOnly = JSON.parse(readFileSync(dailyPath, 'utf8'));

const longMerged = mergeCommon(longOnly);
const dailyMerged = mergeCommon(dailyOnly);

const L = Object.fromEntries(longMerged.dynamic_fields.map((f) => [f.key_name, f]));
const D = Object.fromEntries(dailyMerged.dynamic_fields.map((f) => [f.key_name, f]));
const onlyLong = Object.keys(L).filter((k) => !D[k]);
const onlyDaily = Object.keys(D).filter((k) => !L[k]);

function minimalPatchFromAToB(a, b) {
  if (a === b) return undefined;
  if (a == null || b == null) return b;
  if (typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return b;
  if (Array.isArray(a)) {
    return JSON.stringify(a) === JSON.stringify(b) ? undefined : b;
  }
  const out = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (!(k in a) || !(k in b)) {
      out[k] = b[k];
      continue;
    }
    const p = minimalPatchFromAToB(a[k], b[k]);
    if (p !== undefined) out[k] = p;
  }
  return Object.keys(out).length ? out : undefined;
}

const fieldOverrides = {};
for (const k of Object.keys(D)) {
  if (!L[k] || onlyDaily.includes(k)) continue;
  const p = minimalPatchFromAToB(L[k], D[k]);
  if (p) fieldOverrides[k] = p;
}

const additionalFields = onlyDaily.map((k) => D[k]);
const layer = {
  omitKeyNames: onlyLong,
  fieldOverrides,
  additionalFields,
};

const outPath = join(__dirname, 'dailyFieldLayer.json');
writeFileSync(outPath, JSON.stringify(layer, null, 2) + '\n', 'utf8');

const roundTrip = applyKsaDailyFieldLayer(longMerged, layer);
const a = JSON.stringify(
  roundTrip.dynamic_fields
    .slice()
    .sort((x, y) => (x.key_name > y.key_name ? 1 : -1)),
);
const b = JSON.stringify(
  dailyMerged.dynamic_fields
    .slice()
    .sort((x, y) => (x.key_name > y.key_name ? 1 : -1)),
);
if (a !== b) {
  console.error('Parity check failed: layer + long does not match merged daily. Inspect diffs manually.');
  process.exit(1);
}
