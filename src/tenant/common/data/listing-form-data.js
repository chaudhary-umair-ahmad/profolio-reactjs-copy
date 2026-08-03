import tenantConstants from '@constants';

export const FORM_KEYS = {
  purpose: 'purpose',
  type: 'property_type',
  location: 'location_select',
  area: 'area',
  price: 'price',
  hasInstallments: 'installment_available',
  advanceAmount: 'advance_amount',
  monthlyInstallment: 'monthly_installment',
  noOfInstallments: 'no_of_installments',
  readyForPossession: 'ready_for_possession',
  bedrooms: 'bedrooms',
  bathrooms: 'bathrooms',
  features: 'feature_and_amenities',
  title: 'property_title',
  description: 'property_description',
  images: 'property_images',
  email: 'email',
  mobileA: 'mobileA',
  mobileB: 'mobileB',
  platform: 'platform_selection',
};

export const listingTypeIds = {
  Land: 42,
  Building: 43,
};

export const propertyTypes = {
  [listingTypeIds.Land]: [
    { id: 20, label: 'Industrial Land' },
    { id: 19, label: 'Commercial Land' },
    { id: 9, label: 'Residential Land' },
  ],
  [listingTypeIds.Building]: [
    { id: 8, label: 'Residential Building' },
    { id: 17, label: 'Commercial Building' },
  ],
};

export const getSubPropertyTypes = (typeId) => {
  let propertyType;
  if (propertyTypes?.[typeId]) {
    propertyType = propertyTypes?.[typeId];
  } else {
    Object.keys(propertyTypes).forEach((key) => {
      const foundItem = propertyTypes[key].find((item) => item.id === typeId);
      if (foundItem) {
        propertyType = propertyTypes[key];
      }
    });
  }
  return propertyType;
};

export const skipFieldsForField = {
  bedrooms: {
    property_type: {
      2: { skipField: true, isOptional: true },
      7: { skipField: true, isOptional: true },
      4: { skipField: false, isOptional: false, studio: true },
      6: { skipField: false, isOptional: false, studio: true },
      8: { skipField: true, isOptional: true, studio: true },
      9: { skipField: true, isOptional: true, studio: true },
      10: { skipField: true, isOptional: true, studio: true },
      ...(tenantConstants.ROOM_PROPERTY_TYPE_ENABLED && {
        11: { skipField: true, isOptional: true },
      }),
    },
  },
  bathrooms: {
    property_type: {
      4: { skipField: false, isOptional: false },
      6: { skipField: false, isOptional: false },
      2: { skipField: true, isOptional: true },
      7: { skipField: true, isOptional: true },
      8: { skipField: true, isOptional: true },
      9: { skipField: true, isOptional: true },
      10: { skipField: true, isOptional: true },
    },
  },
  furnished: {
    property_type: {
      7: { skipField: true, isOptional: true },
      8: { skipField: true, isOptional: true },
      9: { skipField: true, isOptional: true },
      10: { skipField: true, isOptional: true },
    },
  },
  feature_and_amenities: {
    property_type: {
      7: { skipField: true, isOptional: true },
      8: { skipField: true, isOptional: true },
      9: { skipField: true, isOptional: true },
      10: { skipField: true, isOptional: true },
    },
  },
};

export function shouldShowStudioBedroomOption(propertyTypeExternalId) {
  if (propertyTypeExternalId == null || propertyTypeExternalId === '') return false;
  const pt = Number(propertyTypeExternalId);
  if (Number.isNaN(pt)) return false;
  return Boolean(skipFieldsForField?.bedrooms?.property_type?.[pt]?.studio);
}

export function shouldHideBedroomsFieldForPropertyType(propertyTypeExternalId) {
  if (propertyTypeExternalId == null || propertyTypeExternalId === '') return false;
  const pt = Number(propertyTypeExternalId);
  if (Number.isNaN(pt)) return false;
  const rule = skipFieldsForField?.bedrooms?.property_type?.[pt];
  return rule === true || (rule && rule.skipField === true);
}
