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

export const getSubPropertyTypes = typeId => {
  let propertyType;
  if (propertyTypes?.[typeId]) {
    propertyType = propertyTypes?.[typeId];
  } else {
    Object.keys(propertyTypes).forEach(key => {
      const foundItem = propertyTypes[key].find(item => item.id === typeId);
      if (foundItem) {
        propertyType = propertyTypes[key];
      }
    });
  }
  return propertyType;
};

export const skipFieldsForField = {
  residence_type: {
    property_type: {
      2: true,
      9: true,
      8: true,
      17: true,
      25: true,
      26: true,
      29: true,
      46: true,
      53: true,
      69: true,
      70: true,
      73: true,
      42: true,
      19: true,
      20: true,
      9: true,
    },
  },
  plot: {
    property_type: { 23: true, 26: true, 18: true },
  },
  ready_for_possession: {
    property_type: {
      21: true,
      22: true,
      24: true,
      19: true,
      27: true,
      23: true,
      26: true,
      13: true,
      17: true,
      14: true,
      16: true,
      18: true,
    },
  },
  bedrooms: {
    property_type: {
      2: { skipField: true, isOptional: false, studio: true },
      4: { skipField: false, isOptional: false, studio: true },
      6: { skipField: false, isOptional: false, studio: true },
      8: { skipField: false, isOptional: true, studio: true },
      9: { skipField: true, isOptional: false, studio: true },
      10: { skipField: false, isOptional: false, studio: true },
      11: { skipField: false, isOptional: false, studio: true },
      12: { skipField: false, isOptional: false, studio: true },
      13: { skipField: false, isOptional: false, studio: true },
      14: { skipField: true, isOptional: false, studio: false },
      15: { skipField: true, isOptional: false, studio: false },
      16: { skipField: true, isOptional: false, studio: false },
      17: { skipField: true, isOptional: false, studio: false },
      18: { skipField: true, isOptional: false, studio: false },
      19: { skipField: true, isOptional: false, studio: false },
      20: { skipField: true, isOptional: false, studio: false },
      21: { skipField: false, isOptional: true, studio: false },
      22: { skipField: true, isOptional: false, studio: false },
      23: { skipField: true, isOptional: false, studio: false },
      24: { skipField: true, isOptional: false, studio: false },
      25: { skipField: false, isOptional: false, studio: true },
      26: { skipField: false, isOptional: false, studio: true },
      27: { skipField: true, isOptional: true, studio: false },
      28: { skipField: true, isOptional: false, studio: false },
      29: { skipField: true, isOptional: false, studio: false },
      30: { skipField: true, isOptional: false, studio: false },
      31: { skipField: true, isOptional: false, studio: false },
      32: { skipField: false, isOptional: false, studio: true },
      33: { skipField: true, isOptional: false, studio: false },
      34: { skipField: true, isOptional: false, studio: false },
      35: { skipField: true, isOptional: false, studio: false },
      36: { skipField: true, isOptional: false, studio: false },
      37: { skipField: true, isOptional: false, studio: false },
      38: { skipField: true, isOptional: false, studio: false },
      39: { skipField: true, isOptional: false, studio: false },
      40: { skipField: true, isOptional: false, studio: false },
      41: { skipField: true, isOptional: false, studio: false },
      42: { skipField: true, isOptional: false, studio: false },
      43: { skipField: true, isOptional: false, studio: false },
      44: { skipField: true, isOptional: false, studio: false },
    },
  },
  bathrooms: {
    property_type: {
      2: { skipField: true, isOptional: false},
      8: { skipField: false, isOptional: true },
      9: { skipField: true, isOptional: false },
      14: { skipField: false, isOptional: true },
      15: { skipField: false, isOptional: true },
      16: { skipField: false, isOptional: true },
      17: { skipField: false, isOptional: true },
      18: { skipField: false, isOptional: true },
      19: { skipField: true, isOptional: false },
      20: { skipField: true, isOptional: false },
      21: { skipField: false, isOptional: true },
      22: { skipField: false, isOptional: true },
      23: { skipField: true, isOptional: false },
      28: { skipField: false, isOptional: true },
      29: { skipField: true, isOptional: false },
      30: { skipField: true, isOptional: false },
      31: { skipField: true, isOptional: false },
      33: { skipField: true, isOptional: false },
      34: { skipField: false, isOptional: true },
      35: { skipField: true, isOptional: false },
      36: { skipField: false, isOptional: true },
      37: { skipField: true, isOptional: false },
      38: { skipField: true, isOptional: false },
      39: { skipField: true, isOptional: false },
      40: { skipField: true, isOptional: false },
      41: { skipField: false, isOptional: true },
      42: { skipField: true, isOptional: false },
      43: { skipField: true, isOptional: false },
      44: { skipField: true, isOptional: false },
    },
  },
  furnished: {
    property_type: {
      8: { skipField: true, isOptional: true },
      9: { skipField: true, isOptional: false },
      14: { skipField: false, isOptional: true },
      15: { skipField: false, isOptional: true },
      16: { skipField: false, isOptional: true },
      17: { skipField: true, isOptional: true },
      18: { skipField: false, isOptional: true },
      19: { skipField: true, isOptional: false },
      20: { skipField: true, isOptional: false },
      21: { skipField: false, isOptional: true },
      22: { skipField: false, isOptional: true },
      23: { skipField: true, isOptional: false },
      28: { skipField: false, isOptional: true },
      29: { skipField: true, isOptional: false },
      30: { skipField: true, isOptional: false },
      31: { skipField: true, isOptional: false },
      33: { skipField: true, isOptional: false },
      34: { skipField: false, isOptional: true },
      35: { skipField: true, isOptional: false },
      36: { skipField: false, isOptional: true },
      37: { skipField: true, isOptional: false },
      38: { skipField: true, isOptional: false },
      39: { skipField: true, isOptional: false },
      40: { skipField: true, isOptional: false },
      41: { skipField: false, isOptional: true },
      42: { skipField: true, isOptional: false },
      43: { skipField: true, isOptional: false },
      44: { skipField: true, isOptional: false },
    },
  },
  feature_and_amenities: {
    property_type: { 23: true, 24: true, 25: true, 26: true, 27: true },
  },
};

export const BAYUT_KSA_PROPERTY_TYPE_APARTMENT_ID = 3;

// Land parent listing type (42) and its sub-types
// (Residential 9 / Commercial 19 / Industrial 20 / Agriculture Plot 23).
export const BAYUT_KSA_LAND_PROPERTY_TYPE_IDS = [listingTypeIds.Land, 9, 19, 20, 23];

export function isLandPropertyType(propertyTypeExternalId) {
  if (propertyTypeExternalId == null || propertyTypeExternalId === '') return false;
  const pt = Number(propertyTypeExternalId);
  if (Number.isNaN(pt)) return false;
  return BAYUT_KSA_LAND_PROPERTY_TYPE_IDS.includes(pt);
}

export function shouldShowStudioBedroomOption(propertyTypeExternalId) {
  if (propertyTypeExternalId == null || propertyTypeExternalId === '') return false;
  return Number(propertyTypeExternalId) === BAYUT_KSA_PROPERTY_TYPE_APARTMENT_ID;
}

export function shouldHideBedroomsFieldForPropertyType(propertyTypeExternalId) {
  if (propertyTypeExternalId == null || propertyTypeExternalId === '') return false;
  const pt = Number(propertyTypeExternalId);
  if (Number.isNaN(pt)) return false;
  const rule = skipFieldsForField?.bedrooms?.property_type?.[pt];
  return rule === true || (rule && rule.skipField === true);
}
