/**
 * Pure helpers: listing category → property type UI options (testable without React).
 */

/**
 * @param {object} params
 * @param {Array<object>|null|undefined} params.categories
 * @param {number|string|null|undefined} params.activePurposeCategoryId
 * @param {boolean} params.shouldPreferPayloadCategoriesForPropertyType
 * @param {Array<object>|null|undefined} params.payloadListingCategories
 * @param {boolean} params.isDailyRental
 * @param {boolean} params.isListingLinkedToProject
 * @param {number|string|null|undefined} params.formikPropertyType
 * @param {Array<number|string>|null|undefined} params.projectPropertyTypeExternalIdOrder
 * @param {{ getLocalisedString: (row: object, key: string) => string }} params.tenantUtils
 * @param {(name: string) => unknown} params.getPropertyTypeIcon
 */
export function buildPropertyTypeOptions({
  categories,
  activePurposeCategoryId,
  shouldPreferPayloadCategoriesForPropertyType,
  payloadListingCategories,
  isDailyRental,
  isListingLinkedToProject,
  formikPropertyType,
  projectPropertyTypeExternalIdOrder,
  tenantUtils,
  getPropertyTypeIcon,
}) {
  const mapCategoryRow = (cat) => {
    const propertyTypeName = tenantUtils.getLocalisedString(cat, 'name') || cat.name;
    const icon = getPropertyTypeIcon(propertyTypeName);
    return {
      key: cat.id,
      label: propertyTypeName,
      value: cat.id,
      id: cat.id,
      name: propertyTypeName,
      ...(icon && { icon }),
    };
  };

  if (isDailyRental && Array.isArray(categories) && categories.length > 0 && activePurposeCategoryId != null) {
    const isResortCategory = (cat) => {
      const slug = String(cat?.slug || '').toLowerCase().trim();
      return slug === 'resorts' || slug === 'resort';
    };
    const propertyTypes = categories.filter(
      (cat) =>
        cat != null &&
        cat.parent_id != null &&
        String(cat?.purpose_hash?.slug || '').toLowerCase().trim() === 'daily-rental' &&
        !isResortCategory(cat),
    );
    if (propertyTypes.length > 0) {
      propertyTypes.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      return propertyTypes.map(mapCategoryRow);
    }
  }

  if (
    isListingLinkedToProject &&
    !isDailyRental &&
    Array.isArray(categories) &&
    categories.length > 0 &&
    activePurposeCategoryId != null
  ) {
    const allowedIds = new Set();
    if (shouldPreferPayloadCategoriesForPropertyType && payloadListingCategories?.length) {
      payloadListingCategories.forEach((c) => {
        if (c?.id != null) allowedIds.add(c.id);
      });
    }
    const cur = formikPropertyType;
    if (cur != null && cur !== '') allowedIds.add(cur);

    const isDescendantOfPurpose = (cat) => {
      if (!cat || cat.id === activePurposeCategoryId) return false;
      if (cat.parent_id === activePurposeCategoryId) return true;
      return Array.isArray(cat.breadcrumbs) && cat.breadcrumbs.some((b) => b?.id === activePurposeCategoryId);
    };
    const pool = categories.filter(isDescendantOfPurpose);

    let propertyTypes;
    if (projectPropertyTypeExternalIdOrder?.length) {
      const used = new Set();
      propertyTypes = [];
      for (const wantedExtId of projectPropertyTypeExternalIdOrder) {
        const target = String(wantedExtId);
        const found = pool.find((c) => !used.has(c.id) && c?.external_id != null && String(c.external_id) === target);
        if (found) {
          used.add(found.id);
          propertyTypes.push(found);
        }
      }
      const curId = formikPropertyType;
      if (curId != null && curId !== '') {
        const curCat = pool.find((c) => String(c.id) === String(curId));
        if (curCat && !used.has(curCat.id)) {
          propertyTypes.push(curCat);
          used.add(curCat.id);
        }
      }
    } else {
      propertyTypes = [...pool].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }

    return propertyTypes.map((cat) => ({
      ...mapCategoryRow(cat),
      ...(allowedIds.size > 0 ? { disabled: !allowedIds.has(cat.id) } : {}),
    }));
  }

  if (shouldPreferPayloadCategoriesForPropertyType) {
    const sorted = [...payloadListingCategories].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    return sorted.map(mapCategoryRow);
  }
  if (!categories || categories.length === 0 || !activePurposeCategoryId) return [];

  const propertyTypes = categories.filter((cat) => cat.parent_id === activePurposeCategoryId);
  propertyTypes.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return propertyTypes.map(mapCategoryRow);
}

/** When payload categories are empty but Formik still has a property type, expose one synthetic option. */
export function buildPropertyTypeSelectOptions({
  propertyTypeOptions,
  hasEmptyPayloadListingCategories,
  formikPropertyType,
  formikPropertyTypeLabel,
  listingCategory,
  tenantUtils,
}) {
  if (propertyTypeOptions.length > 0) return propertyTypeOptions;
  if (hasEmptyPayloadListingCategories && formikPropertyType != null && formikPropertyType !== '') {
    const id = formikPropertyType;
    const label =
      formikPropertyTypeLabel ||
      tenantUtils.getLocalisedString(listingCategory, 'name') ||
      listingCategory?.name ||
      String(id);
    return [{ id, name: label, label, value: id, key: id }];
  }
  return propertyTypeOptions;
}

export function computeMaskPropertyTypeSelectValue({
  shouldRenderPropertyTypeAsSelect,
  isPropertyTypeControlDisabled,
  formikPropertyType,
  propertyTypeOptions,
}) {
  if (!shouldRenderPropertyTypeAsSelect || isPropertyTypeControlDisabled) return false;
  if (formikPropertyType == null || formikPropertyType === '') return false;
  if (!propertyTypeOptions.length) return false;
  return !propertyTypeOptions.some((pt) => String(pt?.id) === String(formikPropertyType));
}
