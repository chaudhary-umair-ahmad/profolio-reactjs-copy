/**
 * Form value for "furnished":
 * - Surge: `dynamic_data.dynamic_fields.furnished` is often `{ slug: "yes"|"no" }` — return that slug (lowercased).
 * - Otherwise `is_furnished` on `dynamic_fields`, `dynamic_data`, or listing root — legacy `'1'` / `'0'`.
 *   JSONForm Surge radios use `valueKey: "slug"` (yes/no); `RadioButtons` maps 1/0 → yes/no for display.
 */
export const furnishedRadioFromListing = (listing) => {
  if (!listing) return '0';
  const df = listing?.dynamic_data?.dynamic_fields;
  const furnishedObj = df?.furnished;
  if (furnishedObj != null && typeof furnishedObj === 'object' && furnishedObj.slug != null && furnishedObj.slug !== '') {
    return String(furnishedObj.slug).toLowerCase();
  }
  const raw = df?.is_furnished ?? listing?.dynamic_data?.is_furnished ?? listing?.is_furnished;
  if (raw === true || raw === 'true' || raw === 'yes' || raw === 'Yes' || raw === '1' || raw === 1) {
    return '1';
  }
  if (raw === false || raw === 'false' || raw === 'no' || raw === 'No' || raw === '0' || raw === 0) {
    return '0';
  }
  return '0';
};

export const hasFurnishedOnListing = (listing) => {
  if (!listing) return false;
  const df = listing?.dynamic_data?.dynamic_fields;
  const furnishedObj = df?.furnished;
  if (furnishedObj != null && typeof furnishedObj === 'object' && furnishedObj.slug != null && furnishedObj.slug !== '') {
    return true;
  }
  if (Object.prototype.hasOwnProperty.call(df ?? {}, 'is_furnished')) return true;
  if (Object.prototype.hasOwnProperty.call(listing?.dynamic_data ?? {}, 'is_furnished')) return true;
  return Object.prototype.hasOwnProperty.call(listing, 'is_furnished');
};

export const isListingFurnishedYes = (listing) => isFurnishedYes(furnishedRadioFromListing(listing));

/** True when form `furnished` means furnished (slug `yes`/`no`, legacy `1`/`0`, or option object). */
export const isFurnishedYes = (value) => {
  if (value === true || value === 1 || value === '1') return true;
  if (value && typeof value === 'object') {
    const slug = value.slug != null ? String(value.slug).trim().toLowerCase() : '';
    if (slug === 'yes') return true;
    if (slug === 'no') return false;
  }
  const s = String(value ?? '')
    .trim()
    .toLowerCase();
  return s === 'yes' || s === 'true';
};
