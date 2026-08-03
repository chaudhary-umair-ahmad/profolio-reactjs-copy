import { trackEventGA4 } from './gtmEventHandler';
import tenantConstants from '@constants';
import {
  PAGE_TYPES,
  INTERACTED_FROM,
  WEBSITE_SECTIONS,
  getCommonParams,
  PAGE_GROUPS,
  PAGE_SECTIONS,
  STRINGS,
  statusMap,
  EVENT_NAMES,
  EVENT_CATEGORIES,
  getPageType,
} from './constants';

export const addPropertyEvent = (user, currentPathSlug, isSideMenu) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.ADD_PROPERTY_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: isSideMenu ? PAGE_TYPES.SIDE_MENU : currentPathSlug,
      interacted_from: isSideMenu
        ? INTERACTED_FROM.SIDE_MENU
        : user?.is_package_user
          ? INTERACTED_FROM.HEADER_PROFOLIO
          : INTERACTED_FROM.HEADER_LITE,

      ...commonParams,
    },
  });
};

export const regaAdValidationEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.REGA_AD_VALIDATION_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.DETAILS,
      ...commonParams,
    },
  });
};

export const pageViewPostListingsDetailEvent = (user, is_new) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    page_title: 'add-property-form',
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.DETAILS,
      page_section: is_new ? PAGE_SECTIONS.NEW : PAGE_SECTIONS.EDIT,
      posting_reason: is_new ? STRINGS.NEW : STRINGS.EDIT,
      ...commonParams,
    },
  });
};
export const editListingClickEvent = (user, listingData, discountAppliedFromResponse) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.EDIT_LISTING,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_type: PAGE_TYPES.ACTIONS,
      value: listingData,
      discount_applied: discountAppliedFromResponse ?? listingData?.property_discount_enabled,
      ...commonParams,
    },
  });
};

export const regaInformationClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.DETAILS,
      page_section: PAGE_SECTIONS.REGA_DETAILS,
      ...commonParams,
    },
  });
};

export const regaQRCodeClickEvent = (user, is_qr, license_info) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.DETAILS,
      page_section: is_qr ? PAGE_SECTIONS.REGA_QR : PAGE_SECTIONS.REGA_LINK,
      ad_license_number: license_info.ad_license_number,
      ...commonParams,
    },
  });
};
export const changeLocationClickEvent = (user, formValues, is_new) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.CLICK_MAP,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.DETAILS,
      page_section: PAGE_SECTIONS.MAP,
      property_type: formValues?.listing_type?.title
        ? formValues?.listing_type?.title
        : formValues?.property_type_label,
      posting_reason: is_new ? STRINGS.NEW : STRINGS.EDIT,
      ...commonParams,
    },
  });
};

export const changeLocationConfirmEvent = (user, formValues, is_new) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.MAP_PIN_SELECTED_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.DETAILS,
      property_type: formValues?.listing_type?.title
        ? formValues?.listing_type?.title
        : formValues?.property_type_label,
      posting_reason: is_new ? STRINGS.NEW : STRINGS.EDIT,
      ...commonParams,
    },
  });
};

export const generateTitleClickEvent = (user, response, formValues) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.GENERATE_TITLE_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.DETAILS,
      page_section: PAGE_SECTIONS.TITLE,
      status: response.error ? STRINGS.ERROR : STRINGS.SUCCESS,
      property_type: formValues?.listing_type?.title
        ? formValues?.listing_type?.title
        : formValues?.property_type_label,
      posting_reason: !formValues.is_posted ? STRINGS.NEW : STRINGS.EDIT,
      ...commonParams,
    },
  });
};

export const generateDescriptionClickEvent = (user, response, formValues) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.GENERATE_DESCRIPTION_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.DETAILS,
      page_section: PAGE_SECTIONS.DESCRIPTION,
      status: response.error ? STRINGS.ERROR : STRINGS.SUCCESS,
      property_type: formValues?.listing_type?.title
        ? formValues?.listing_type?.title
        : formValues?.property_type_label,
      posting_reason: !formValues.is_posted ? STRINGS.NEW : STRINGS.EDIT,
      ...commonParams,
    },
  });
};

export const getTopUpClickEvent = (user, credits) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PACKAGE_BUYING_CAT,
    event: EVENT_NAMES.GET_TOPUP_ACT,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.PACKAGES,
      page_type: PAGE_TYPES.DETAILS,
      get_package_type: credits,
      ...commonParams,
    },
  });
};

export const suggestCreditsClickEvent = (user, credits) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PACKAGE_BUYING_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.PACKAGES,
      page_type: PAGE_TYPES.DETAILS,
      get_package_type: credits,
      ...commonParams,
    },
  });
};

export const emailButtonClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ACCOUNT_MANAGER_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.HELP_CENTRE,
      page_type: PAGE_TYPES.ACCOUNT_MANAGER,
      page_section: PAGE_SECTIONS.EMAIL,
      ...commonParams,
    },
  });
};

