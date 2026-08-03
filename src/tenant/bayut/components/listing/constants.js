export const StaticTabs = {
  AD_LICENSE: 'ad_licenses',
};

export const AdLicenseTab = (adLicenseData, label) => {
  return {
    key: StaticTabs.AD_LICENSE,
    label: `${label} (${adLicenseData?.pagination?.totalCount || 0})`,
    mapping: adLicenseData?.pagination?.totalCount || 0,
    tab: label,
    title: `${label} (${adLicenseData?.pagination?.totalCount})`,
    total: adLicenseData?.pagination?.total_count || 0,
  };
};
