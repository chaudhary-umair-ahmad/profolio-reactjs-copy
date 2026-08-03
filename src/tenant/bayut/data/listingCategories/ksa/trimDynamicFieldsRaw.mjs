import { readFileSync, writeFileSync } from 'node:fs';
import { trimDynamicFieldsPayload } from './trimDynamicFieldsCore.mjs';

const [,, inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('Usage: node trimDynamicFieldsRaw.mjs <input.json> <output.json>');
  process.exit(1);
}
const raw = JSON.parse(readFileSync(inPath, 'utf8'));
const trimmed = trimDynamicFieldsPayload(raw);
writeFileSync(outPath, JSON.stringify(trimmed, null, 2), 'utf8');
