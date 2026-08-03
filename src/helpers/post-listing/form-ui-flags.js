/**
 * Tenant + listing driven UI flags for PostListingForm (purpose/property type, edit-mode categories).
 * Pure: safe to call from useMemo.
 */
export function resolvePostListingFormUiFlags({ tenantConstants, listingRecord, isDailyRental }) {
  const isLocaleAwareGenerateContent = tenantConstants?.LOCALE_AWARE_GENERATE_CONTENT_FIELDS === true;
  const tenantFormSettings = tenantConstants.FORM || {};

  const shouldShowPurposeSelector = tenantFormSettings.HIDE_PURPOSE_SELECT !== true;
  const usePropertyTypeDropdown = tenantFormSettings.PROPERTY_TYPE_AS_SELECT === true;
  const isListingLinkedToProject = Boolean(listingRecord?.project?.id);

  const shouldRenderPropertyTypeAsSelect =
    usePropertyTypeDropdown && !isDailyRental && !isListingLinkedToProject;

  const usePayloadCategoriesForPropertyTypeOnEdit =
    tenantFormSettings.USE_LISTING_CATEGORIES_FOR_PROPERTY_TYPE_ON_EDIT === true;

  const projectPropertyTypeExternalIdOrder = Array.isArray(tenantFormSettings.PROJECT_LISTING_PROPERTY_TYPE_ORDER)
    ? tenantFormSettings.PROJECT_LISTING_PROPERTY_TYPE_ORDER
    : null;

  const propertyTypeLabelTranslationKey = isDailyRental
    ? 'Select Property Type'
    : tenantFormSettings.PROPERTY_TYPE_FIELD_LABEL || 'Select Property Type';

  const isEditingExistingListing = Boolean(listingRecord?.id);
  const payloadListingCategories = listingRecord?.listing_categories;

  const shouldPreferPayloadCategoriesForPropertyType =
    isEditingExistingListing &&
    usePayloadCategoriesForPropertyTypeOnEdit &&
    Array.isArray(payloadListingCategories);

  const hasEmptyPayloadListingCategories =
    shouldPreferPayloadCategoriesForPropertyType && payloadListingCategories.length === 0;

  return {
    isLocaleAwareGenerateContent,
    shouldShowPurposeSelector,
    shouldRenderPropertyTypeAsSelect,
    shouldPreferPayloadCategoriesForPropertyType,
    projectPropertyTypeExternalIdOrder,
    propertyTypeLabelTranslationKey,
    isEditingExistingListing,
    payloadListingCategories,
    hasEmptyPayloadListingCategories,
    isListingLinkedToProject,
  };
}
