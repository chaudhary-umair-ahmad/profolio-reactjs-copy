/**
 * Effective sort order from Surge `dynamic_fields` / `dynamic_section` payloads.
 * For daily-rental, prefer `secondary_display_order` when set; otherwise use `display_order`.
 *
 * @param {{ display_order?: number|string|null, secondary_display_order?: number|string|null }|null|undefined} entity
 * @param {boolean} [preferSecondary] - When true (e.g. daily-rental listing), use secondary order when present.
 * @param {number} [missingFallback] - When primary/secondary are absent or invalid (sections often use 999, fields 0).
 */
export function getDynamicDisplaySortOrder(entity, preferSecondary = false, missingFallback = 999) {
  if (!entity || typeof entity !== 'object') return missingFallback;
  if (preferSecondary && entity.secondary_display_order != null && entity.secondary_display_order !== '') {
    const sec = Number(entity.secondary_display_order);
    return Number.isFinite(sec) ? sec : missingFallback;
  }
  const v = entity.display_order;
  if (v == null || v === '') return missingFallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : missingFallback;
}
