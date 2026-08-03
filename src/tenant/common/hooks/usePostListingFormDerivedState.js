import tenantData from '@data';
import { useCallback, useMemo } from 'react';

/**
 * Bedroom options: Bayut KSA shows the Studio (-1) count only for Apartment (see tenantData.shouldShowStudioBedroomOption).
 * Other tenants fall back to legacy skipFields `studio` flag (omit -1 when true).
 */
export function usePostListingBedroomList(formik) {
  const propertyTypeId = formik.values['sub_listing_type']?.id ?? formik.values['property_type'];
  return useMemo(() => {
    const list = tenantData.bedroomsList;
    if (!list?.length) return list;
    if (typeof tenantData.shouldShowStudioBedroomOption === 'function') {
      return tenantData.shouldShowStudioBedroomOption(propertyTypeId)
        ? list
        : list.filter((item) => item.key !== '-1');
    }
    return tenantData.skipFieldsForField?.['bedrooms']?.property_type?.[propertyTypeId]?.studio
      ? list.filter((item) => item.key !== '-1')
      : list;
  }, [
    tenantData.skipFieldsForField,
    tenantData.bedroomsList,
    tenantData.shouldShowStudioBedroomOption,
    propertyTypeId,
  ]);
}

/**
 * Clears price, titles, descriptions, bedrooms, bathrooms, furnished (and optionally area)
 * when purpose / property type changes.
 * @param {{ clearArea?: boolean, preservePrice?: boolean }} options — Bayut clears `area`; set `preservePrice` when price stays disabled/read-only after subtype changes (e.g. Land sub-types).
 */
export function usePostListingResetOnPropertyTypeChange(formik, locale, options = {}) {
  const { clearArea = false, preservePrice = false } = options;
  return useCallback(() => {
    if (!preservePrice) {
      formik.setFieldValue('price', '', false);
    }
    if (clearArea) {
      formik.setFieldValue('area', '', false);
    }
    formik.setFieldValue('feature_and_amenities', null, false);
    formik.setFieldValue('features', null, false);
    formik.setFieldValue(locale === 'en' ? 'property_title_en' : 'property_title_ar', '', false);
    formik.setFieldValue(locale === 'en' ? 'property_description_en' : 'property_description_ar', '', false);
    formik.setFieldValue('bedrooms', null, false);
    formik.setFieldValue('bathrooms', null, false);
    formik.setFieldValue('furnished', null, false);
  }, [formik, locale, clearArea, preservePrice]);
}
