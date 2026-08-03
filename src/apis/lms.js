import tenantConstants from '@constants';
import tenantUtils from '@utils';
import tenantData from '@data';
import tenantPayloads from '@payloads';
import tenantTransformers from '@transformers';
import rtkApis from '@rtkApis';

import { DATE_BEFORE_TIME_FORMAT } from '../constants/formats';
import { EMAIL_LEADS_TABLE_CONFIG, MAILBOX_TABLE_CONFIG } from '../constants/lmsTableConfigs';
import parentApi from '../store/parentApi';
import { mapQueryParams } from '../utility/utility';
import { getDateLabels } from '../utility/date';

const mapListingLocation = (location) => {
  if (!location) return {};

  const breadcrumb = location?.breadcrumb
    ?.reverse()
    ?.filter((e) => e?.level > 1)
    ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
    ?.join(', ');

  return {
    ...location,
    breadcrumb,
  };
};

const mapListingDetails = (listing) => {
  if (!listing) return {};

  return {
    ...listing?.rega_details?.property_specs,
    listingSpecs: tenantData?.getListingSpecs(listing),
    listing_type: listing?.listing_type,
    regaId: listing?.rega_details?.license_info?.ad_license_number,
    regaExpiryDate: listing?.platforms?.rega_expiry_date,
  };
};

const mapEnquiryAbout = (item) => {
  const listing = item?.listing;
  if (!listing) return {};

  const enquiryAbout = {
    id: listing?.id,
    type: listing?.listing_type,
    area: {
      value: listing?.area_unit?.value,
      unit: listing?.area_unit?.name,
    },
    location: mapListingLocation(listing?.location),
    image: listing?.image,
    price: {
      value: listing?.price,
      currency: tenantConstants.CURRENCY,
    },
    details: mapListingDetails(listing),
  };

  if (listing?.listing_purpose) {
    enquiryAbout.purpose = listing?.listing_purpose;
  }

  if (listing?.health) {
    enquiryAbout.health = listing?.health;
  }

  return enquiryAbout;
};

const mailDetailMapper = (item) => {
  if (!item) return {};

  return {
    id: item?.id,
    enquiry_about: mapEnquiryAbout(item),
    details: {
      name: item?.user_name,
      email: item?.user_email,
      phone: item?.user_phone,
    },
    date: {
      value: item?.datetime,
      format: DATE_BEFORE_TIME_FORMAT,
    },
    emailBody: {
      message: item?.email_body,
      isExpandable: false,
    },
  };
};

