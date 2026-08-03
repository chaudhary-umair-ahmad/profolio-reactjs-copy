import rtkApis from '@rtkApis';
import tenantTransformers from '@transformers';
import parentApi from '../store/parentApi';
import { normalizeSurgeListingsResponse } from '../utility/utility';

const listingsApis = parentApi.injectEndpoints({
  endpoints: (build) => ({
    getTruCheckStatuses: build.query({
      query: () => rtkApis.getTruCheckStatuses().url,
      transformResponse: (response) => {
        return response?.statuses;
      },
    }),
    getMyListings: build.query({
      queryFn: async (params, api, extraOptions, baseQuery) => {
        try {
          const [summary, listings] = await Promise.all([
            baseQuery(`/api/surge/listings/summary?${params?.mappedParams}`),
            baseQuery(`/api/surge/listings?${params?.mappedParams}`),
          ]);
          const listingsSummary = await summary;
          const myListings = await listings;
          const normalizedListings = normalizeSurgeListingsResponse(myListings?.data);
          return {
            data: tenantTransformers.getMyListingsData(listingsSummary?.data, normalizedListings, params?.userId),
          };
        } catch (error) {
          return { error: error?.message };
        }
      },
      providesTags: ['my-listings'],
    }),
    getListingsStats: build.query({
      queryFn: (params, api, extraOptions, baseQuery) =>
        rtkApis.getListingsStats.queryFn(params, api, extraOptions, baseQuery),
    }),
    listingDeleteReasons: build.query({
      query: (purposeId) => rtkApis.listingDeleteReasons.query(purposeId),
      transformResponse: (response) => {
        const reasons = response?.reasons?.length ? response?.reasons : [];
        return reasons.map((reason) => ({
          ...reason,
          is_text_required: reason?.text_required ?? reason?.is_text_required,
        }));
      },
    }),
    fetchPlotsByQuery: build.query({
      query: (query) => rtkApis.fetchPlotsByQuery.query(query),
      transformResponse: (response) => rtkApis.fetchPlotsByQuery.transformer(response),
    }),
    deleteListing: build.mutation({
      query: (body) => rtkApis.deleteListing?.query(body),
      async onQueryStarted(arg, api) {
        rtkApis.deleteListing?.afterSuccess(arg, api);
      },
      invalidatesTags: ['my-listings'],
    }),
    deleteListingFromDubizzle: build.mutation({
      query: (body) => rtkApis.deleteListingFromDubizzle?.query(body),
      async onQueryStarted(arg, api) {
        rtkApis.deleteListingFromDubizzle?.afterSuccess(arg, api);
      },
      invalidatesTags: ['my-listings'],
    }),
    getApplicableProducts: build.query({
      query: (query) => rtkApis.getApplicableProducts(query),
      transformResponse: (res, meta, args) => rtkApis.getApplicableProducts().transformer(res, meta, args),
    }),
    getUpsellData: build.query({
      queryFn: (params, api, extraOptions, baseQuery) =>
        rtkApis.getUpsellData.queryFn(params, api, extraOptions, baseQuery),
    }),
    applyProduct: build.mutation({
      query: (query) => rtkApis.applyProduct(query),
      async onQueryStarted(arg, api) {
        rtkApis.applyProduct()?.afterSuccess(arg, api);
      },
      invalidatesTags: ['current', 'credits', 'my-listings'],
    }),
    updateAutoRenew: build.mutation({
      query: (query) => rtkApis.updateAutoRenew.query(query),
      transformResponse: (res, meta, arg) => rtkApis.updateAutoRenew.transformer(res, meta, arg),
      invalidatesTags: (result, error) => {
        return result ? ['my-listings'] : [];
      },
    }),
    fetchListingDetail: build.query({
      query: (params) => rtkApis.fetchListingDetail.query(params),
      transformResponse: (res) => rtkApis.fetchListingDetail.transformer(res),
    }),
    deleteStory: build.mutation({
      query: (query) => rtkApis.deleteStory.query(query),
      transformResponse: (res, meta, args) => rtkApis.deleteStory.transformer(res, meta, args),
      invalidatesTags: ['my-listings'],
    }),
    getAppliedAutoPlan: build.query({
      query: (params) => rtkApis.getAppliedAutoPlan.query(params),
    }),
    applyUtilizationPlan: build.mutation({
      query: (query) => rtkApis.applyUtilizationPlan.query(query),
    }),
    stopAutoPlan: build.mutation({
      query: (query) => rtkApis.stopAutoPlan.query(query),
      transformResponse: (res) => rtkApis.stopAutoPlan.transformer(res),
    }),
    postPackageOnListing: build.mutation({
      query: (params) => rtkApis.postPackageOnListing?.query(params),
      async onQueryStarted(arg, api) {
        rtkApis.postPackageOnListing?.afterSuccess(arg, api);
      },
    }),
    fetchServicesDetails: build.query({
      queryFn: async (params, api, extraOptions, baseQuery) => {
        const { selectedAction, user } = params;

        const apiCalls = [baseQuery(''), baseQuery('')];
      },
    }),
    getListingCardDetail: build.query({
      query: (params) => rtkApis.getListingCardDetail(params),
    }),
    getOffplanProjects: build.query({
      query: (params) => rtkApis.getOffplanProjects(params),
    }),
    getAdLicenseRequests: build.query({
      query: (params) => rtkApis.getAdLicenseRequests.query(params),
      transformResponse: (response) => rtkApis.getAdLicenseRequests?.transformer(response),
      providesTags: ['ad-license-requests'],
    }),
    getMyListingsForSelect: build.query({
      queryFn: async (params, api, extraOptions, baseQuery) => {
        try {
          const result = await baseQuery(`/api/surge/listings?${params?.mappedParams}`);
          if (result?.error) {
            return { error: result.error };
          }
          const normalized = normalizeSurgeListingsResponse(result?.data);
          return { data: normalized };
        } catch (error) {
          return { error: error?.message };
        }
      },
    }),
  }),
});

export const {
  useStopAutoPlanMutation,
  useDeleteListingFromDubizzleMutation,
  useLazyFetchPlotsByQueryQuery,
  useGetTruCheckStatusesQuery,
  useApplyUtilizationPlanMutation,
  useLazyGetAppliedAutoPlanQuery,
  useDeleteStoryMutation,
  useLazyFetchListingDetailQuery,
  useUpdateAutoRenewMutation,
  useLazyListingDeleteReasonsQuery,
  useDeleteListingMutation,
  useGetListingsStatsQuery,
  useGetMyListingsQuery,
  useLazyGetApplicableProductsQuery,
  useGetApplicableProductsQuery,
  useApplyProductMutation,
  usePostPackageOnListingMutation,
  useLazyGetListingsStatsQuery,
  useGetUpsellDataQuery,
  useLazyFetchServicesDetailsQuery,
  useLazyGetListingCardDetailQuery,
  useGetOffplanProjectsQuery,
  useGetAdLicenseRequestsQuery,
  useLazyGetMyListingsForSelectQuery,
} = listingsApis;

export default listingsApis;
