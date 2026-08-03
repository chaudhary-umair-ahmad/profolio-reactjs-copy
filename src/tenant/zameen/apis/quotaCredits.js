import tenantTransformers from '@transformers';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import tenantData from '@data';
import { getVariousDates } from '../../../utility/date';
import tenantPayloads from '@payloads';

const quotaCreditsApiEndpoints = {
  getQuotaCreditsWidgetData: {
    query: (params) => {
      return {
        url: `/api/dashboard/qc_summary?${convertQueryObjToString(params)}`,
      };
    },
    transformer: (response) => {
      return tenantTransformers.quotaCreditsWidgetMapper(response);
    },
  },
  getQuotaCreditsForTransfer: {
    query: (query) => ({
      url: `/api/dashboard/qc_summary?${convertQueryObjToString(query)}`,
    }),
    transformer: (response) => tenantTransformers.manageTransferQuotaCreditsTransformer(response),
  },

  transferQuota: {
    query: (body) => ({
      url: `/api/quotas/transfer`,
      method: 'POST',
      body: tenantPayloads.transferQuotaCreditsPayload(body),
    }),
  },

  transferCredits: {
    query: (body) => ({
      url: `/api/credits/transfer`,
      method: 'POST',
      body: tenantPayloads.transferQuotaCreditsPayload(body),
    }),
  },

  getProductExpiryData: {
    query: (id = -1) => {
      const dates = getVariousDates(30, undefined, true).reverse().join(',');
      const queryObj = {
        [`q[expiry_date_gteq]`]: dates?.split(',')?.[0],
        [`q[expiry_date_lteq]`]: dates?.split(',')?.[1],
        ...(!!id && id != -1 && { [`q[user_id_eq]`]: id }),
      };

      return { url: `/api/credits?${convertQueryObjToString(queryObj)}` };
    },
    transformer: (response) => tenantTransformers.getProductExpiryDataMapper(response),
  },
  getPurchaseLogs: {
    query: (queryParams) => {
      const { query, userId } = queryParams;
      return {
        url: `/api/users/${userId}/purchase_logs?${query}`,
      };
    },
    transformer: (response) => {
      return tenantTransformers.getPurchaseLogsMapper(response);
    },
  },

  getQuotaDeductionApi: {
    query: (params) => {
      return {
        url: `/api/quotas/consumption?${convertQueryObjToString(params)}`,
      };
    },
    transformer: (response) => {
      const obj = response?.quota;
      return {
        ...(obj?.zameen && Object?.keys(obj?.zameen)?.length > 0
          ? {
              zameen: {
                available: Number(obj.zameen.available_quota?.toFixed(1)),
                required: Number(obj.zameen.factor?.toFixed(1)),
                isZoneArea: !!(obj.zameen?.factor > 1),
                zoneFactor: Number((obj.zameen.factor - 1).toFixed(1)),
                totalQuota: Number(obj.zameen.total_quota?.toFixed(1)),
                message: obj?.zameen?.message,
              },
            }
          : {
              zameen: {
                available: 0,
                required: 1,
                isZoneArea: false,
                zoneFactor: 0,
                totalQuota: 0,
                message: obj?.zameen?.message,
              },
            }),
        ...(obj?.olx &&
          Object?.keys(obj?.olx)?.length > 0 && {
            olx: {
              available: Number(obj.olx.available_quota?.toFixed(1)),
              required: Number(obj.olx.factor?.toFixed(1)),
              isZoneArea: !!(obj.olx?.factor > 1),
              zoneFactor: Number((obj.olx.factor - 1).toFixed(1)),
              totalQuota: Number(obj.olx.total_quota?.toFixed(1)),
              message: obj?.olx?.message,
            },
          }),
      };
    },
  },

  getCreditDeduction: {
    query: ({ data }) => {
      return {
        url: `/api/credits/consumption?${convertQueryObjToString(data)}`,
      };
    },
    transformer: (response, meta, { platform }) => {
      {
        const obj = response?.credits;
        return {
          [platform]: {
            available: Number(obj?.available_qty?.toFixed(1)),
            required: Number(obj?.factor?.toFixed(1)),
            isZoneArea: !!(obj?.zone_factor > 1),
            zoneFactor: Number((obj?.factor - 1)?.toFixed(1)),
            totalQuota: Number(obj?.available_qty?.toFixed(1)),
          },
        };
      }
    },
  },

  fetchUserquotaCredits: {
    query: (params) => {
      return {
        url: `/api/dashboard/qc_summary`,
      };
    },
    transformer: (response) => {
      const data = response;
      const quotaCredits = { zameen: {}, olx: {} };
      tenantData.platformList?.forEach((e) => {
        quotaCredits[e?.slug]['credits'] = data?.[e?.slug]?.credits?.length
          ? data?.[e?.slug]?.credits?.map((e) => {
              return {
                ...tenantData.getListingActions(tenantData.quotaCreditProducts?.find((pr) => pr?.id === e?.id)?.slug),
                ...e,
              };
            })
          : [];
        quotaCredits[e?.slug]['quota'] = data?.[e?.slug]?.quota
          ? {
              ...tenantData.getListingActions(
                tenantData.quotaCreditProducts?.find((pr) => pr?.id === data?.[e?.slug]?.quota?.id)?.slug,
              ),
              ...data?.[e?.slug]?.quota,
            }
          : {};
      });

      return quotaCredits;
    },
  },
};

export default quotaCreditsApiEndpoints;