const inboxEndpoints = parentApi.injectEndpoints({
  endpoints: (build) => ({
    getMailCount: build.query({
      query: (userId) => {
        return rtkApis.getMailCount?.query(userId) || {
          url: `/api/surge/mailbox/count?user_id=${userId}`,
        };
      },
      transformResponse: (response) => {
        if (rtkApis.getMailCount?.transformer) {
          return rtkApis.getMailCount.transformer(response);
        }
        return response?.count || 0;
      },
    }),
    getMailbox: build.query({
      query: (queryParams) => {
        if (rtkApis.getMailbox?.query) {
          return rtkApis.getMailbox.query(queryParams);
        }
        const { params, userId, type } = queryParams || {};
        const queryObj = {
          ...params,
          ...(userId && { user_id: userId }),
        };
        const mappedParams = mapQueryParams(queryObj);
        return {
          url: `/api/surge/mailbox?${mappedParams}`,
        };
      },
      transformResponse: (response) => {
        if (rtkApis.getMailbox?.transformer) {
          return rtkApis.getMailbox.transformer(response);
        }
        const mappedList = response?.mailbox?.length ? response?.mailbox?.map(mailDetailMapper) : [];
        return {
          table: MAILBOX_TABLE_CONFIG,
          list: mappedList,
          pagination: tenantUtils.getPaginationObject(response?.pagination),
        };
      },
    }),
    postReply: build.mutation({
      query: (params) => {
        return rtkApis.postReply?.query(params) || {
          url: `/api/surge/mailbox/reply`,
          method: 'POST',
          body: params,
        };
      },
    }),
    deleteMailThread: build.mutation({
      query: (params) => {
        return rtkApis.deleteMailThread?.query(params) || {
          url: `/api/surge/mailbox/delete`,
          method: 'DELETE',
          body: params,
        };
      },
    }),
    untrashThead: build.mutation({
      query: (params) => {
        return rtkApis.untrashThead?.query(params) || {
          url: `/api/surge/mailbox/untrash`,
          method: 'PUT',
          body: params,
        };
      },
    }),
    getMessageDetail: build.query({
      query: (messageId) => {
        return rtkApis.getMessageDetail?.query(messageId) || {
          url: `/api/surge/mailbox/message/${messageId}`,
        };
      },
    }),
    getEmailLeads: build.query({
      query: (params) =>
        `/api/surge/dashboard/email_leads?${mapQueryParams({ page: params?.page || 1, platform_id: params?.platform })}`,
      transformResponse: (response) => {
        const mappedList = response?.email_leads?.length ? response?.email_leads?.map(mailDetailMapper) : [];

        return {
          table: EMAIL_LEADS_TABLE_CONFIG,
          list: mappedList,
          pagination: tenantUtils.getPaginationObject(response?.pagination),
        };
      },
      providesTags: ['email-leads'],
    }),

    getLeads: build.query({
      query: (queryParams) => {
        const { params, filtersList } = queryParams;
        const mappedParams = mapQueryParams(params, filtersList);
        return `/api/surge/lms/leads?${mappedParams}`;
      },
      transformResponse: (response) => tenantTransformers.getLeadsMapper(response),
    }),
    getLeadDetail: build.query({
      query: (queryParams) => {
        const { leadId } = queryParams;
        return `/api/surge/lms/leads/${leadId}`;
      },
      transformResponse: (response) => tenantTransformers.leadDetailMapper(response?.leads),
    }),
    getTasksTypes: build.query({
      query: () => `/api/surge/task_types?search_class=Lead`,
      transformResponse: (response) => response?.tasks,
    }),
    getTasksSubTypes: build.query({
      query: (params) => `/api/surge/task_purposes?q[task_type_id_eq]=${params?.taskId}&q[category_eq]=${params?.categoryId}`,
      transformResponse: (response) => response?.task_purposes,
    }),
    getLeadListings: build.query({
      query: (queryParams) => {
        const { leadId, filtersList, params } = queryParams;
        const mappedParams = mapQueryParams(params, filtersList);
        return `/api/surge/lms/leads/${leadId}/listings?${mappedParams}`;
      },
      transformResponse: (response) => {
        return response?.listings?.map((item) => tenantTransformers.listingDetailMapper(item));
      },
    }),
    getTasks: build.query({
      query: (queryParams) => {
        const { leadId, queryObj } = queryParams;
        return `/api/surge/lms/tasks?q[taskable_id_eq]=${leadId}&page=${queryObj?.page || 1}`;
      },
      transformResponse: (response) => tenantTransformers.tasksMapper(response),
    }),
    getLeadInterests: build.query({
      query: (queryParams) => {
        const { leadId, queryObj } = queryParams;
        return `/api/surge/lms/interests?q[lead_id_eq]=${leadId}&page=${queryObj?.page || 1}`;
      },
      transformResponse: (response) => tenantTransformers.leadInterestsMapper(response),
    }),
    getUserActiveListings: build.query({
      query: (queryParams) => {
        const { filtersList, params } = queryParams;
        const mappedParams = mapQueryParams(params, filtersList);
        return `/api/surge/lms/listings?${mappedParams}`;
      },
      transformResponse: (response) => {
        return response?.listings?.map((item) => tenantTransformers.listingDetailMapper(item));
      },
    }),
    getLeadCallRecording: build.query({
      query: (queryParams) => {
        const { recording_uuid } = queryParams;
        return {
          url: `/api/surge/lms/recordings/call?id=${recording_uuid}`,
          method: 'GET',
          responseHandler: async (response) => {
            if (!response.ok) {
              throw new Error(response.error);
            }
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            return audioUrl;
          },
        };
      },
    }),
    getZiwoAICallTrackingData: build.query({
      query: (interestId) => `/api/surge/lms/interests/${interestId}`,
      transformResponse: (response) => tenantTransformers.interestDetailMapper(response),
    }),
    addLeadInterests: build.mutation({
      query: (body) => ({
        url: `/api/surge/lms/interests`,
        method: 'POST',
        body: tenantPayloads.addLeadInterestsPayload(body),
      }),
    }),
    updateLeadInterest: build.mutation({
      query: (params) => ({
        url: `/api/surge/lms/interests/${params?.interestId}`,
        method: 'PUT',
        body: params?.body,
      }),
    }),
    addTask: build.mutation({
      query: (body) => ({
        url: `/api/surge/lms/tasks`,
        method: 'POST',
        body: tenantPayloads.addTaskPayload(body),
      }),
    }),
    updateLeadName: build.mutation({
      query: (params) => ({
        url: `/api/surge/lms/leads/${params?.leadId}`,
        method: 'PUT',
        body: tenantPayloads.updateLeadNamePayload(params?.body),
      }),
    }),
    markLeadAsViewed: build.mutation({
      query: ({ leadId }) => ({
        url: `/api/surge/lms/leads/${leadId}/mark_as_viewed`,
        method: 'PUT',
      }),
      invalidatesTags: ['unread-count'],
    }),
    addLead: build.mutation({
      query: (body) => ({
        url: `/api/surge/lms/leads`,
        method: 'POST',
        body: tenantPayloads.addLeadPayload(body),
      }),
    }),

    getProductStats: build.query({
      queryFn: async (queryParams, api, extraOptions, baseQuery) => {
        const { selectedUser, params } = queryParams || {};
        const leadsStats = await baseQuery(
          `/api/surge/lms/stats/product_stats?${tenantUtils.getLmsInitialPayload({ ...params, group_by: ['date', 'ad_product'], user: selectedUser })}`,
        );

        let phoneStats;
        const { start_date, end_date } = tenantUtils.getLmsInitialPayload({ ...params }, true);
        const dateArray = getDateLabels(start_date, end_date, 'YYYY-MM-DD');

        if (
          !leadsStats?.error &&
          selectedUser?.is_lms_enabled &&
          selectedUser?.is_call_tracking_enabled &&
          tenantConstants.IS_LMS_ENABLED
        ) {
          const phoneStatsResponse = await baseQuery(
            `/api/surge/lms/stats/phone_lead_stats?${tenantUtils.getLmsInitialPayload({ ...params, group_by: ['date', 'ad_product'], user: selectedUser }, false, ['start_datetime', 'end_datetime'])}`,
          );
          phoneStats = phoneStatsResponse?.error
            ? null
            : tenantTransformers.phoneStatsMapper(phoneStatsResponse?.data?.stats, dateArray);
        }
        if (leadsStats) {
          if (leadsStats.error) {
            return leadsStats;
          } else {
            return { data: tenantTransformers.productStatsMapper(leadsStats, selectedUser, phoneStats, dateArray) };
          }
        }
      },
    }),


    getInsightsStats: build.query({
      queryFn: async (queryParams, api, extraOptions, baseQuery) => {
        const { selectedUser, params, identifier } = queryParams || {};
        const queryString = tenantUtils.getLmsInitialPayload({
          ...params,
          group_by: ['date', 'ad_product'],
          user: selectedUser
        });
        const url = `/api/surge/lms/stats/insights?${queryString}&identifier=${identifier}`;

        const response = await baseQuery(url);

        if (response?.error) {
          return response;
        }

        return { data: response?.data };
      },
    }),

    getResponseTimeMetrics: build.query({
      queryFn: async (queryParams, api, extraOptions, baseQuery) => {
        const { selectedUser, params, identifier } = queryParams || {};
        const queryString = tenantUtils.getLmsInitialPayload({
          ...params,
          group_by: ['date', 'ad_product'],
          user: selectedUser
        });
        const url = `/api/surge/lms/stats/response_time_metrics?${queryString}&identifier=${identifier}`;

        const response = await baseQuery(url);

        if (response?.error) {
          return response;
        }

        return { data: response?.data };
      },
    }),

    getResponseTimeGraph: build.query({
      query: (queryParams) => {
        const { selectedUser, params, identifier } = queryParams || {};
        const queryString = tenantUtils.getLmsInitialPayload({
          ...params,
          group_by: ['date', 'ad_product'],
          user: selectedUser
        });
        return `/api/surge/lms/stats/response_time_graph?${queryString}&identifier=${identifier}`;
      },
      transformResponse: (response) => {
        return tenantTransformers.transformResponseTimeGraphData(response);
      },
    }),

    getUserPerformance: build.query({
      query: (queryParams) => {
        const { params, page = 1, per_page = 10 } = queryParams || {};
        const queryString = tenantUtils.getLmsInitialPayload(params);
        return `/api/surge/lms/leads/user_performance?${queryString}page=${page}&per_page=${per_page}`;
      },
      transformResponse: (response, meta, arg) => {
        if (!response?.users) return response;

        const { per_page = 10 } = arg || {};
        const paginationWithPerPage = response?.pagination ? {
          ...response.pagination,
          per_page: per_page
        } : null;

        return {
          ...response,
          users: response?.users?.map(user => ({
            ...user,
            user_detail: {
              user_name: user?.user_name,
              user_email: user?.user_email,
              user_mobile: user?.user_mobile,
              user_profile_image: user?.user_profile_imgae
            }
          })) || [],
          pagination: paginationWithPerPage ? tenantUtils.getPaginationObject(paginationWithPerPage) : null
        };
      },
    }),

    getUserBadgesCriteria: build.query({
      query: () => `/api/surge/users/user_badge_eligibility`,
      transformResponse: (response) => response,
    }),

  }),
});

export const {
  useLazyGetMailCountQuery,
  useDeleteMailThreadMutation,
  useLazyGetMessageDetailQuery,
  useUntrashTheadMutation,
  usePostReplyMutation,
  useLazyGetMailboxQuery,
  useGetEmailLeadsQuery,
  useGetLeadsQuery,
  useGetProductStatsQuery,
  useGetInsightsStatsQuery,
  useGetResponseTimeMetricsQuery,
  useGetResponseTimeGraphQuery,
  useGetUserPerformanceQuery,
  useGetUserBadgesCriteriaQuery,
  useLazyGetLeadListingsQuery,
  useGetTasksTypesQuery,
  useLazyGetTasksSubTypesQuery,
  useLazyGetUserActiveListingsQuery,
  useAddLeadInterestsMutation,
  useAddTaskMutation,
  useLazyGetLeadDetailQuery,
  useLazyGetLeadInterestsQuery,
  useLazyGetTasksQuery,
  useUpdateLeadNameMutation,
  useLazyGetLeadCallRecordingQuery,
  useUpdateLeadInterestMutation,
  useAddLeadMutation,
  useMarkLeadAsViewedMutation,
  useLazyGetZiwoAICallTrackingDataQuery,
} = inboxEndpoints;
