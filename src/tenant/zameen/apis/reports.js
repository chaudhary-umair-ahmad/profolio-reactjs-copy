import tenantConstants from '@constants';
import tenantTransformers from '@transformers';
import tenantUtils from '@utils';
import moment from 'moment';
import { getDateDiffInDays, getVariousDates } from '../../../utility/date';
import { getQueryString } from '../../../utility/urlQuery';
import {
  convertArrayToQueryString,
  getErrorAllResponse,
  getResultGroup,
  mapQueryParams,
  normalizeSurgeListingsResponse,
} from '../../../utility/utility';
import tenantPayloads from '@payloads';

const reportsApiEndpoints = {
  getListingReportsGraphForzameen: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const apiCalls = [
        baseQuery(
          `/api/dashboard/summary_by_date?${tenantUtils.getInitialPayload({ ...params, group_by: 'day', include: params?.stat ?? 'views' })}`,
        ),
        baseQuery(`/api/dashboard/zameen_analytics?${tenantUtils.getInitialPayload(params)}`),
      ];
      const results = await Promise.allSettled(apiCalls);
      const errors = getErrorAllResponse(results);
      if (errors) {
        return { error: errors };
      }
      let formattedData = {};
      if (results[0] && results[1]) {
        formattedData = tenantTransformers.reportsGraphDataMapper(
          results[0]?.value?.data?.stats_summary,
          results[1]?.value?.data?.stats,
          tenantUtils.getInitialPayload(params, true),
        );
      }
      return { data: formattedData };
    },
  },

  getListingReportsGraphForolx: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const apiCalls = [
        baseQuery(`/api/dashboard/olx_product_stats?${tenantUtils.getInitialPayload(params)}`),
        baseQuery(`/api/dashboard/olx_analytics?${tenantUtils.getInitialPayload(params)}`),
      ];

      const results = await Promise.allSettled(apiCalls);
      const errors = getErrorAllResponse(results);
      if (errors) {
        return { error: errors };
      }
      let formattedData = {};

      const sum_lead_count =
        results[1]?.value?.data?.stats?.aggregates?.sum_phone_view_count +
        results[1]?.value?.data?.stats?.aggregates?.sum_sms_view_count +
        results[1]?.value?.data?.stats?.aggregates?.sum_chat_lead_count;

      const summaryData = {
        ...results[1]?.value?.data?.stats,
        aggregates: { ...results[1]?.value?.data?.stats?.aggregates, sum_lead_count },
      };

      if (results[0] && results[1]) {
        formattedData = tenantTransformers.reportsGraphDataMapperOlx(
          results[0]?.value?.data?.stats,
          summaryData,
          tenantUtils.getInitialPayload(params, true),
        );
      }
      return { data: formattedData };
    },
  },

  getListingReportsWidgetSummaryForzameen: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const { user } = params;
      const response = await baseQuery(
        `/api/dashboard/zameen_listings_by_area?${!user?.is_agency_admin ? `q[user_id_eq]=${user?.id}` : ''}`,
      );
      return {
        data: tenantTransformers.widgetParser(response?.data?.listings, 'zameen'),
      };
    },
  },

  getListingReportsWidgetSummaryForolx: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const { user } = params;
      const response = await baseQuery(
        `/api/dashboard/olx_listings_by_area?${!user?.is_agency_admin ? `q[user_id_eq]=${user?.id}` : ''}`,
      );
      return {
        data: tenantTransformers.widgetParser(response?.data?.listings, 'olx'),
      };
    },
  },

  getListingStatsBreakdownTableData: {
    queryFn: async (apiParams, api, extraOptions, baseQuery) => {
      const { user, page } = apiParams;
      const result = await baseQuery(`/api/surge/listings?${mapQueryParams({ page: page })}`);
      if (result?.error) {
        return result;
      }
      const normalized = normalizeSurgeListingsResponse(result?.data);
      if (normalized?.listings?.length) {
        const listingIds = tenantUtils.getListingIdsForOvationStats(user, normalized.listings);
        const userIds = tenantUtils.getUserIdsForOvationStats(user, normalized.listings);
        const payload = tenantPayloads.getListingStatsPayload({
          listingIDs: listingIds?.['olx'],
          userIDs: userIds?.['olx'],
        });

        const stats = await baseQuery(`/api/listings/olx_stats?${payload}`);
        if (stats?.error) {
          return stats;
        }
        return { data: tenantTransformers.listingPerformanceBreakdownTableMapper({ data: normalized }, stats, user) };
      }
      return { data: null };
    },
  },
  getListingBreakdownTableDataByDate: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const {
        ['filter[date_between]']: dateBetween = `${getVariousDates(29)}`,
        page,
        group_by = getResultGroup(
          getDateDiffInDays(typeof dateBetween == 'string' ? dateBetween?.split(',') : dateBetween),
          true,
        )?.result_group,
      } = params;

      const byDateParams = {
        start_date: moment(dateBetween?.split(',')?.[0]).locale('en').format('YYYY-MM-DD'),
        end_date: moment(dateBetween?.split(',')?.[1]).locale('en').format('YYYY-MM-DD'),
        ...(page && { page: page }),
        group_by,
      };

      const response = await baseQuery(`/api/dashboard/listings_product_stats?${getQueryString(byDateParams)}`);
      return {
        data: tenantTransformers.listingBreakdownByDateTableMapper(response.data.listings_product_stats, {
          page: page ? page : 1,
        }),
      };
    },
  },

  getListingStatsTableDataByDateForzameen: {
    queryFn: async (apiParams, api, extraOptions, baseQuery) => {
      const {
        user,
        date_between,
        purpose = 'all',
        page = 1,
        include = 'table_view',
        group_by = 'day',
        userId,
      } = apiParams;
      const paramsObj = {
        start_date: date_between
          ? moment(date_between?.split(',')?.[0]).locale('en').format('YYYY-MM-DD')
          : getVariousDates(30)?.[0],
        end_date: date_between
          ? moment(date_between?.split(',')?.[1]).locale('en').format('YYYY-MM-DD')
          : getVariousDates(30)?.[1],
        ...(page && { page: page }),
        ...(include && { include }),
        ...(group_by && { group_by }),
        ...(userId && { [`q[user_id_eq]`]: userId }),
      };
      const tableData = await baseQuery(
        `/api/dashboard/summary_by_date?${getQueryString(paramsObj)}&${
          !purpose || purpose == 'all'
            ? `purpose_id[]=1&purpose_id[]=2`
            : `purpose_id[]=${purpose == 'sale' ? 1 : purpose == 'rent' ? 2 : purpose == 'dailyrental' ? 4 : purpose}`
        }&${
          user?.is_agency_admin
            ? `agency_external_ids[]=${user?.agency?.id}`
            : `q[user_id_eq]=${tenantConstants.KC_ENABLED ? user?.external_id : user?.id}`
        }`,
      );

      return {
        data: tenantTransformers.listingStatsByDataTableTransformer(tableData?.data?.stats_summary, {
          ...paramsObj,
          page: page,
        }),
      };
    },
  },

  getListingStatsTableDataByDateForolx: {
    queryFn: async (apiParams, api, extraOptions, baseQuery) => {
      const { user, purpose = 'all', page = 1, include = 'table_view', group_by = 'day', userId } = apiParams;

      const paramsObj = {
        start_date: getVariousDates(30)?.[0],
        end_date: getVariousDates(30)?.[1],
        ...(page && { page: page }),
        ...(include && { include }),
        ...(group_by && { group_by }),
        ...(userId && { [`q[user_id_eq]`]: userId }),
      };

      const tableData = await baseQuery(
        `/api/dashboard/olx_product_stats?${getQueryString(paramsObj)}&${
          !purpose || purpose == 'all'
            ? `category_ids[]=1&category_ids[]=2`
            : `category_ids[]=${purpose == 'sale' ? 1 : purpose == 'rent' ? 2 : purpose == 'dailyrental' ? 4 : purpose}`
        }&${
          user?.is_agency_admin
            ? `agency_external_ids[]=${user?.agency?.id}`
            : `q[user_id_eq]=${tenantConstants.KC_ENABLED ? user?.external_id : user?.id}`
        }`,
      );

      return {
        data: tenantTransformers.listingStatsByDataTableTransformerForOlx(tableData?.data?.stats, {
          ...paramsObj,
          page: page,
        }),
      };
    },
  },

  getListingsBreakdownWidgetDataForzameen: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const url = `/api/dashboard/zameen_listings_by_area?${getQueryString(params)}`;
      const response = await baseQuery({ url });
      return {
        data: tenantTransformers.getListingSummaryStats(response, 'zameen'),
      };
    },
  },

  getListingsBreakdownWidgetDataForolx: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const url = `api/dashboard/olx_listings_by_area?${getQueryString(params)}`;
      const response = await baseQuery({ url });
      return {
        data: tenantTransformers.getListingSummaryStats(response, 'olx'),
      };
    },
  },
};

export default reportsApiEndpoints;
