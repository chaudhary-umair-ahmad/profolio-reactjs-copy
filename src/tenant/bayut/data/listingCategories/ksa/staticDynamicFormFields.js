import tenantConstants from '@constants';
import { isLandPropertyType } from '../../listing-form-data';
import { getDailyRentalKsaStaticDynamicFieldsResponse } from './dailyRental';
import { getLongTermKsaBaseDynamicFieldsResponse } from './shared/longTermBase';
import { applyBayutKsaProjectListingOverrides } from './shared/projectListingOverrides';
import { getRentKsaBaseDynamicFieldsResponse } from './shared/rentTermBase';

const STATIC_BY_LISTING_PURPOSE_KEY = {
  sale: getLongTermKsaBaseDynamicFieldsResponse,
  rent: getRentKsaBaseDynamicFieldsResponse,
};

// Completion status (Ready / Off-plan) is shown for every sell listing, not just
// project-attached ones. Rent and daily rentals keep it hidden. On sell listings
// that aren't project-attached the field stays editable.
function showCompletionStatusForSale(response) {
  if (!response || !Array.isArray(response.dynamic_fields)) return response;
  return {
    ...response,
    dynamic_fields: response.dynamic_fields.map((field) =>
      field?.key_name === 'completion_status' ? { ...field, display: true, is_editable: true } : field,
    ),
  };
}

export function getBayutKsaStaticDynamicFieldsResponse(arg) {
  if (arg?.isDailyRental) {
    return getDailyRentalKsaStaticDynamicFieldsResponse();
  }
  const key = arg?.listingPurposeKey;
  const getStatic = key && STATIC_BY_LISTING_PURPOSE_KEY[key];
  // Never fall back to /api/surge/dynamic_fields for bayut flows.
  // If purpose key is not resolved yet, use sale base fields as safe default.
  const base = getStatic ? getStatic() : getLongTermKsaBaseDynamicFieldsResponse();
  if (arg?.hasProjectAttached) {
    return applyBayutKsaProjectListingOverrides(base);
  }
  // Land listings never show completion status, even for sell. The property type may
  // still be empty, so fall back to the API listing_category (categoryExternalId).
  const isLand = isLandPropertyType(arg?.propertyTypeId) || isLandPropertyType(arg?.categoryExternalId);
  if (tenantConstants.SHOW_COMPLETION_STATUS_FOR_SELL && key === 'sale' && !isLand) {
    return showCompletionStatusForSale(base);
  }
  return base;
}
