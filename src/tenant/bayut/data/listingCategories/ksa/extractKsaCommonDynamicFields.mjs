import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const [,, aPath, bPath] = process.argv;

if (!aPath || !bPath) {
  console.error('Usage: node extractKsaCommonDynamicFields.mjs <longTermTrimmed.json> <dailyRentalTrimmed.json>');
  process.exit(1);
}

const inLong = aPath;
const inDaily = bPath;

const outCommon = join(__dirname, 'dynamicFieldsCommon.json');

function byKeyName(list) {
  return Object.fromEntries((list || []).map((f) => [f.key_name, f]));
}

const long = JSON.parse(readFileSync(inLong, 'utf8'));
const daily = JSON.parse(readFileSync(inDaily, 'utf8'));
const L = byKeyName(long.dynamic_fields);
const D = byKeyName(daily.dynamic_fields);
const sharedNames = Object.keys(L).filter((k) => D[k] != null);
const commonFields = sharedNames
  .filter((k) => JSON.stringify(L[k]) === JSON.stringify(D[k]))
  .map((k) => L[k]);

if (commonFields.length === 0) {
  console.error('No byte-identical shared fields. Pass full pre-merge trim exports, or the files already only contain flow-specific fields.');
  process.exit(1);
}

const commonSet = new Set(commonFields.map((f) => f.key_name));
const longOnly = (long.dynamic_fields || []).filter((f) => !commonSet.has(f.key_name));
const dailyOnly = (daily.dynamic_fields || []).filter((f) => !commonSet.has(f.key_name));

writeFileSync(outCommon, JSON.stringify({ dynamic_fields: commonFields }, null, 2) + '\n', 'utf8');
writeFileSync(
  inLong,
  JSON.stringify({ dynamic_fields: longOnly }, null, 2) + '\n',
  'utf8',
);
writeFileSync(
  inDaily,
  JSON.stringify({ dynamic_fields: dailyOnly }, null, 2) + '\n',
  'utf8',
);
