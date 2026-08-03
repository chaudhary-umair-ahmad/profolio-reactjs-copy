import tenantData from '@data';
import tenantUtils from '@utils';

const separatePackages = (packages) => {
  const yearlyPackages = [];
  const halfYearlyPackages = [];

  packages.forEach((item) => {
    if (item.slug.includes('half-yearly')) {
      halfYearlyPackages.push(packageDataMapper(item));
    } else {
      yearlyPackages.push(packageDataMapper(item));
    }
  });

  return {
    yearly: yearlyPackages,
    halfYearly: halfYearlyPackages,
  };
};
const packageDataMapper = (data) => {
  const type = tenantData.slugToType?.[data?.slug];
  const IS_YEARLY = !data?.slug.includes('half-yearly');
  const firstPlatformSlug = tenantData.platformList?.[0]?.slug;
  const creditsPerMonth = data?.platforms?.[firstPlatformSlug]?.credits_per_month || 
    data?.platforms?.[Object.keys(data?.platforms || {})[0]]?.credits_per_month || 0;

  return {
    ...data,
    id: data.id,
    slug: data.slug,
    name: tenantUtils.getLocalisedString(data, 'name'),
    yearlyCredits: data.total_credits,
    monthlyCredits: data.total_credits / (IS_YEARLY ? 12 : 6),
    credits_per_month: creditsPerMonth,
    oldPrice: data.total_amount,
    price: data.net_amount,
    icon: tenantData.packages?.[type]?.icon,
    iconProps: tenantData.packages?.[type]?.iconProps,
    packageColor: tenantData.packages?.[type]?.packageColor,
    is_applicable: data?.applicable,
  };
};
const packageEndpoints = {
  getPackages: {
    query: ({ months }) => {
      const queryParam = months ? `?per_page=50&q[duration_in_months_eq]=${months}` : `?per_page=50`;
      return `/api/surge/packages${queryParam}`;
    },
    transformer: (response) => {
      if (response.error) {
        return response;
      }
      if (response?.packages?.length) {
        const separatedPackages = separatePackages(response?.packages);
        return {
          benefits: Object.values(response?.packages[0]?.additional_info?.options),
          packageData: {
            12: separatedPackages.yearly,
            6: separatedPackages.halfYearly,
          },
          refundable_amount: response?.refundable_amount,
          pagination: response?.pagination,
        };
      }
      return {};
    },
  },
};

export default packageEndpoints;
