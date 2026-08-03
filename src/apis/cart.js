import rtkApis from '@rtkApis';
import parentApi from '../store/parentApi';

const cartApis = parentApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query({
      query: (queryParams) => rtkApis.getCart.query(queryParams?.userId, queryParams?.orderId),
      transformResponse: (response, meta, args) => rtkApis.getCart?.transformer(response, meta, args),
      providesTags: ['cart'],
    }),
    createCart: build.mutation({
      query: (query) => rtkApis.createCart.query(query),
      invalidatesTags: ['cart'],
    }),
    updateCart: build.mutation({
      query: ({ dontInvalidate, ...query }) => rtkApis.updateCart.query(query),
      transformResponse: (response, meta, args) => rtkApis.updateCart?.transformer(response, meta, args),
      invalidatesTags: (result, error, args) => {
        return !args?.dontInvalidate ? ['cart'] : [];
      },
    }),
    deleteCart: build.mutation({
      query: (query) => rtkApis.deleteCart.query(query),
      transformResponse: (response, meta, args) => rtkApis.deleteCart?.transformer(response, meta, args),
      invalidatesTags: ['cart'],
    }),
    requestPayment: build.mutation({
      query: (query) => rtkApis.requestPayment.query(query),
    }),
    updatePayment: build.mutation({
      query: (query) => rtkApis.updatePayment.query(query),
    }),
    getTamaraInstallments: build.query({
      query: (queryParams) => rtkApis.getTamaraInstallments.query(queryParams),
    }),
    getMyOrders: build.query({
      query: (queryParams) => rtkApis.getMyOrders.query(queryParams),
      transformResponse: (response) => rtkApis.getMyOrders?.transformer(response),
    }),
    prepareCheckout: build.mutation({
      query: (query) => rtkApis.prepareCheckout.query(query),
      transformResponse: (response) => rtkApis.prepareCheckout?.transformer(response),
      //invalidatesTags: ['cart'],
    }),
    getTabbyPaymentLink: build.query({
      query: (queryParams) => rtkApis.getTabbyPaymentLink.query(queryParams),
    }),
  }),
});

export const {
  useGetCartQuery,
  useLazyGetMyOrdersQuery,
  useLazyGetTamaraInstallmentsQuery,
  useDeleteCartMutation,
  usePrepareCheckoutMutation,
  useCreateCartMutation,
  useUpdateCartMutation,
  useRequestPaymentMutation,
  useUpdatePaymentMutation,
  useLazyGetTabbyPaymentLinkQuery,
} = cartApis;
