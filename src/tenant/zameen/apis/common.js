import tenantTransformers from '@transformers';
import tenantUtils from '@utils';

const commonApiEndpoints = {
  getImageBank: {
    query: ({ userId, perPage = 30, page = 1 }) => {
      return {
        url: `/api/users/${userId}/image_bank?page=${page}&per_page=${perPage}`,
      };
    },
    transformer: (response) => {
      return {
        images: response?.images,
        pagination: tenantUtils.getPaginationObject(response?.pagination),
      };
    },
  },
  deleteImageFromBank: {
    query: ({ images }) => {
      return {
        url: `/api/images`,
        method: 'DELETE',
        body: {
          media_category_id: '7',
          images,
        },
      };
    },
  },
  getActiveProducts: {
    query: () => {
      return {
        url: `/api/public/products?is_package_enabled=true`,
      };
    },
    transformer: (response) => {
      return tenantTransformers.getActiveProductsMapper(response);
    },
  },
};

export default commonApiEndpoints;
