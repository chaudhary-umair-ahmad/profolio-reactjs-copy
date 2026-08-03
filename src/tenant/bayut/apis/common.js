import tenantTransformers from '@transformers';

const normalizeListingType = (item) => {
  if (!item || item.type_id != null) {
    return item;
  }
  if (item.id == null) {
    return item;
  }
  return {
    ...item,
    type_id: item.id,
    type_title: item.name,
    type_title_l1: item.name_l1,
    type_order: item.display_order,
    type_htaccess: item.htaccess,
  };
};

const commonApiEndpoints = {
  getActiveProducts: {
    query: () => ({ url: `/api/surge/products` }),
    transformer: (response) => tenantTransformers.productsDataMapper(response),
  },

  getMonthRules: {
    query: () => ({ url: `/api/surge/packages/custom_package_rules` }),
  },

  getPropertyAges: {
    query: () => ({ url: `/api/surge/listing_age` }),
    transformer: (response) => response?.listing_ages || [],
  },

  getAdLicenseProducts: {
    query: () => ({ url: `/api/surge/ad_license_products` }),
    transformer: (response) => response?.ad_license_products || [],
  },

  getListingTypesByParent: {
    query: (typeId) => ({ url: `/api/surge/listing_types?q[parent_id_eq]=${typeId}` }),
    transformer: (response) => (response?.listing_types || []).map(normalizeListingType),
  },

  getListingCategoriesByParent: {
    query: (arg) => {
      return {
        url: `/api/surge/listing_categories`,
      };
    },
    transformer: (response) => (response?.listing_categories || []).map(normalizeListingType),
  },

  createAdLicense: {
    query: (body) => {
      return {
      url: `/api/surge/ad_license_requests`,
      method: 'POST',
      body: body,
    }},
  },
};

export default commonApiEndpoints;
