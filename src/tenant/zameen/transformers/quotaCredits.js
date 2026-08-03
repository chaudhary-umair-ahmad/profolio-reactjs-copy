import tenantData from '@data';
import tenantUtils from '@utils';

const getExpiryTitle = (expiryData) => {
  let expiryTitle = '';
  expiryData.forEach((item, i) => {
    expiryTitle += `${item?.available_qty} ${item.title}${
      i !== expiryData.length - 1 && expiryData.length !== 2 ? ', ' : i === expiryData.length - 2 ? ' and ' : ''
    }`;
  });
  return expiryTitle;
};

export const defaultDataForWidget = {
  zameen: [
    {
      id: 2,
      name: 'Listing',
      title: 'Listing Quota',
      slug: 'premium_listing',
    },
    {
      id: 1,
      name: 'Refresh',
      title: 'Refresh Credits',
      slug: 'refresh_listing',
    },
    {
      id: 4,
      name: 'Hot',
      title: 'Hot Credits',
      slug: 'hot_listing',
    },
    {
      id: 5,
      name: 'Super Hot',
      title: 'Super Hot Credits',
      slug: 'shot_listing',
    },
    {
      id: 12,
      name: 'Story',
      title: 'Story Ad Credits',
      slug: 'story_ad',
    },
    {
      id: 13,
      name: 'Photography',
      title: 'Verified Photography Credits',
      slug: 'property_photography',
    },
    {
      id: 14,
      name: 'Videography',
      title: 'Verified Videography Credits',
      slug: 'property_videography',
    },
  ],
  olx: [
    {
      id: 9,
      name: 'Listing',
      title: 'Listing Quota',
      slug: 'olx_premium_listing',
    },
    {
      id: 10,
      name: 'Boost',
      title: 'Boost Credits',
      slug: 'olx_refresh_listing',
    },
    {
      id: 11,
      name: 'Feature',
      title: 'Feature Credits',
      slug: 'olx_feature',
    },
  ],
};

const getDataSets = (data, platform) => {
  let productData;
  if (Array.isArray(data)) {
    productData = data?.map((e) => {
      return {
        ...e,
        dataSet: [e?.used, e?.available],
        ...tenantData.products?.find((it) => e?.id == it?.id),
        name: defaultDataForWidget?.[platform]?.find((item) => item?.id == e?.id)?.name,
        total: e?.used + e?.available, //TO DO Backend
      };
    });
  } else {
    productData = {
      ...data,
      dataSet: [data?.used, data?.available],
      ...tenantData.products?.find((it) => it?.id == data?.id),
      name: defaultDataForWidget?.[platform]?.find((item) => item?.id == data?.id)?.name,
      total: data?.used + data?.available, //TO DO Backend
    };
  }
  return productData;
};

const quotaCreditsWidgetMapper = (response, platform, user = {}) => {
  const data = {};
  delete response.success;
  const productsByPlatform = response;
  Object.keys(productsByPlatform).forEach((platform) => {
    data[platform] = {
      key: platform,
      platform: platform,
      title: platform === 'olx' && !user?.is_shifted_to_olx_quota ? 'Listing and Credits' : 'Quota and Credits',
      titleIcon: platform === 'olx' ? 'IconOLX' : 'IconZameen',
      cardTitle: platform === 'olx' && !user?.is_shifted_to_olx_quota ? 'Listing and Credits' : 'Quota and Credits',
      assignToLink: '/agency-staff',
      buyMoreLink: !!platform === 'zameen' ? '/prop-shop' : undefined,
      products: Object?.keys(productsByPlatform?.[platform])?.length
        ? [
            {
              ...getDataSets(productsByPlatform?.[platform]?.quota, platform),
              ...productsByPlatform?.[platform]?.quota,
              name: defaultDataForWidget?.[platform]?.find(
                (item) => item?.id == productsByPlatform?.[platform]?.quota?.id,
              )?.name,
            },
            ...getDataSets(productsByPlatform?.[platform]?.credits, platform),
          ]
        : defaultDataForWidget?.[platform],
      labels: [
        {
          label: 'Available',
          icon: 'NotOpen',
          type: 'primary',
          slug: 'available',
        },
        {
          label: 'Used',
          icon: 'Opened',
          type: 'success',
          slug: 'used',
        },
      ],
      links: [
        {
          link: '/quota-and-credits',
          link_title: 'View Purchase Logs',
        },
      ],
      colors: ['#9299B8', tenantData.platformList.find((item) => item.slug == platform)?.brandColor],
    };
  });

  return data;
};

