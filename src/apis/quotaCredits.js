import rtkApis from '@rtkApis';
import parentApi from '../store/parentApi';

const quotaCreditsApis = parentApi.injectEndpoints({
  endpoints: (build) => ({
    getQuotaCreditsWidgetData: build.query({
      query: (params) => rtkApis.getQuotaCreditsWidgetData.query(params)?.url,
      transformResponse: (response, meta, args) =>
        rtkApis.getQuotaCreditsWidgetData.transformer(response, args.combineCredits),

      providesTags: ['credits'],
    }),
    getProductExpiryData: build.query({
      query: (params) => rtkApis.getProductExpiryData?.query(params)?.url,
      transformResponse: (response) => rtkApis.getProductExpiryData?.transformer(response),
    }),
    getPurchaseLogs: build.query({
      query: (params) => rtkApis.getPurchaseLogs.query(params)?.url,
      transformResponse: (response) => rtkApis.getPurchaseLogs.transformer(response),
    }),

    fetchUserquotaCredits: build.query({
      query: (params) => rtkApis.fetchUserquotaCredits.query(params)?.url,
      transformResponse: (response) => rtkApis.fetchUserquotaCredits.transformer(response),
    }),

    getQuotaCreditsForTransfer: build.query({
      query: (query) => rtkApis.getQuotaCreditsForTransfer.query(query)?.url,
      transformResponse: (response) => rtkApis.getQuotaCreditsForTransfer.transformer(response),
      providesTags: ['agency-staff'],
    }),

    transferQuota: build.mutation({
      query: (body) => rtkApis.transferQuota.query(body),
      invalidatesTags: ['agency-staff', 'agency-profile', 'agency-staff-user'],
    }),

    transferCredits: build.mutation({
      query: (body) => rtkApis.transferCredits.query(body),
      invalidatesTags: ['agency-staff', 'agency-profile', 'agency-staff-user'],
    }),

    getCreditDeduction: build.query({
      query: (params) => rtkApis.getCreditDeduction?.query(params),
      transformResponse: (response, meta, args) => rtkApis.getCreditDeduction?.transformer(response, meta, args),
    }),

    getCustomCreditsPrice: build.query({
      query: (queryParams) => rtkApis.getCustomCreditsPrice.query(queryParams),
      transformResponse: (response) => rtkApis.getCustomCreditsPrice?.transformer(response),
    }),

    getConsumptionHistoryData: build.query({
      query: (query) => rtkApis.getConsumptionHistoryData.query(query)?.url,
      transformResponse: (response, meta, args) => rtkApis.getConsumptionHistoryData.transformer(response, meta, args),
    }),

    getConsumptionSummaryData: build.query({
      query: (query) => rtkApis.getConsumptionSummaryData.query(query)?.url,
      transformResponse: (response, meta, args) => rtkApis.getConsumptionSummaryData.transformer(response, meta, args),
    }),

    getQuotaDeductionApi: build.query({
      query: (params) => rtkApis.getQuotaDeductionApi.query(params),
      transformResponse: (response) => rtkApis.getQuotaDeductionApi.transformer(response),
    }),
  }),
});

export const {
  useGetQuotaCreditsWidgetDataQuery,
  useLazyGetCustomCreditsPriceQuery,
  useTransferQuotaMutation,
  useLazyGetQuotaDeductionApiQuery,
  useTransferCreditsMutation,
  useGetQuotaCreditsForTransferQuery,
  useGetProductExpiryDataQuery,
  useLazyGetCreditDeductionQuery,
  useLazyFetchUserquotaCreditsQuery,
  useLazyGetPurchaseLogsQuery,
  useGetPurchaseLogsQuery,
  useLazyGetConsumptionSummaryDataQuery,
  useLazyGetConsumptionHistoryDataQuery,
} = quotaCreditsApis;
