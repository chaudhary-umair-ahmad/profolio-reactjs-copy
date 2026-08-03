import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { trimDynamicFieldsPayload } from '../trimDynamicFieldsCore.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rawPath = join(__dirname, 'rawDynamicFieldsFromApi.json');
const outPath = join(__dirname, 'dynamicFieldsResponse.json');

try {
  const raw = JSON.parse(readFileSync(rawPath, 'utf8'));
  const trimmed = trimDynamicFieldsPayload(raw);
  writeFileSync(outPath, JSON.stringify(trimmed, null, 2), 'utf8');
} catch (e) {
  if (e.code === 'ENOENT') {
    console.error(`Missing ${rawPath} — paste the API response JSON and rerun.`);
  }
  console.error(e);
  process.exit(1);
}
