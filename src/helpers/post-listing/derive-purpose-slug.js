/**
 * Canonical purpose slug for dynamic field maps and discount rules: `sale` | `rent` | `daily-rental`.
 *
 * Uses the selected top-level listing category (`parent_id` null) from Surge `listing_categories`.
 * `row.purpose` is typically `"Sale"` / `"Rent"` (display label); we normalize to lowercase slugs.
 */
export function derivePurposeSlugForDynamicFields({ isDailyRental, activePurposeCategoryId, categories }) {
  if (isDailyRental) {
    return 'daily-rental';
  }
  if (!activePurposeCategoryId || !categories?.length) {
    return undefined;
  }

  const purposeCategoryRow = categories.find(
    (category) => category.id === activePurposeCategoryId && category.parent_id == null,
  );
  if (!purposeCategoryRow) {
    return undefined;
  }

  const slugFromPayload = String(purposeCategoryRow?.purpose_hash?.slug || purposeCategoryRow?.slug || '')
    .toLowerCase()
    .trim();
  if (slugFromPayload === 'daily-rental') {
    return 'daily-rental';
  }

  const purposeLabel = purposeCategoryRow?.purpose;
  if (!purposeLabel) {
    return undefined;
  }

  const normalizedPurposeLabel = String(purposeLabel).toLowerCase();
  if (normalizedPurposeLabel === 'sale') {
    return 'sale';
  }
  if (normalizedPurposeLabel === 'rent') {
    return 'rent';
  }

  return undefined;
}