export const whatsappButtonClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ACCOUNT_MANAGER_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.HELP_CENTRE,
      page_type: PAGE_TYPES.ACCOUNT_MANAGER,
      page_section: PAGE_SECTIONS.WHATSAPP,
      ...commonParams,
    },
  });
};

export const phoneCallButtonClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ACCOUNT_MANAGER_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.HELP_CENTRE,
      page_type: PAGE_TYPES.ACCOUNT_MANAGER,
      page_section: PAGE_SECTIONS.CALL,
      ...commonParams,
    },
  });
};

export const pageViewDashboardEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PAGE_VIEW_SIDE_MENU_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.REPORTS,
      page_type: PAGE_TYPES.DASHBOARD,
      interacted_from: INTERACTED_FROM.SIDE_MENU,
      ...commonParams,
    },
  });
};

export const clickMarketingBannerEvent = (user, { language, pageTitle, bannerId }) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.DASHBOARD,
    event: EVENT_NAMES.CLICK_MARKETING_BANNER,
    is_non_interaction: false,
    params: {
      language,
      page_title: pageTitle,
      signed_in: user?.id ? STRINGS.YES : STRINGS.NO,
      user_id: user?.id ?? null,
      page_group: PAGE_GROUPS.DASHBOARD,
      value: bannerId ?? null,
      national_id: user?.national_id ?? null,
      ...commonParams,
    },
  });
};

const engagementBaseParams = (user, pageTitle, language) => {
  const commonParams = getCommonParams(user);
  return {
    ...commonParams,
    user_id: user?.id,
    page_title: pageTitle,
    language,
    national_id: user?.national_id ?? null,
  };
};


export const applyDiscountEvent = (user, { discountApplied, pageTitle, language }) => {
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.APPLY_DISCOUNT,
    is_non_interaction: false,
    params: {
      ...engagementBaseParams(user, pageTitle, language),
      website_section: WEBSITE_SECTIONS.PROFOLIO,
      page_group: PAGE_GROUPS.LISTINGS,
      value: discountApplied,
    },
  });
};

export const pageViewCreditUsageEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PAGE_VIEW_SIDE_MENU_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.REPORTS,
      page_type: PAGE_TYPES.CREDIT_USAGE,
      interacted_from: INTERACTED_FROM.SIDE_MENU,
      ...commonParams,
    },
  });
};

export const pageViewReportSummaryEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PAGE_VIEW_SIDE_MENU_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.REPORTS,
      page_type: PAGE_TYPES.SUMMARY,
      interacted_from: INTERACTED_FROM.SIDE_MENU,
      ...commonParams,
    },
  });
};

export const pageViewLeadsReportEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PAGE_VIEW_SIDE_MENU_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.REPORTS,
      page_type: PAGE_TYPES.LEADS,
      interacted_from: INTERACTED_FROM.SIDE_MENU,
      ...commonParams,
    },
  });
};

export const pageViewListingReportEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PAGE_VIEW_SIDE_MENU_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.REPORTS,
      page_type: PAGE_TYPES.LISTINGS,
      interacted_from: INTERACTED_FROM.SIDE_MENU,
      ...commonParams,
    },
  });
};

export const pageViewAgencyStaffEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PAGE_VIEW_SIDE_MENU_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.AGENCY,
      page_type: PAGE_TYPES.AGENCY_STAFF,
      interacted_from: INTERACTED_FROM.SIDE_MENU,
      ...commonParams,
    },
  });
};

export const pageViewAgencySettingEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PAGE_VIEW_SIDE_MENU_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.AGENCY,
      page_type: PAGE_TYPES.AGENCY_SETTINGS,
      interacted_from: INTERACTED_FROM.SIDE_MENU,
      ...commonParams,
    },
  });
};
export const agencySaveChangesEvent = (user, agencyData, error) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.SETTINGS,
    event: EVENT_NAMES.AGENCY_SETTINGS,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.SETTINGS,
      page_type: PAGE_TYPES.AGENCY_SETTINGS,
      value: agencyData,
      status: error ? STRINGS.ERROR : STRINGS.SUCCESS,
      ...commonParams,
    },
  });
};
export const pageViewUserSettingEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PAGE_VIEW_SIDE_MENU_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.AGENCY,
      page_type: PAGE_TYPES.USER_SETTINGS,
      interacted_from: INTERACTED_FROM.SIDE_MENU,
      ...commonParams,
    },
  });
};
export const userSaveChangesEvent = (user, userData, error) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.SETTINGS,
    event: EVENT_NAMES.USER_SETTINGS,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.SETTINGS,
      page_type: PAGE_TYPES.USER_SETTINGS,
      value: userData,
      status: error ? STRINGS.ERROR : STRINGS.SUCCESS,
      ...commonParams,
    },
  });
};
export const myListingClickEvent = (user, interactedFrom) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.MY_LISTINGS,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      interacted_from: interactedFrom ? PAGE_TYPES.SIDE_MENU : PAGE_TYPES.HEADER,
      ...commonParams,
    },
  });
};
export const pageViewMyListingEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PAGE_VIEW_SIDE_MENU_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      interacted_from: user.is_package_user ? INTERACTED_FROM.HEADER_PROFOLIO : INTERACTED_FROM.HEADER_LITE,
      ...commonParams,
    },
  });
};

