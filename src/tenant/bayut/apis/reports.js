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
import { getDateDiffInDays, getDateLabels, getVariousDates } from '../../../utility/date';
import tenantConstants from '@constants';
import { getQueryString } from '../../../utility/urlQuery';
import moment from 'moment';

const surgeDashboardParamsWithUserFilter = (params) => {
  if (!params) return params;
  const { ['q[user_id_eq]']: legacyUserId, ...rest } = params;
  const userId = params['f[user_id]'] ?? legacyUserId;
  return {
    ...rest,
    ...(userId != null && userId !== '' && { 'f[user_id]': userId }),
  };
};

const reportsApiEndpoints = {
  getListingReportsGraphForksa: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const user = store.getState().app.loginUser?.user;
      const IS_TRACKING_ENABLED =
        !!(user?.is_call_tracking_enabled || user?.is_whatsapp_tracking_enabled) &&
        user?.is_lms_enabled &&
        tenantConstants.IS_LMS_ENABLED;

      const { start_date, end_date } = tenantUtils.getInitialPayload({ ...params }, true);
      const dateArray = getDateLabels(start_date, end_date, 'YYYY-MM-DD');
      const apiCalls = [
        baseQuery(`/api/surge/ovation/stats/trends?${tenantUtils.getInitialPayload(params)}`),
        baseQuery(`/api/surge/ovation/stats/product_stats?${tenantUtils.getInitialPayload(params)}`),
      ];

      if (IS_TRACKING_ENABLED) {
        apiCalls.push(
          baseQuery(
            `/api/surge/lms/stats/product_stats?${tenantUtils.getInitialPayload({ ...params, group_by: ['date', 'ad_product'] })}`,
          ),
          baseQuery(
            `/api/surge/lms/stats/phone_lead_stats?${tenantUtils.getInitialPayload({ ...params, group_by: ['date', 'ad_product'] }, false, ['start_datetime', 'end_datetime'])}`,
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
          results[3]?.value ? tenantTransformers.phoneStatsMapper(results[3]?.value?.data?.stats, dateArray) : null,
          'ksa',
        );
      }
      return { data: formattedData };
    },
  },
  getListingReportsWidgetSummaryForksa: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const { user } = params;
      const apiCalls = [
        baseQuery(`/api/surge/dashboard/listing_stats?${!user?.is_agency_admin ? `f[user_id]=${user?.id}` : ''}`),
        baseQuery(`/api/surge/dashboard/listings_by_area?${!user?.is_agency_admin ? `f[user_id]=${user?.id}` : ''}`),
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
          ),
        };
      }
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
        const listingIds = normalized.listings.map((e) => e?.id);
        const userIds = normalized.listings.map((e) =>
          tenantConstants.KC_ENABLED ? e?.external_id ?? e?.user?.external_id : e?.id,
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
        return { data: tenantTransformers.listingPerformanceBreakdownTableMapper({ data: normalized }, stats, user) };
      }
      return { data: { list: [] } };
    },
  },
  getListingBreakdownTableDataByDate: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const {
        ['filter[date_between]']: dateBetween = `${getVariousDates(29)}`,
        page,
        user,
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
        ...(!user?.is_agency_admin && user?.id != null && user?.id !== -1 && { 'f[user_id]': user.id }),
      };

      const response = await baseQuery(`/api/surge/dashboard/listings_history?${getQueryString(byDateParams)}`);
      if (response) {
        if (response.error || !response?.data?.result) {
          return response;
        } else {
          return {
            data: tenantTransformers.listingBreakdownByDateTableMapper(
              response.data.result,
              response.data?.pagination,
              { page: page ? page : 1 },
            ),
          };
        }
      }
    },
  },

  getListingStatsTableDataByDateForksa: {
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
            : `user_external_ids[]=${tenantConstants.KC_ENABLED ? user?.external_id : userId ? userId : user?.id}`
        }`,
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
              'ksa',
            ),
          };
        }
      }
    },
  },

  getListingsBreakdownWidgetDataForksa: {
    queryFn: async (params, api, extraOptions, baseQuery) => {
      const url = `/api/surge/dashboard/listing_stats?${getQueryString(surgeDashboardParamsWithUserFilter(params))}`;
      const response = await baseQuery({ url });
      return {
        data: tenantTransformers.getListingSummaryStats(response, 'ksa'),
      };
    },
  },
};

export default reportsApiEndpoints;
