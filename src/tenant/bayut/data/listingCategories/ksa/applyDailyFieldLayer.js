function isPlainObject(x) {
  return x != null && typeof x === 'object' && !Array.isArray(x);
}

function mergeFieldPatch(base, patch) {
  if (patch == null) return base;
  if (Array.isArray(patch)) return patch;
  if (!isPlainObject(base) || !isPlainObject(patch)) return patch;
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v == null) {
      out[k] = v;
    } else if (Array.isArray(v)) {
      out[k] = v;
    } else if (isPlainObject(v) && isPlainObject(out[k])) {
      out[k] = mergeFieldPatch(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

/**
 * @param {{ dynamic_fields: object[] }} longKsaForm - `mergeKsaDynamicFields` output from **shared** long-term JSON
 * @param {{ omitKeyNames?: string[], fieldOverrides?: Record<string, object>, additionalFields?: object[] }} layer
 */
export function applyKsaDailyFieldLayer(longKsaForm, layer) {
  const omit = new Set(layer?.omitKeyNames ?? []);
  const overrides = layer?.fieldOverrides ?? {};
  const extra = layer?.additionalFields ?? [];
  const fields = (longKsaForm?.dynamic_fields ?? [])
    .filter((f) => f?.key_name && !omit.has(f.key_name))
    .map((f) => {
      const o = overrides[f.key_name];
      return o ? mergeFieldPatch(f, o) : f;
    });
  return { dynamic_fields: [...fields, ...extra] };
}