export const helpCenterClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ACCOUNT_MANAGER_CAT,
    event: EVENT_NAMES.HELP_CENTRE_CLICK_ACT,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.HELP_CENTRE,
      page_type: PAGE_TYPES.HELP_CENTRE,
      ...commonParams,
    },
  });
};

export const profolioButtonClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ACCOUNT_MANAGER_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.HELP_CENTRE,
      page_type: PAGE_TYPES.PROFOLIO,
      ...commonParams,
    },
  });
};

export const regaComplianceClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ACCOUNT_MANAGER_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.HELP_CENTRE,
      page_type: PAGE_TYPES.REGA_COMPLIANCE,
      ...commonParams,
    },
  });
};

export const faqSectionClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ACCOUNT_MANAGER_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.HELP_CENTRE,
      page_type: PAGE_TYPES.FAQ,
      ...commonParams,
    },
  });
};
export const pageViewPackageScreenEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PACKAGE_BUYING_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      page_group: PAGE_GROUPS.PACKAGES,
      page_type: PAGE_TYPES.DETAILS,
      interacted_from: INTERACTED_FROM.SIDE_MENU,
      ...commonParams,
    },
  });
};
export const packageMonthClickEvent = (user, packageDuration) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PACKAGE_BUYING_CAT,
    event: EVENT_NAMES.PACKAGE_DURATION,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.PACKAGES,
      page_type: PAGE_TYPES.DETAILS,
      page_section: PAGE_SECTIONS.PACKAGE_DURATION,
      current_package_duration: packageDuration,
      ...commonParams,
    },
  });
};
export const packageSelectEvent = (user, type, duration) => {
  const commonParams = getCommonParams(user, type, duration);
  trackEventGA4({
    category: EVENT_CATEGORIES.PACKAGE_BUYING_CAT,
    event: user?.package ? EVENT_NAMES.CLICK_UPGRADE_ACT : EVENT_NAMES.GET_PACKAGE_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.PACKAGES,
      page_type: PAGE_TYPES.PACKAGES,
      purpose: user?.package ? 'upgrade' : 'buy',
      package_type: type,
      ...commonParams,
    },
  });
};
export const upgradePackageConfirmClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PACKAGE_BUYING_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.PACKAGES,
      ...commonParams,
    },
  });
};
export const imageUploadSuccessEvent = (user, response, is_new, formValues) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.IMAGE_UPLOAD_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.DETAILS,
      status: response.status === 200 ? STRINGS.SUCCESS : STRINGS.ERROR,
      value: response.status === 200 ? null : response.statusText,
      property_type: formValues?.listing_type?.title || formValues?.property_type_label,
      posting_reason: is_new ? STRINGS.NEW : STRINGS.EDIT,
      ...commonParams,
    },
  });
};
const getPlatformsMap = (listingData) => {
  if (listingData?.platforms) return listingData.platforms;
  if (Array.isArray(listingData?.platform_listings)) {
    return listingData.platform_listings.reduce((acc, pl) => {
      const slug = pl?.platform?.slug;
      if (slug) acc[slug] = pl;
      return acc;
    }, {});
  }
  return {};
};

export const pageViewUpsellEvent = (user, listingData) => {
  if (!user || !listingData) return;
  const commonParams = getCommonParams(user);
  const selected_platform = user?.platforms?.map((platform) => platform?.name)?.filter(Boolean) || [];
  const platforms = listingData?.platforms || {};
  const listing_disposition = selected_platform.map(
    (platform) => `${platforms[platform?.toLowerCase()]?.disposition?.slug ?? ''}${platform ?? ''}`,
  );
  const listing_status = selected_platform.map(
    (platform) => `${platforms[platform?.toLowerCase()]?.status?.slug ?? ''}${platform ?? ''}`,
  );
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.UPSELL,
      listing_type: 'basic',
      listing_status: listing_status,
      listing_disposition: listing_disposition,
      listing_purpose: listingData?.listing_purpose?.slug ?? '',
      ...commonParams,
    },
  });
};
export const upgradeButtonUpsellClickEvent = (user, response, appliedProduct, listingData) => {
  if (!user) return;
  const selected_platform = user?.platforms?.map((platform) => platform?.name)?.filter(Boolean) || [];
  const platforms = listingData?.platforms || {};
  const listing_disposition = selected_platform.map(
    (platform) => `${platforms[platform?.toLowerCase()]?.disposition?.slug ?? ''}${platform ?? ''}`,
  );
  const listing_status = selected_platform.map(
    (platform) => `${platforms[platform?.toLowerCase()]?.status?.slug ?? ''}${platform ?? ''}`,
  );
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.UPSELL_SUBMIT_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.UPSELL,
      status: response?.data?.success ? STRINGS.SUCCESS : STRINGS.ERROR,
      listing_disposition: listing_disposition,
      listing_status: listing_status,
      listing_type: appliedProduct,
      listing_purpose: listingData?.listing_purpose?.slug ?? '',
      listing_bayut_id: listingData?.id || null,
      listing_dubizzle_id: platformsMap?.dubizzle?.platform_listing_id,
      ...(tenantConstants.UPSELL_SERVICES
        ? {
            photography_service: !!listingData['photography-service'] ? 'yes' : 'no',
            videography_service: !!listingData['videography-service'] ? 'yes' : 'no',
            drone_service: !!listingData['drone-footage-service'] ? 'yes' : 'no',
          }
        : {}),
      ...commonParams,
    },
  });
};