const getProductExpiryDataMapper = (response) => {
  const data = response?.credits?.filter((e) => e?.available_qty > 0);

  const productData = data?.length
    ? data?.map((e) => {
        const product = tenantData.quotaCreditProducts?.find((pr) => pr?.id === e?.product_id);
        return { ...product, ...e };
      })
    : [];

  const zameenTitle = `${getExpiryTitle(
    productData?.filter((e) => e?.platformSlug === 'zameen'),
  )} expiring in the next 30 days.`;
  const olxTitle = `${getExpiryTitle(
    productData?.filter((e) => e?.platformSlug === 'olx'),
  )} expiring in the next 30 days.`;

  return {
    zameen: {
      data: productData?.filter((e) => e?.platformSlug === 'zameen')?.length
        ? productData?.filter((e) => e?.platformSlug === 'zameen')
        : [],
      title: zameenTitle,
    },
    olx: {
      data: productData?.filter((e) => e?.platformSlug === 'olx')?.length
        ? productData?.filter((e) => e?.platformSlug === 'olx')
        : [],
      title: olxTitle,
    },
  };
};

const getPurchaseLogsMapper = (response, params) => {
  const quotaProducts = tenantData.products
    .filter((e) => e.product_usage_type === 'quota' || e.type === 'quota')
    .map((e) => ({
      title: e.product_title || e.title,
      dataIndex: (e.product_id || e.id) + '',
      key: (e.product_id || e.id) + '',
      component: 'Number',
    }));
  const creditProducts = tenantData.products
    .filter((e) => e.product_usage_type === 'credit' || e.type === 'credit')
    .map((e) => ({
      title: e.product_title || e.title,
      dataIndex: (e.product_id || e.id) + '',
      key: (e.product_id || e.id) + '',
      component: 'Number',
    }));
  return {
    data: {
      list: response?.purchase_logs?.map((e) => {
        let total = 0;
        const valueObj = {};
        Object.keys(e.transactions).forEach((it) => {
          total += e.transactions[it].quantity;
          valueObj[it + ''] = { value: e.transactions[it].quantity };
        });
        return {
          ...valueObj,
          total: { value: total },
          date: e.date ? { value: e.date } : '-',
          expiry_date: e.expire_date ? { value: e.expire_date } : '-',
          quota_expiry_date: e.quota_expire_date ? { value: e.quota_expire_date } : '-',
        };
      }),
      pagination: tenantUtils.getPaginationObject(response?.pagination),

      table: [
        {
          title: 'Purchase Date',
          dataIndex: 'date',
          key: 'date',
          component: 'Date',
        },
        {
          title: 'Quota',
          children: [
            ...quotaProducts,
            {
              title: 'Expiry Date',
              dataIndex: 'quota_expiry_date',
              key: 'quota_expiry_date',
              component: 'Date',
            },
          ],
          className: 'cellBorderRight',
        },
        {
          title: 'Credit',
          children: [
            ...creditProducts,
            {
              title: 'Expiry Date',
              dataIndex: 'expiry_date',
              key: 'expiry_date',
              component: 'Date',
            },
          ],
        },
        {
          title: 'Total',
          dataIndex: 'total',
          key: 'total',
          component: 'Number',
        },
      ],
    },
  };
};

export default {
  quotaCreditsWidgetMapper,
  getProductExpiryDataMapper,
  getPurchaseLogsMapper,
};
