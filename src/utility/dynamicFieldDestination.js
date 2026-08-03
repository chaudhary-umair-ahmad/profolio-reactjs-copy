/**
 * Surge dynamic_fields: `destination_key` decides listing PUT shape.
 * - `dynamic_data.dynamic_fields.<key>` → nested under listing.dynamic_data.dynamic_fields (last segment).
 * - Any other non-empty `destination_key` → listing root under that exact key (may differ from `key_name`,
 *   e.g. key_name `images` → destination_key `listing_images_attributes`).
 * - Missing `destination_key` → nested under dynamic_fields using `key_name` (legacy default).
 */
export function isDynamicFieldNestedInPayload(destinationKey) {
  const dk = String(destinationKey ?? '').trim();
  if (!dk) return true;
  return dk.startsWith('dynamic_data.dynamic_fields.');
}

/** Listing root property name for a non-nested dynamic field. */
export function getRootListingPayloadKey(destinationKey, keyName) {
  const dk = String(destinationKey ?? '').trim();
  if (dk && !dk.startsWith('dynamic_data.dynamic_fields.')) return dk;
  return String(keyName ?? '');
}

/** Payload key inside `dynamic_data.dynamic_fields` (last path segment when dotted). */
export function getNestedDynamicFieldPayloadKey(destinationKey, keyName) {
  const dk = String(destinationKey ?? '').trim();
  const m = dk.match(/^dynamic_data\.dynamic_fields\.(.+)$/);
  if (m && m[1]) return m[1];
  return String(keyName ?? '');
}
