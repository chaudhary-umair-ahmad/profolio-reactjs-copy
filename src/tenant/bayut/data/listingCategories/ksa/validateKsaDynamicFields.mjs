import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyKsaDailyFieldLayer } from './applyDailyFieldLayer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function load(name) {
  return JSON.parse(readFileSync(join(__dirname, name), 'utf8'));
}

function keyNames(list) {
  return (list || []).map((f) => f.key_name);
}

function assertNoDupes(label, names) {
  const seen = new Set();
  for (const n of names) {
    if (n == null || n === '') throw new Error(`${label}: empty key_name`);
    if (seen.has(n)) throw new Error(`${label}: duplicate key_name "${n}"`);
    seen.add(n);
  }
}

function assertFieldShape(label, fields) {
  for (const f of fields || []) {
    if (typeof f.id !== 'number') throw new Error(`${label}: field ${f.key_name} missing numeric id`);
    if (f.key_name == null || f.key_name === '') throw new Error(`${label}: field missing key_name`);
  }
}

const common = load('dynamicFieldsCommon.json');
const longOnly = load('shared/dynamicFieldsResponse.json');
const rentOnly = load('shared/rentDynamicFieldsResponse.json');
const layer = load('dailyRental/dailyFieldLayer.json');

const commonKeys = new Set(keyNames(common.dynamic_fields));
const longKeys = new Set(keyNames(longOnly.dynamic_fields));
const rentKeys = new Set(keyNames(rentOnly.dynamic_fields));

for (const k of commonKeys) {
  if (longKeys.has(k)) {
    throw new Error(`key_name "${k}" must not appear in both dynamicFieldsCommon.json and shared/dynamicFieldsResponse.json`);
  }
}

for (const k of commonKeys) {
  if (rentKeys.has(k)) {
    throw new Error(`key_name "${k}" must not appear in both dynamicFieldsCommon.json and shared/rentDynamicFieldsResponse.json`);
  }
}

const mergeLong = { dynamic_fields: [...(common.dynamic_fields || []), ...(longOnly.dynamic_fields || [])] };
const mergeRent = { dynamic_fields: [...(common.dynamic_fields || []), ...(rentOnly.dynamic_fields || [])] };
const mergeDaily = applyKsaDailyFieldLayer(mergeLong, layer);

const mergeLongFlat = mergeLong.dynamic_fields;
const mergeRentFlat = mergeRent.dynamic_fields;
const mergeDailyFlat = mergeDaily.dynamic_fields;

assertFieldShape('common', common.dynamic_fields);
assertFieldShape('long only', longOnly.dynamic_fields);
assertFieldShape('rent only', rentOnly.dynamic_fields);
assertFieldShape('merged long', mergeLongFlat);
assertFieldShape('merged rent', mergeRentFlat);
assertFieldShape('merged daily (layer on long)', mergeDailyFlat);
assertNoDupes('merged long', keyNames(mergeLongFlat));
assertNoDupes('merged rent', keyNames(mergeRentFlat));
assertNoDupes('merged daily', keyNames(mergeDailyFlat));