export const postListingClickEvent = (user, response, listingData, is_new, isUpdate) => {
  const commonParams = getCommonParams(user);
  const discountApplied = response?.listing?.discount_applied ?? listingData?.property_discount_enabled;
  const selected_platform = user.platforms.map((platform) => platform.name);
  const platforms = response?.listing?.platforms;
  const listing_disposition = selected_platform.map(
    (platform) => `${platforms?.[platform.toLowerCase()]?.disposition?.slug ?? ''}${platform}`,
  );
  const listing_status = selected_platform.map(
    (platform) => `${platforms?.[platform.toLowerCase()]?.status?.slug ?? ''}${platform}`,
  );
  const featuresCount = listingData?.feature_and_amenities
    ? Object.values(listingData?.feature_and_amenities)?.filter((value) => value === true).length
    : 0;
  trackEventGA4({
    category: isUpdate ? EVENT_CATEGORIES.MANAGE_LISTING_CAT : EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: isUpdate ? EVENT_NAMES.UPDATE_LISTING_ACT : EVENT_NAMES.ADD_PROPERTY_ACT,
    is_non_interaction: false,
    params: {
      pagetype: PAGE_TYPES.DETAILS,
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      status: response?.data?.success ? STRINGS.SUCCESS : STRINGS.ERROR,
      property_type: listingData?.listing_type?.title || listingData?.property_type_label,
      selected_platform: selected_platform,
      listing_status: listing_status,
      listing_disposition: listing_disposition,
      purpose: listingData?.purpose == 1 ? 'sale' : 'rent',
      rental_frequency: listingData?.rental_frequency ? listingData?.rental_frequency : 0,
      amenities_added: featuresCount,
      bedrooms_selected: listingData?.bedrooms,
      bathrooms_selected: listingData?.bathrooms,
      price: listingData?.price ? listingData?.price : listingData?.rental_price,
      city: listingData?.['location-info'].city?.city_title,
      furnished: listingData?.furnished ? 'yes' : 'no',
      images_added: listingData.property_images.length,
      posting_reason: is_new ? STRINGS.NEW : STRINGS.EDIT,
      area: listingData?.area_unit?.value ? listingData?.area_unit?.value : listingData?.area,
      listing_bayut_id: response?.listing?.id || null,
      listing_dubizzle_id: response?.listing?.platforms?.dubizzle?.platform_listing_id,
      discount_applied: discountApplied ? 'yes' : 'no',
      ...commonParams,
    },
  });
};
export const filterClickEvent = (user, filterName, selectedOption) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.ADD_FILTER,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_type: PAGE_TYPES.HEADER,
      name: selectedOption,
      value: filterName,
      ...commonParams,
    },
  });
};
export const pageViewCheckoutEvent = (user, interactedFrom, cartData) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.CHECKOUT,
      interacted_from: interactedFrom,
      value: cartData?.total,
      ...commonParams,
    },
  });
};

export const checkoutPayConfirmEvent = (user, interactedFrom, cartData, paymentMethod, status, purpose) => {
  const commonParams = getCommonParams(user, cartData?.cartProducts?.[0]?.title);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.PAY_CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: cartData?.listing_id ? PAGE_GROUPS.MANAGE_LISTING : PAGE_GROUPS.PACKAGES,
      page_type: PAGE_TYPES.CHECKOUT,
      payment_method: paymentMethod,
      status: status ? STRINGS.SUCCESS : STRINGS.ERROR,
      current_package: user?.package ? user?.package?.slug : null,
      listing_id: cartData?.listing_id,
      value: cartData?.total,
      purpose: purpose,
      // listing_type: listingType,
      // listing_status: listingData.status.name,
      // listing_disposition: listingData.disposition.name,
      ...commonParams,
    },
  });
};

export const clickPayNowEvent = (user, pageTitle, paymentMethod, language) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.EVENT_CHECKOUT,
    event: 'click_pay_now',
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.BAYUT_WORKSHOPS,
      page_type: PAGE_TYPES.CHECKOUT_PAGE,
      page_title: pageTitle,
      payment_method: paymentMethod,
      language: language,
      ...commonParams,
    },
  });
};

export const otpCompletedEvent = (user, pageTitle, language) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.EVENT_CHECKOUT,
    event: 'otp_completed',
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.BAYUT_WORKSHOPS,
      page_type: PAGE_TYPES.CHECKOUT_PAGE,
      page_title: pageTitle,
      language: language,
      ...commonParams,
    },
  });
};

