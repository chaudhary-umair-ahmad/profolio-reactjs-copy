import tenantData from '@data';
import store from '@store';
import tenantConstants from '@constants';

const defaultDataForWidget = {
  ksa: [
    {
      id: 14,
      name: 'Normal Listing',
    },
    {
      id: 15,
      name: 'Hot Listing',
    },
    {
      id: 16,
      name: 'Super Hot Listing',
    },
    {
      id: 17,
      name: 'Credit',
    },
    {
      id: 18,
      name: 'Photography Service',
    },
    {
      id: 19,
      name: 'Videography Service',
    },
    {
      id: 39,
      name: 'Refresh Listing',
    },
  ],
};

const getDataSetsForCredits = (data, platform) => {
  let productData;
  productData = data?.map((e) => {
    return {
      ...e,
      dataSet: [e?.used, e?.available],
      ...tenantData.products?.find((it) => it?.id == 17), //as only credit
      name: defaultDataForWidget?.[platform]?.find((item) => item?.id == 17)?.name,
    };
  });
  return productData;
};

const widgetMapper = (platform, productsByPlatform) => {
  const slug = tenantConstants.PLATFORM_KEY ? platform?.platform_slug : platform?.slug;
  const platformData = productsByPlatform?.[slug] || productsByPlatform?.[platform?.slug] || productsByPlatform?.[platform?.platform_slug];
  return {
    key: platform?.slug,
    platform,
    title: 'Credits Balance',
    cardTitle: 'Credits',
    assignToLink: '/agency-staff',
    buyMoreLink: '/prop-shop',
    products: getDataSetsForCredits([platformData], slug),
    current_package_details: productsByPlatform?.current_package,
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
        link: '/credits-usage',
        link_title: 'About Bayut Credits',
      },
    ],
    colors: ['#9299B8', tenantData.platformList.find((item) => item.slug === platform?.slug).brandColor],
  };
};

export const creditsWidgetMapper = (response, combineCredits = false) => {
  const user = store.getState().app.loginUser.user;
  const quotaCredits = {};
  const { platformList } = tenantData;

  const normalizedResponse = { ...response };

  if (normalizedResponse?.credits_summary) {
    const normalizedCreditsSummary = {};
    let rootCurrentPackage = null;

    Object.keys(normalizedResponse.credits_summary).forEach((platformKey) => {
      const platformData = normalizedResponse.credits_summary[platformKey];
      if (!platformData || typeof platformData !== 'object' || Array.isArray(platformData) || platformKey === 'current_package') {
        return;
      }
      const normalized = {
        ...platformData,
        expiring_credits: platformData?.expiring ?? 0,
        total: platformData?.allocated ?? 0,
        product_wise: platformData?.product_wise || [],
      };
      
      if (platformData?.current_package) {
        rootCurrentPackage = platformData.current_package;
      }

      const matchingPlatform = platformList?.find((p) => {
        if (!!tenantConstants.PLATFORM_KEY) {
          return p?.platform_slug === platformKey;
        }
        return p?.platform_slug === platformKey || p?.slug === platformKey;
      });

      const targetKey = matchingPlatform?.platform_slug === platformKey 
        ? matchingPlatform?.platform_slug 
        : (tenantConstants.PLATFORM_KEY ? matchingPlatform?.platform_slug : matchingPlatform?.slug);
      
      if (targetKey) {
        normalizedCreditsSummary[targetKey] = normalized;
      }
    });

    if (rootCurrentPackage) {
      normalizedCreditsSummary.current_package = rootCurrentPackage;
    }
    normalizedResponse.credits_summary = normalizedCreditsSummary;
  }
  if (combineCredits) {
    const combinedCredits = {};
    const defaultPlatform = platformList?.[0];

    platformList.forEach((platform) => {
      const platformCredits = normalizedResponse?.credits_summary?.[platform?.platform_slug];
      if (platformCredits) {
        Object.entries(platformCredits).forEach(([key, value]) => {
          if (typeof value === 'number') {
            combinedCredits[key] = (combinedCredits[key] || 0) + value;
          } else if (!combinedCredits[key]) {
            combinedCredits[key] = value;
          }
        });
      }
    });

    const clubbedPlatformKey = defaultPlatform?.platform_slug;
    const clubbedData = {
      [clubbedPlatformKey]: combinedCredits,
      current_package: { ...normalizedResponse?.credits_summary?.current_package },
    };

    quotaCredits[defaultPlatform.slug] = widgetMapper(defaultPlatform, clubbedData);
  } else {
    platformList.forEach((platform) => {
      const platformSlug = platform?.slug;

      if (user?.isCurrencyUser) {
        quotaCredits[platformSlug] = widgetMapper(platform, normalizedResponse?.credits_summary);
      } else if (response?.data?.[platformSlug]) {
        const platformData = {
          ...normalizedResponse?.credits_summary?.[platformSlug],
          current_package: normalizedResponse?.credits_summary?.current_package || 
                          normalizedResponse?.credits_summary?.[platformSlug]?.current_package
        };
        quotaCredits[platformSlug] = widgetMapper(platform, platformData);
      }
    });
  }
  return quotaCredits;
};


const quotaCreditsDataMapper = (values, combineCredits) => {
  const quotaCredits = {};
  tenantData.platformList.forEach((e) => {
    quotaCredits[e.slug] = creditsWidgetMapper(e, values?.credits_summary, combineCredits);
  });

  return quotaCredits;
};

const customCreditsPriceDataMapper = (values) => {
  return { price: values?.net_price, nonDiscountedPrice: values?.price, durationMonths: values?.duration_in_months };
};

export const manageTransferQuotaCreditsTransformer = (user) => {
  const loggedInUser = store.getState().app.loginUser.user;
  const data = {};

  tenantData.platformList.forEach((platform) => {
    let { quota = {}, credits = [] } = user?.[platform?.slug];
    //removed video and photo credits bcz no need to show these credits in transfer quota screen right now
    credits = credits?.length ? credits?.filter((e) => e.id !== 13 && e.id !== 14) : [];
    credits.unshift(quota);
    const platformProducts = [];
    tenantData.products?.forEach(
      (e) =>
        credits?.find((it) => it?.id === e?.id) &&
        platformProducts.push({ ...e, ...credits?.find((it) => it?.id === e?.id) }),
    );
    data[platform.slug] = {
      title: loggedInUser?.is_shifted_to_olx_quota ? 'Quota and Credits' : 'Listings and Credits',
      icon: platform.icon,
      zones: { all: platformProducts },
      platformText: platform?.title,
    };
  });
  return data;
};

export default {
  creditsWidgetMapper,
  quotaCreditsDataMapper,
  customCreditsPriceDataMapper,
  manageTransferQuotaCreditsTransformer,
};
