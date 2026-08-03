import { isDynamicFieldNestedInPayload } from './dynamicFieldDestination';

const AREA_DYNAMIC_API_KEYS = new Set(['area_unit', 'area_unit_value', 'area']);

const isDynamicDefActiveForListingPayload = (def) => {
  if (!def) return false;
  const isVisible = def.display === true;
  const isHiddenRequired = def.display !== true && def.is_required === true;
  if (!isVisible && !isHiddenRequired) return false;
  if (!isDynamicFieldNestedInPayload(def.destinationKey)) return false;
  return true;
};

/**
 * Whether sale/rent listing root area keys and nested `area_unit` preservation should be sent.
 * Empty definitions (e.g. before /dynamic_fields resolves) keeps legacy behaviour.
 */
export function shouldSendAreaListingFields(dynamicFieldDefinitions) {
  const defs = dynamicFieldDefinitions || [];
  if (!defs.length) return true;
  return defs.some(
    (def) => AREA_DYNAMIC_API_KEYS.has(def.apiKeyName) && isDynamicDefActiveForListingPayload(def),
  );
}