export const otpPopupClosedEvent = (user, pageTitle, language) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.EVENT_CHECKOUT,
    event: 'otp_popup_closed',
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.BAYUT_WORKSHOPS,
      page_type: PAGE_TYPES.CHECKOUT_PAGE,
      page_title: pageTitle,
      language: language,
      ...commonParams,
    },
  });
};

export const nafathButtonClickEvent = (user, response, errorValue) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.VERIFY_NAFATH_CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.NAFATH,
      status: response.status === 200 ? STRINGS.SUCCESS : STRINGS.ERROR,
      value: errorValue,
      ...commonParams,
    },
  });
};

export const upgradeButtonClickEvent = (user, response, errorValue) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.UPGRADE_CLICK,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_type: PAGE_TYPES.ACTIVE,
      page_section: upgradeType,
      listing_type: listingType,
      purpose: ListingPurpose,
      city: city,
      area: area,
      ...commonParams,
    },
  });
};

export const actionButtonQualityWidgetClickEvent = (user, currentStatusID, actionType, props) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_type: statusMap[currentStatusID] || PAGE_TYPES.ACTIVE,
      page_section: PAGE_SECTIONS.QUALITY,
      value: actionType,
      amenities_added: props.features_selected,
      images_added: props.unique_images,
      ...commonParams,
    },
  });
};

export const actionButtonListingsClickEvent = (user, currentStatusID, pageSection) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.UPGRADE_CLICK,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_type: statusMap[currentStatusID] || PAGE_TYPES.ACTIVE,
      pageSection: pageSection,
      ...commonParams,
    },
  });
};
export const upgradeClickEvent = (user, product, paymentOption, listingData, creditAmount = null) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.UPGRADE_LISTING,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_type: PAGE_TYPES.ACTIONS,
      name: 'selected_option',
      value: product,
      payment_method: paymentOption,
      purpose: listingData?.purpose,
      price: creditAmount,
      ...commonParams,
    },
  });
};
export const hoverListingQualityDonut = (user, currentStatusID, qualityScore) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.QUALITY_HOVER,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_type: statusMap[currentStatusID] || PAGE_TYPES.ACTIVE,
      value: qualityScore,
      ...commonParams,
    },
  });
};

export const deleteListingConfirmEvent = (user, response, deletionReason) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.DELETE_LISTING,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_section: PAGE_SECTIONS.DELETE,
      status: response.error ? STRINGS.ERROR : STRINGS.SUCCESS,
      value: deletionReason,
      ...commonParams,
    },
  });
};

export const downloadAppButtonClick = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    event: EVENT_NAMES.DOWNLOAD_APP_CLICK,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.APP_REDIRECT,
      page_type: PAGE_TYPES.DOWNLOAD_BUTTON,
      ...commonParams,
    },
  });
};
export const downloadAppActionEvent = (user, pageSection) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.APP_REDIRECT,
    event: EVENT_NAMES.DOWNLOAD_APP_ACTION,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.APP_REDIRECT,
      page_type: STRINGS.DOWNLOAD_BUTTON,
      page_section: pageSection,
      ...commonParams,
    },
  });
};
export const pageViewInboxEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.INBOX,
      ...commonParams,
    },
  });
};

export const completeYourProfileClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PROFILE_COMPLETION_CAT,
    event: EVENT_NAMES.COMPLETE_PROFILE_CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.DASHBOARD,
      page_type: PAGE_TYPES.DASHBOARD,
      ...commonParams,
    },
  });
};

export const whyIsProfileCompletionImportantClickEvent = (user, isSettingsPage) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PROFILE_COMPLETION_CAT,
    event: EVENT_NAMES.WHY_IS_PROFILE_COMPLETION_IMPORTANT_ACT,
    is_non_interaction: false,
    params: {
      page_group: isSettingsPage ? PAGE_GROUPS.SETTINGS : PAGE_GROUPS.DASHBOARD,
      page_type: isSettingsPage ? PAGE_TYPES.USER_SETTINGS : PAGE_TYPES.DASHBOARD,
      ...commonParams,
    },
  });
};

export const profileCompletionPopUpCancelEvent = (user, route) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.PROFILE_COMPLETION_CAT,
    event: EVENT_NAMES.PROFILE_COMPLETION_POP_UP_CANCEL_ACT,
    is_non_interaction: false,
    params: {
      page_type: getPageType(route),
      ...commonParams,
    },
  });
};

export const submitListingEvent = (user, formValues, status, value) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.SUBMIT_LISTING_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.INBOX,
      ...commonParams,
    },
  });
};

export const mlUpgradesEvent = (user, listing, value) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.UPGRADE_CLICK,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_type: PAGE_TYPES.ACTIVE,
      page_section: value?.orderSummaryTitle,
      value: value.slug,
      purpose: listing?.purpose,
      property_type: listing?.propertyTitle,
      area: listing?.area,
      city: listing?.location.title,
      package_type: user.package?.slug,
      is_agency: user.agency ? true : false,
      agency_id: user.agency?.id,
      agency_name: user.agency?.name,
      ...commonParams,
    },
  });
};

