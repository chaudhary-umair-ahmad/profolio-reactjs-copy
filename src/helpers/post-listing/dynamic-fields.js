import tenantData from '@data';
import tenantTransformers from '@transformers';
import { getBayutKsaStaticDynamicFieldsResponse } from '../../tenant/bayut/data/listingCategories/ksa';
import { skipFieldsForField as bayutSkipFieldRules } from '../../tenant/bayut/data/listing-form-data';
import { getCommonStaticDynamicFieldsResponse } from '../../tenant/common/data/listingCategories/common';
import { TENANT_KEY } from '../../utility/env';

const getStaticDynamicFieldsResponse = (arg) =>
  TENANT_KEY === 'bayut'
    ? getBayutKsaStaticDynamicFieldsResponse(arg)
    : getCommonStaticDynamicFieldsResponse(arg);

export const getDynamicFormFieldsData = (arg = {}) => {
  const response = getStaticDynamicFieldsResponse(arg);
  if (response == null) return null;

  const { locale, user, cities, useSecondaryDisplayOrder, isDailyRental, propertyTypeId } = arg;
  const skipFieldRules = TENANT_KEY === 'bayut' ? bayutSkipFieldRules : tenantData?.skipFieldsForField;

  return tenantTransformers.dynamicFormFieldMapper(response, locale, user, cities || [], {
    useSecondaryDisplayOrder: Boolean(useSecondaryDisplayOrder),
    isDailyRental: Boolean(isDailyRental),
    propertyTypeId: propertyTypeId != null && propertyTypeId !== '' ? Number(propertyTypeId) : null,
    skipFieldRules,
    injectClientLocationField: true,
  });
};

/** Normalize listing `price` Formik value (number or `{ value }`) for numeric comparisons. */
export function listingPriceToNumber(raw) {
  if (raw == null || raw === '') return NaN;
  const val = typeof raw === 'object' && raw !== null && 'value' in raw ? raw.value : raw;
  const n = Number(val);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * When AI generate-title / generate-description is on, which bilingual keys to omit from the form and validation.
 * Used by PostListingForm (locale-aware Bayut vs legacy single-Arabic layout).
 */
export function getHiddenFieldKeysForAutoTranslate({
  isLocaleAwareGenerateContent,
  locale,
  generateTitle,
  generateDescription,
}) {
  const hidden = [];
  if (generateTitle) {
    if (isLocaleAwareGenerateContent) {
      hidden.push(locale === 'ar' ? 'property_title_en' : 'property_title_ar');
    } else {
      hidden.push('property_title_ar');
    }
  }
  if (generateDescription) {
    if (isLocaleAwareGenerateContent) {
      hidden.push(locale === 'ar' ? 'property_description_en' : 'property_description_ar');
    } else {
      hidden.push('property_description_ar');
    }
  }
  return hidden;
}
