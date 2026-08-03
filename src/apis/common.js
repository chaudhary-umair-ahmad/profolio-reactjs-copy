import tenantConstants from '@constants';
import rtkApis from '@rtkApis';
import parentApi from '../store/parentApi';
import { setProducts } from '../store/appSlice';
import tenantData from '@data';
import { getErrorAllResponse } from '../utility/utility';

const commonApis = parentApi.injectEndpoints({
  endpoints: (build) => ({
    getActiveProducts: build.query({
      query: (query) => rtkApis.getActiveProducts.query(query),
      transformResponse: (response) => rtkApis.getActiveProducts?.transformer(response),
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProducts(data));
        } catch (e) {
          dispatch(setProducts(tenantData.products));
        }
      },
    }),

    getMonthRules: build.query({
      query: () => rtkApis.getMonthRules.query(),
      transformResponse: (response) => {
        return response?.rules;
      },
      providesTags: ['month-rules'],
    }),
    getS3PreSignedUrl: build.query({
      query: ({ attachmentType = 'listing_image', associationKey, fileName }) => {
        return {
          url: `${
            attachmentType === 'listing_image' ? '/api/surge/attachments/presigned_urls' : '/api/surge/assets/presigned_urls'
          }?key=${attachmentType}&no_of_urls=${1}`,
          method: 'GET',
        };
      },
    }),
    deleteImageFromBank: build.mutation({
      query: (query) => rtkApis.deleteImageFromBank.query(query),
    }),
    getImageBank: build.query({
      query: (query) => rtkApis.getImageBank.query(query),
      transformResponse: (response) => rtkApis.getImageBank.transformer(response),
    }),
    getPackages: build.query({
      query: (query) => rtkApis.getPackages.query(query),
      transformResponse: (response) => rtkApis.getPackages?.transformer(response),
    }),

    getUnreadCount: build.query({
      queryFn: async (queryParams, api, extraOptions, baseQuery) => {
        const apiCalls = [];
        if (tenantConstants.IS_LMS_ENABLED) {
          apiCalls.push(baseQuery('/api/surge/lms/leads/stats'));
        }
        const results = await Promise.allSettled(apiCalls);
        const errors = getErrorAllResponse(results);

        if (errors) {
          return { error: errors };
        }
        return {
          data: {
            leads: results?.[0]?.value?.data?.stats?.unseen_leads_count || 0,
          },
        };
      },
      providesTags: ['unread-count'],
    }),

    getAccountManagerInfo: build.query({
      query: (user) => {
        const type = user?.agency ? 'agency' : 'user';
        const resource_id = user?.agency ? user.agency.id : user.id;
        return {
          url: `/api/surge/dashboard/account_manager?type=${type}&resource_id=${resource_id}`,
          method: 'GET',
        };
      },
      transformResponse: (response) => ({
        account_manager: {
          ...response,
          ...response.account_manager,
          assignee: {
            ...response.account_manager.assignee,
            phone: response.account_manager.assignee?.phone ? `+${response.account_manager.assignee.phone}` : null,
            name_l1: response.account_manager.assignee.name_tld,
          },
        },
      }),
    }),
    getPublicEventDetails: build.query({
      query: (eventId) => ({
        url: `/api/surge/public/events/${eventId}`,
        method: 'GET',
      }),
    }),

    createEventBooking: build.mutation({
      query: (bookingData) => ({
        url: '/api/surge/bookings',
        method: 'POST',
        body: bookingData,
      }),
    }),

    updateUserEventInfo: build.mutation({
      query: ({ userId, userData }) => ({
        url: `/api/surge/users/${userId}`,
        method: 'PUT',
        body: userData,
      }),
    }),

    reportUnwantedContact: build.mutation({
      query: (payload) => ({
        url: '/api/surge/reported_contacts',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useGetMonthRulesQuery,
  useLazyGetPackagesQuery,
  useDeleteImageFromBankMutation,
  useLazyGetImageBankQuery,
  useLazyGetActiveProductsQuery,
  useGetActiveProductsQuery,
  useGetAccountManagerInfoQuery,
  useLazyGetS3PreSignedUrlQuery,
  useLazyGetUnreadCountQuery,
  useGetPublicEventDetailsQuery,
  useLazyGetPublicEventDetailsQuery,
  useCreateEventBookingMutation,
  useUpdateUserEventInfoMutation,
  useReportUnwantedContactMutation,
} = commonApis;
