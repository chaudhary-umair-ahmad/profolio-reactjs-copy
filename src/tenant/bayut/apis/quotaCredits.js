import tenantPayloads from '@payloads';
import tenantTransformers from '@transformers';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import store from '@store';
import tenantData from '@data';
import tenantUtils from '@utils';
import { mapQueryParams } from '../../../utility/utility';

const dataMapper = (obj) => {
  const productsHash = {};
  tenantData.products.forEach((e) => {
    productsHash[e.slug] = e;
  });
  return obj.map((item) => {
    return {
      ...item,
      icon: productsHash[item?.product?.slug]?.icon,
      iconColor: productsHash[item?.product?.slug]?.iconColor,
      iconProps: productsHash[item?.product?.slug]?.iconProps,
      appliedDate: item?.performed_at,
      expiryDate: item?.listing?.expiry_date,
    };
  });
};

const summaryDataMapper = (e) => {
  const productsHash = {};
  tenantData.products.forEach((e) => {
    productsHash[e.slug] = e;
  });

  const by_products = e?.product_wise?.map((item) => {
    return {
      ...item,
      icon: productsHash[item.slug]?.icon,
      iconColor: productsHash[item.slug]?.iconColor,
      used_credits: item.consumed_credits,
    };
  });

  let endPoint = 0;
  let lineChartData = '90deg';
  const totalUsed = e?.used;

  let startPoint = 0;
  e?.product_wise?.forEach((e) => {
    endPoint = endPoint + (e.consumed_credits / totalUsed) * 100;
    if (productsHash[e?.slug]) {
      lineChartData += ', ' + productsHash[e?.slug]?.iconColor + ' ' + startPoint + '% ' + endPoint + '%';
    }
    startPoint = endPoint;
  });
  lineChartData = `linear-gradient(${lineChartData})`;
  const totalUsedCredits = by_products.reduce((acc, item) => acc + item.used_credits, 0);

  const chartData = {
    datasets: [
      {
        data: by_products.map((item) => item.used_credits),
        backgroundColor: by_products.map((item) => item.iconColor || 'rgba(0, 0, 0, 0.2)'),
      },
    ],
    total: totalUsedCredits,
    labels: by_products.map((item) => tenantUtils.getLocalisedString(item, 'title')),
  };

  const res = {
    details: [
      { label: 'Available', value: e?.available },
      { label: 'Used', value: e?.used },
      { label: 'Total', value: e?.allocated },
    ],
    by_products: by_products,
    chartData: chartData,
    lineChartData: lineChartData,
  };
  return res;
};

const quotaCreditsApiEndpoints = {
  getCreditDeduction: {
    query: ({ listingId }) => {
      return {
        url: `/api/surge/products/applicable_products?listing_id=${listingId}`,
      };
    },
    transformer: (response) => {
      const products = response?.data?.products;
      if (products?.length) {
        // const applicable_produduct = products?.find((e) => e?.product_id == productId);
        return {
          // [platform]: {
          //   available: 100,
          //   required: applicable_produduct?.credits_required?.['30'],
          //   isZoneArea: false,
          //   zoneFactor: 1,
          //   totalQuota: 100,
          // },
        };
      }
    },
  },
  transferCredits: {
    query: (body) => ({
      url: `/api/surge/credits/transfer`,
      method: 'POST',
      body: tenantPayloads.transferQuotaCreditsPayload(body),
    }),
  },
  getQuotaCreditsForTransfer: {
    query: (query) => ({
      url: `/api/surge/dashboard/qc_summary?${convertQueryObjToString(query)}`,
    }),
    transformer: (response) => tenantTransformers.manageTransferQuotaCreditsTransformer(response),
  },
  transferQuota: {
    query: (body) => ({
      url: `/api/surge/quotas/transfer`,
      method: 'POST',
      body: tenantPayloads.transferQuotaCreditsPayload(body),
    }),
  },
  getQuotaCreditsWidgetData: {
    query: (params) => {
      const user = store.getState().app.loginUser.user;
      const { combineCredits: _combineCredits, ...queryParams } = params || {};
      return {
        url: user?.isCurrencyUser
          ? `/api/surge/credits/summary?${convertQueryObjToString(queryParams)}`
          : `/api/surge/dashboard/qc_summary?${convertQueryObjToString(queryParams)}`,
      };
    },
    transformer: (response, combineCredits) => {
      const user = store.getState().app.loginUser.user;
      if (user?.isCurrencyUser) {
        return tenantTransformers.creditsWidgetMapper(response, combineCredits);
      }
    },
  },

  getCustomCreditsPrice: {
    query: (queryParams) => {
      return { url: `/api/surge/packages/calculate_price?${convertQueryObjToString(queryParams)}` };
    },
    transformer: (response) => tenantTransformers.customCreditsPriceDataMapper(response),
  },

  getConsumptionHistoryData: {
    query: ({ page, params, filtersList }) => {
      const mappedParams = mapQueryParams(params, filtersList);
      return { url: `/api/surge/credits/consumption_history?page=${page || 1}&${mappedParams}` };
    },
    transformer: (response, meta, { platforms }) => {
      let data = {};
      platforms?.forEach((platform) => {
        const platformSlug = platform?.slug;
        const apiKey = platform?.platform_slug || platformSlug;
        const platformData = response?.credits_consumption_history?.[apiKey];

        if (platformData) {
          data[platformSlug] = {
            data: dataMapper(platformData),
            pagination: response?.pagination,
          };
        }
      });

      return data;
    },
  },
  getConsumptionSummaryData: {
    query: () => {
      return { url: `/api/surge/credits/consumption_summary` };
    },
    transformer: (response, meta, { platforms }) => {
      let responses = {};
      platforms?.map((platform) => {
        const platformSlug = platform?.slug;
        const apiKey = platform?.platform_slug || platformSlug;
        if (response?.credits_consumption_summary?.[apiKey]) {
          responses[platformSlug] = summaryDataMapper(response?.credits_consumption_summary?.[apiKey]);
        }
      });
      return responses;
    },
  },
};

export default quotaCreditsApiEndpoints;
