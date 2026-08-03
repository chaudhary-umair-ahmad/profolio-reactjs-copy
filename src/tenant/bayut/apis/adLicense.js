import rtkApis from '@rtkApis';
import parentApi from '../../../store/parentApi';

const adLicenseApis = parentApi.injectEndpoints({
  endpoints: (build) => ({
    getPropertyAges: build.query({
      query: () => rtkApis.getPropertyAges.query(),
      transformResponse: (response) => rtkApis.getPropertyAges?.transformer(response),
    }),
    getAdLicenseProducts: build.query({
      query: () => rtkApis.getAdLicenseProducts.query(),
      transformResponse: (response) => rtkApis.getAdLicenseProducts?.transformer(response),
    }),
    getListingTypesByParent: build.query({
      query: (typeId) => rtkApis.getListingTypesByParent.query(typeId),
      transformResponse: (response) => rtkApis.getListingTypesByParent?.transformer(response),
    }),
    getListingCategoriesByParent: build.query({
      query: (typeId) => rtkApis.getListingCategoriesByParent.query(typeId),
      transformResponse: (response) => rtkApis.getListingCategoriesByParent?.transformer(response),
    }),
    createAdLicense: build.mutation({
      query: (data) => rtkApis.createAdLicense.query(data),
    }),
  }),
});

export const {
  useGetPropertyAgesQuery,
  useGetAdLicenseProductsQuery,
  useGetListingTypesByParentQuery,
  useLazyGetListingTypesByParentQuery,
  useGetListingCategoriesByParentQuery,
  useLazyGetListingCategoriesByParentQuery,
  useCreateAdLicenseMutation,
} = adLicenseApis;