export const submitUpgradePopupClickEvent = (user, errorValue, listing, applicableProduct) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.CONFIRM_CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_type: PAGE_TYPES.ACTIVE,
      page_section: applicableProduct?.appliedTitle,
      status: !errorValue ? STRINGS.SUCCESS : STRINGS.ERROR,
      errorValue,
      area: listing?.area,
      purpose: listing?.purpose,
      city: listing?.location?.title,
      price: listing?.price?.value,
      ...commonParams,
    },
  });
};

export const adLicenseVerificationClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.AD_LICENSE_VER,
      ...commonParams,
    },
  });
};
export const crVerificationContinueClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.CR_VERIFICATION,
      ...commonParams,
    },
  });
};

export const customEventClick = (user, customDetails) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.CHOOSE_LISTING_TYPE,
      item_id: customDetails.itemId,
      purpose: customDetails.additionalInfo,
      ...commonParams,
    },
  });
};

export const nationalIdVerificationClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.NATIONAL_ID_VERIFICATION,
      ...commonParams,
    },
  });
};

export const verifyFALLicenseClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.CHOOSE_FAL_LICENSE,
      ...commonParams,
    },
  });
};
export const payButtonUpgradeClickEvent = (user, paymentMethod, status, productDetails) => {
  const commonParams = getCommonParams(user, productDetails?.cartProducts?.[0]?.title);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.PAY_CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: productDetails?.listing_id ? PAGE_GROUPS.MANAGE_LISTING : PAGE_GROUPS.PACKAGES,
      page_type: PAGE_TYPES.CHECKOUT,
      payment_method: paymentMethod,
      status: status ? STRINGS.SUCCESS : STRINGS.ERROR,
      value: productDetails?.total,
      package_type: productDetails[0]?.title,
      current_package: user?.package ? user?.package?.slug : null,
      listing_id: productDetails?.listing_id,
      ...commonParams,
    },
  });
};

export const startYourJourneyClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.TRU_BROKER_CAT,
    event: EVENT_NAMES.START_TRUBROKER_JOURNEY_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.TRU_BROKER,
      page_type: PAGE_TYPES.DASHBOARD,
      ...commonParams,
    },
  });
};

export const truBrokerLearnMoreClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.TRU_BROKER_CAT,
    event: EVENT_NAMES.TRUBROKER_LEARN_MORE_CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.TRU_BROKER,
      page_type: PAGE_TYPES.DASHBOARD,
      ...commonParams,
    },
  });
};

export const howToEarnTruPointsClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.TRU_BROKER_CAT,
    event: EVENT_NAMES.TRUBROKER_HOW_TO_EARN_TRUPOINTS_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.TRU_BROKER,
      page_type: PAGE_TYPES.DASHBOARD,
      ...commonParams,
    },
  });
};

export const viewLeaderBoardClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.TRU_BROKER_CAT,
    event: EVENT_NAMES.TRUBROKER_VIEW_LEADERBOARD_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.TRU_BROKER,
      page_type: PAGE_TYPES.DASHBOARD,
      ...commonParams,
    },
  });
};

export const truBrokerSuccessPopUpCancelClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.TRU_BROKER_CAT,
    event: EVENT_NAMES.TRUBROKER_CANCEL_CLICK_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.TRU_BROKER,
      page_type: PAGE_TYPES.DASHBOARD,
      ...commonParams,
    },
  });
};

