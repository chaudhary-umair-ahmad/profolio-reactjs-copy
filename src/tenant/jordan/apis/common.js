import tenantTransformers from '@transformers';

const commonApiEndpoints = {
  getActiveProducts: {
    query: (headers) => {
      return {
        url: `/api/surge/products`,
        headers: headers,
      };
    },
    transformer: (response) => {
      return tenantTransformers.productsDataMapper(response);
    },
  },

  getMonthRules: {
    query: () => {
      return {
        url: `/api/surge/packages/custom_package_rules`,
      };
    },
  },
};

export default commonApiEndpoints;
