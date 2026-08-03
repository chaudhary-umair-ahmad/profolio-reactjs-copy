import tenantTransformers from '@transformers';
import tenantUtils from '@utils';
import store from '@store';
import {
  convertArrayToQueryString,
  getErrorAllResponse,
  getResultGroup,
  mapQueryParams,
  normalizeSurgeListingsResponse,
} from '../../../utility/utility';
import { getDateDiffInDays, getVariousDates } from '../../../utility/date';
import tenantConstants from '@constants';
import { getQueryString } from '../../../utility/urlQuery';
import moment from 'moment';

const reportsApiEndpoints = {
  getListingReportsGraphForbayut: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const user = store.getState().app.loginUser?.user;
      const IS_TRACKING_ENABLED = !!(user?.is_call_tracking_enabled || user?.is_whatsapp_tracking_enabled);

      const apiCalls = [
        baseQuery(`/api/surge/ovation/stats/trends?${tenantUtils.getInitialPayload(params, false, 'bayut')}&platform_id=1`),
        baseQuery(
          `/api/surge/ovation/stats/product_stats?${tenantUtils.getInitialPayload(params, false, 'bayut')}&platform_id=1`,
        ),
      ];

      if (user?.is_lms_enabled && tenantConstants.IS_LMS_ENABLED && IS_TRACKING_ENABLED) {
        apiCalls.push(
          baseQuery(
            `/api/surge/lms/stats/product_stats?${tenantUtils.getInitialPayload({ ...params, group_by: ['date', 'ad_product'] }, false, 'bayut')}&platform_id=1`,
          ),
        );
      }

      const results = await Promise.allSettled(apiCalls);
      const errors = getErrorAllResponse(results);
      if (errors) {
        return { error: errors };
      }

      let formattedData = {};

      if (results[0] && results[1]) {
        formattedData = tenantTransformers.reportsGraphDataMapper(
          results[0]?.value,
          results[1]?.value,
          results[2]?.value,
          tenantUtils.getInitialPayload(params, true),
          user,
          null,
          'bayut',
        );
      }
      return { data: formattedData };
    },
  },
  getListingReportsGraphFordubizzle: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const user = store.getState().app.loginUser?.user;
      const IS_TRACKING_ENABLED = !!(user?.is_call_tracking_enabled || user?.is_whatsapp_tracking_enabled);
      const apiCalls = [
        baseQuery(
          `/api/surge/ovation/stats/trends?${tenantUtils.getInitialPayload(params, false, 'dubizzle')}&platform_id=2`,
        ),
        baseQuery(
          `/api/surge/ovation/stats/product_stats?${tenantUtils.getInitialPayload(params, false, 'dubizzle')}&platform_id=2`,
        ),
      ];

      if (user?.is_lms_enabled && tenantConstants.IS_LMS_ENABLED && IS_TRACKING_ENABLED) {
        apiCalls.push(
          baseQuery(
            `/api/surge/lms/stats/product_stats?${tenantUtils.getInitialPayload(
              { ...params, group_by: ['date', 'ad_product'] },
              false,
              'dubizzle',
            )}&platform_id=2`,
          ),
        );
      }

      const results = await Promise.allSettled(apiCalls);
      const errors = getErrorAllResponse(results);
      if (errors) {
        return { error: errors };
      }

      let formattedData = {};

      if (results[0] && results[1]) {
        formattedData = tenantTransformers.reportsGraphDataMapper(
          results[0]?.value,
          results[1]?.value,
          results[2]?.value,
          tenantUtils.getInitialPayload(params, true),
          user,
          null,
          'dubizzle',
        );
      }
      return { data: formattedData };
    },
  },
  getListingReportsWidgetSummaryForbayut: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const { user } = params;
      const paramsObj = {
        ...(!user?.is_agency_admin && `q[user_id_eq]=${user?.id}`),
        'q[posted_on_dubizzle_eq]': 'false',
      };
      const apiCalls = [
        baseQuery(`/api/surge/dashboard/listing_stats?${mapQueryParams(paramsObj)}`),
        baseQuery(`/api/surge/dashboard/listings_by_area?${mapQueryParams(paramsObj)}`),
      ];
      const results = await Promise.allSettled(apiCalls);
      const errors = getErrorAllResponse(results);
      if (errors) {
        return { error: errors };
      }
      if (results[0]?.value && results[1]?.value) {
        return {
          data: tenantTransformers.widgetParser(
            { listings: results[0]?.value?.data, areaStats: results[1]?.value?.data },
            user,
            'bayut',
          ),
        };
      }
    },
  },
  getListingReportsWidgetSummaryFordubizzle: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const { user } = params;
      const paramsObj = {
        ...(!user?.is_agency_admin && `q[user_id_eq]=${user?.id}`),
        'q[posted_on_dubizzle_eq]': true,
      };
      const apiCalls = [
        baseQuery(`/api/surge/dashboard/listing_stats?${mapQueryParams(paramsObj)}`),
        baseQuery(`/api/surge/dashboard/listings_by_area?${mapQueryParams(paramsObj)}`),
      ];
      const results = await Promise.allSettled(apiCalls);
      const errors = getErrorAllResponse(results);
      if (errors) {
        return { error: errors };
      }
      if (results[0]?.value && results[1]?.value) {
        return {
          data: tenantTransformers.widgetParser(
            { listings: results[0]?.value?.data, areaStats: results[1]?.value?.data },
            user,
            'dubizzle',
          ),
        };
      }
    },
  },
  getListingStatsBreakdownTableData: {
    queryFn: async (apiParams, api, extraOptions, baseQuery) => {
      const { user, platform, page } = apiParams;
      const params = { ...(platform && { [`q[posted_on_${platform}_true]`]: true, page: page }) };
      const result = await baseQuery(`/api/surge/listings?${mapQueryParams(params)}`);

      if (result?.error) {
        return result;
      }
      const normalized = normalizeSurgeListingsResponse(result?.data);
      if (normalized?.listings?.length) {
        const listingIds = normalized.listings?.map((e) => e?.id);
        const userIds = normalized.listings?.map((e) =>
          tenantConstants.KC_ENABLED ? e?.user?.external_id : e?.id,
        );

        let filteredUserIds = [...new Set(userIds.filter((external_id) => !!external_id))];
        const date_between = getVariousDates(59);
        const params = `${convertArrayToQueryString([1, 2], 'category_ids')}&${convertArrayToQueryString(
          filteredUserIds,
          'user_external_ids',
        )}&${convertArrayToQueryString(['ad_external_id'], 'group_by')}&${convertArrayToQueryString(
          listingIds,
          'ad_external_ids',
        )}`;
        const stats = await baseQuery(
          `/api/surge/ovation/stats?${params}&start_date=${date_between?.[0]}&end_date=${date_between?.[1]}`,
        );
        if (stats?.error) {
          return stats;
        }
        return { data: tenantTransformers.listingPerformanceBreakdownTableMapper({ data: normalized }, stats, user, platform) };
      }
      return { data: { list: [] } };
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
        platform,
      } = params;

      const byDateParams = {
        start_date: moment(dateBetween?.split(',')?.[0]).locale('en').format('YYYY-MM-DD'),
        end_date: moment(dateBetween?.split(',')?.[1]).locale('en').format('YYYY-MM-DD'),
        ...(page && { page: page }),
        group_by,
        ...(platform && { 'q[posted_on_dubizzle_eq]': platform == 'dubizzle' ? true : 'false' }),
      };

      const response = await baseQuery(`/api/surge/dashboard/listings_history?${getQueryString(byDateParams)}`);
      if (response) {
        if (response.error || !response?.data?.result) {
          return response;
        } else {
          return {
            data: tenantTransformers.listingBreakdownByDateTableMapper(
              response.data.result,
              { page: page ? page : 1 },
              platform,
            ),
          };
        }
      }
    },
  },

  getListingStatsTableDataByDateForbayut: {
    queryFn: async (apiParams, api, extraOptions, baseQuery) => {
      const { user, userId, date_between, purpose = 'all', page = 1 } = apiParams;

      const paramsObj = {
        start_date: date_between
          ? moment(date_between?.split(',')?.[0]).locale('en').format('YYYY-MM-DD')
          : getVariousDates(30)?.[0],
        end_date: date_between
          ? moment(date_between?.split(',')?.[1]).locale('en').format('YYYY-MM-DD')
          : getVariousDates(30)?.[1],
        ...(page && { page: page }),
      };

      const tableData = await baseQuery(
        `/api/surge/ovation/stats/product_stats?${getQueryString(paramsObj)}&${
          !purpose || purpose == 'all'
            ? `category_ids[]=1&category_ids[]=2`
            : `category_ids[]=${purpose == 'sale' ? 1 : purpose == 'rent' ? 2 : purpose == 'dailyrental' ? 4 : purpose}`
        }&${
          user?.is_agency_admin
            ? `agency_external_ids[]=${user?.agency?.id}`
            : `user_external_ids[]=${tenantConstants.KC_ENABLED ? user?.external_id : user?.id}`
        }&platform_id=1`,
      );

      if (tableData) {
        if (tableData?.error) {
          return tableData;
        } else {
          return {
            data: tenantTransformers.listingStatsByDataTableTransformer(
              tableData?.data?.stats,
              {
                ...paramsObj,
                page: page,
              },
              'bayut',
            ),
          };
        }
      }
    },
  },
  getListingStatsTableDataByDateFordubizzle: {
    queryFn: async (apiParams, api, extraOptions, baseQuery) => {
      const { user, userId, date_between, purpose = 'all', page = 1 } = apiParams;

      const paramsObj = {
        start_date: date_between
          ? moment(date_between?.split(',')?.[0]).locale('en').format('YYYY-MM-DD')
          : getVariousDates(30)?.[0],
        end_date: date_between
          ? moment(date_between?.split(',')?.[1]).locale('en').format('YYYY-MM-DD')
          : getVariousDates(30)?.[1],
        ...(page && { page: page }),
      };

      const tableData = await baseQuery(
        `/api/surge/ovation/stats/product_stats?${getQueryString(paramsObj)}&${
          !purpose || purpose == 'all'
            ? `category_ids[]=1&category_ids[]=2`
            : `category_ids[]=${purpose == 'sale' ? 1 : purpose == 'rent' ? 2 : purpose == 'dailyrental' ? 4 : purpose}`
        }&${`user_external_ids[]=${tenantConstants.KC_ENABLED ? user?.external_id : user?.id}`}&platform_id=2`,
      );

      if (tableData) {
        if (tableData?.error) {
          return tableData;
        } else {
          return {
            data: tenantTransformers.listingStatsByDataTableTransformer(
              tableData?.data?.stats,
              {
                ...paramsObj,
                page: page,
              },
              'dubizzle',
            ),
          };
        }
      }
    },
  },

  getListingsBreakdownWidgetDataForbayut: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const url = `/api/surge/dashboard/listing_stats?${getQueryString({ ...params, platform_id: 1 })}`;
      const response = await baseQuery({ url });
      return {
        data: tenantTransformers.getListingSummaryStats(response, 'bayut'),
      };
    },
  },
  getListingsBreakdownWidgetDataFordubizzle: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const url = `/api/surge/dashboard/listing_stats?${getQueryString({ ...params, platform_id: 2 })}`;
      const response = await baseQuery({ url });
      return {
        data: tenantTransformers.getListingSummaryStats(response, 'dubizzle'),
      };
    },
  },
};

export default reportsApiEndpoints;