export const selectListingTypeClickEvent = (user, listingType) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.SELECT_CATEGORY_ACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.ADD_PROPERTY_FORM,
      purpose: listingType,
      ...commonParams,
    },
  });
};
export const switcherProfolioEvent = (user, switchValue, interactedFrom) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREDIT_USAGE,
    event: EVENT_NAMES.SWITCH_PROFOLIO,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.CREDIT_USAGE,
      page_type: PAGE_TYPES.HEADER,
      name: switchValue,
      value: switchValue === 'bayut' ? 'dubizzle_to_bayut' : 'bayut_to_dubizzle',
      interacted_from: interactedFrom,
      ...commonParams,
    },
  });
};
export const editStaffClickEvent = (user, agentName) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.AGENCY_STAFF,
    event: EVENT_NAMES.EDIT_STAFF,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.AGENCY_MANAGEMENT,
      name: 'agent_name',
      value: agentName,
      ...commonParams,
    },
  });
};
export const confirmEditStaffClickEvent = (user, staffData, error) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.AGENCY_STAFF,
    event: EVENT_NAMES.CONFIRM_EDIT_STAFF,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.AGENCY_MANAGEMENT,
      name: '',
      value: staffData,
      status: error ? STRINGS.ERROR : STRINGS.SUCCESS,
      ...commonParams,
    },
  });
};
export const confirmDeleteStaffClickEvent = (user, staffName, error) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.AGENCY_STAFF,
    event: EVENT_NAMES.CONFIRM_DELETE_STAFF,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.AGENCY_MANAGEMENT,
      name: 'agent_name',
      value: staffName,
      status: error ? STRINGS.ERROR : STRINGS.SUCCESS,
      ...commonParams,
    },
  });
};
export const deleteStaffClickEvent = (user, staffName) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.AGENCY_STAFF,
    event: EVENT_NAMES.DELETE_STAFF,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.AGENCY_MANAGEMENT,
      name: 'agent_name',
      value: staffName,
      ...commonParams,
    },
  });
};
export const selectAgentDashboardClickEvent = (user, agentName) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.DASHBOARD,
    event: EVENT_NAMES.SELECT_AGENT,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.HEADER,
      page_type: PAGE_TYPES.HEADER,
      // name: agentName,
      // value: action,
      name: 'agent_name',
      value: agentName,
      interacted_from: 'dashboard',
      ...commonParams,
    },
  });
};
export const switchChartViewClickEvent = (user, selectedAction) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.DASHBOARD,
    event: EVENT_NAMES.SWITCH_CHART_VIEW,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.DASHBOARD,
      page_type: PAGE_TYPES.PERFORMANCE,
      page_section: PAGE_SECTIONS.PERFORMANCE,
      name: 'selected_option',
      value: selectedAction,
      ...commonParams,
    },
  });
};
export const changeDateClickEvent = (user, startDate, endDate) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.DASHBOARD,
    event: EVENT_NAMES.CHANGE_DATE,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.DASHBOARD,
      page_type: PAGE_TYPES.PERFORMANCE,
      page_section: PAGE_SECTIONS.PERFORMANCE,
      name: 'date_range',
      value: `${startDate}--${endDate}`,
      ...commonParams,
    },
  });
};
export const listingActionClickEvent = (user, value, purpose, listingType, propertyType, area) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.CLICK_ACTIONS,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      page_type: PAGE_TYPES.ACTIONS,
      name: 'selected_option',
      value: value,
      listing_type: listingType,
      purpose: purpose,
      area: area,
      property_type: propertyType,
      ...commonParams,
    },
  });
};
export const pageViewLeadsDashboard = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.DASHBOARD,
      interacted_from: 'lead_dashboard',
      ...commonParams,
    },
  });
};
export const leadDetailClickEvent = (user, interactedFrom, leadId) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.CLICK_LEAD,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.DASHBOARD,
      interacted_from: interactedFrom ? 'lead_dashboard' : 'lead_management',
      value: leadId,
      ...commonParams,
    },
  });
};
export const personaFilterClickEvent = (user, selectedOption) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.FILTER_APPLIED,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.DASHBOARD,
      interacted_from: 'lead_dashboard',
      value: selectedOption?.id == -1 ? 'agency' : selectedOption?.user_role_within_agency,
      ...commonParams,
    },
  });
};
export const addNameClickEvent = (user, leadId) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.ADD_NAME,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.LEAD_DETAIL,
      interacted_from: 'lead_drawer',
      value: leadId,
      ...commonParams,
    },
  });
};
export const recordingClickEvent = (user, interactedFrom, leadId) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.PLAY_RECORDING,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.LEAD_DETAIL,
      interacted_from: interactedFrom ? 'lead_dashboard' : 'lead_management',
      value: leadId,
      ...commonParams,
    },
  });
};
export const sideMenuLeadManagementClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.REPORTS_CLICK,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.LEAD_DETAIL,
      interacted_from: 'lead_dashboard',
      ...commonParams,
    },
  });
};
export const pageViewLeadsManagement = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.PAGE_VIEW_ACT,
    is_non_interaction: true,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.LEAD_DETAIL,
      interacted_from: 'lead_dashboard',
      ...commonParams,
    },
  });
};
export const addTaskClickEvent = (user, interactedFrom, leadId) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.ADD_TASK,
    is_non_interaction: false,
    params: {
      website_section: WEBSITE_SECTIONS.PROFOLIO,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.LEAD_DETAIL,
      interacted_from: interactedFrom,
      value: leadId,
      ...commonParams,
    },
  });
};
export const submitTaskClickEvent = (user, leadId) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.SUBMIT_TASK,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.LEAD_DETAIL,
      value: leadId,
      ...commonParams,
    },
  });
};
export const addInterestClickEvent = (user, interactedFrom, leadId) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.ADD_INTEREST,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.LEAD_DETAIL,
      interacted_from:
        interactedFrom == 'lead_drawer' ? interactedFrom : interactedFrom ? 'lead_dashboard' : 'lead_management',
      value: leadId,
      ...commonParams,
    },
  });
};
export const submitInterestClickEvent = (user, leadId) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.ADD_INTEREST_CTA,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.LEAD_DETAIL,
      value: leadId,
      ...commonParams,
    },
  });
};
export const applyFilterLeadsClickEvent = (user, filterType) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.FILTER_APPLIED,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.LEAD_MANAGEMENT,
      interacted_from: 'lead_management',
      value: filterType,
      ...commonParams,
    },
  });
};
export const viewPropertiesLeadEvent = (user, interactedFrom, leadId) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEADS,
    event: EVENT_NAMES.VIEW_INTERESTS,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.LEADS,
      page_type: PAGE_TYPES.LEAD_DETAIL,
      interacted_from:
        interactedFrom == 'lead_drawer' ? interactedFrom : interactedFrom ? 'lead_dashboard' : 'lead_management',
      value: leadId,
      ...commonParams,
    },
  });
};

