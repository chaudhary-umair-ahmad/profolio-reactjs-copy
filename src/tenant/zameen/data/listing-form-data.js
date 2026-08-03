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

export const skipFieldsForField = {
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
    property_type: { 12: true, 11: true, 19: true, 27: true, 23: true, 26: true },
  },
  bathrooms: {
    property_type: { 12: true, 11: true, 19: true, 27: true, 23: true, 26: true },
  },
  feature_and_amenities: {
    property_type: { 23: true, 24: true, 25: true, 26: true, 27: true },
  },
};