export const addAmenitiesEvent = (user, is_posted, listingPurpose) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.ADD_PROPERTY_CAT,
    event: EVENT_NAMES.AMENITIES_EDIT,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.ADD_PROPERTY,
      page_type: PAGE_TYPES.DETAILS,
      Page_section: PAGE_SECTIONS.EDIT,
      is_agency: user.agency ? true : false,
      agency_id: user.agency?.id,
      agency_name: user.agency?.name,
      posting_reason: is_posted ? STRINGS.EDIT : STRINGS.NEW,
      category_type: listingPurpose,
      ...commonParams,
    },
  });
};

export const autoRenewalClickEvent = (user, status) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.CLICK_RENEW,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      is_agency: user.agency ? true : false,
      agency_id: user.agency?.id,
      agency_name: user.agency?.name,
      page_type: status,
      ...commonParams,
    },
  });
};

export const listingsFilterClickEvent = (user, filterName, tabTitle) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.MANAGE_LISTING_CAT,
    event: EVENT_NAMES.CLICK_FILTER,
    is_non_interaction: false,
    params: {
      website_section: user.is_package_user ? WEBSITE_SECTIONS.PROFOLIO : WEBSITE_SECTIONS.LITE,
      page_group: PAGE_GROUPS.MANAGE_LISTING,
      is_agency: user.agency ? true : false,
      agency_id: user.agency?.id,
      agency_name: user.agency?.name,
      value: filterName,
      page_type: tabTitle,
      ...commonParams,
    },
  });
};

export const getAdLicenseClickEvent = (user, isAdLicenseScreen) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.CLICK_GET_AD_LICENSE,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      interacted_from: isAdLicenseScreen
        ? INTERACTED_FROM.AD_LICENSE_SCREEN
        : INTERACTED_FROM.TRACK_AD_LICENSE_REQUESTS,
      ...commonParams,
    },
  });
};

export const continuePaymentClickEvent = (user, response) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.CLICK_CONTINUE_PAYMENT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      status: !response ? STRINGS.ERROR : STRINGS.SUCCESS,
      ...commonParams,
    },
  });
};

export const payNowClickEvent = (user, response) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.CLICK_ON_PAY_NOW,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      status: !response ? STRINGS.ERROR : STRINGS.SUCCESS,
      ...commonParams,
    },
  });
};

export const checkoutClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.CLICK_CHECKOUT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      ...commonParams,
    },
  });
};

export const trackRequestsClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.CLICK_TRACK_REQUESTS,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      ...commonParams,
    },
  });
};

export const contactClickEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.CLICK_CONTACT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      ...commonParams,
    },
  });
};

export const viewAdEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.VIEW_AD,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      ...commonParams,
    },
  });
};

export const viewAdFromEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.VIEW_AD_FORM,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      ...commonParams,
    },
  });
};

export const viewPaymentEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.VIEW_PAYMENT,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      ...commonParams,
    },
  });
};

export const viewRequestConfirmationEvent = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.VIEW_REQUEST_CONFIRMATION,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      ...commonParams,
    },
  });
};

export const Scroll50Event = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.SCROLL_50,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      ...commonParams,
    },
  });
};

export const Scroll100Event = (user) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.CREATE_AD_LICENSE,
    event: EVENT_NAMES.SCROLL_100,
    is_non_interaction: false,
    params: {
      page_group: PAGE_GROUPS.CREATE_AD_LICENSE,
      ...commonParams,
    },
  });
};

const NUDGE_VALUE_BAYUT_MATCH = 'Bayut Match';

export const leadNudgeCloseEvent = (user, { language, pageTitle, value = NUDGE_VALUE_BAYUT_MATCH }) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEAD_NUDGE_CAT,
    event: EVENT_NAMES.CLOSE_NUDGE,
    is_non_interaction: false,
    params: {
      language,
      page_title: pageTitle,
      signed_in: user?.id ? STRINGS.YES : STRINGS.NO,
      user_id: user?.id ?? null,
      value,
      ...commonParams,
    },
  });
};

export const leadNudgeClickEvent = (user, { language, pageTitle, value = NUDGE_VALUE_BAYUT_MATCH }) => {
  const commonParams = getCommonParams(user);
  trackEventGA4({
    category: EVENT_CATEGORIES.LEAD_NUDGE_CAT,
    event: EVENT_NAMES.CLICK_NUDGE,
    is_non_interaction: false,
    params: {
      language,
      page_title: pageTitle,
      signed_in: user?.id ? STRINGS.YES : STRINGS.NO,
      user_id: user?.id ?? null,
      value,
      ...commonParams,
    },
  });
};
