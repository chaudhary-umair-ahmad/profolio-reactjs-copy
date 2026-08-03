import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';
import { getPlatformsAndProducts, getPositionSuffix } from '../../../utility/utility';
import { parseUserNudges } from '../../../utility/nudgeSuppression';
import { t } from 'i18next';

const defaultPreferences = {
  area_unit: 'marla',
  automated_reports: '0',
  currency: tenantConstants.CURRENCY,
  email_notification: '0',
  newsletter: '0',
  push_notifications: 'disabled',
};

const getCurrentPackageFromCredits = (credits) => {
  if (!credits || typeof credits !== 'object') return undefined;
  const orderedKeys = ['bayut', 'ksa', 'dubizzle'];
  for (const key of orderedKeys) {
    const pkg = credits[key]?.current_package;
    if (pkg) return pkg;
  }
  for (const value of Object.values(credits)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && value.current_package) {
      return value.current_package;
    }
  }
  return undefined;
};

export const profileDataMapper = (values) => {
  if (!values) return null;

  const profileImageUrl = values.profile_image.sizes.thumbnail


  const cityId = values?.city?.id;
  const cityName = tenantUtils.getLocalisedString(values?.city, 'title');

  return {
    ...values,
    id: values?.id,
    agencyId: values?.agency?.id,
    fALLicenseNumber: values?.license?.number
      ? values?.license?.number
      : values?.license?.license_owner_type === 'Agency'
        ? values?.agency_attributes?.license_attributes?.number
        : values?.license_attributes?.number,
    fallid: values?.license?.id,
    fALLicenseExpiryDate: values?.license?.end_date,
    commercialRegistrationNumber: values?.commercial_registration_number,
    typeofBuisness: values?.broker_type,
    buisnessName: values?.agency?.name,
    nationalShortAddress: values?.national_short_address,
    is_nafaz_verified: values?.is_nafaz_verified,
    is_rega_verified: values?.is_rega_verified,
    license_type: values?.license?.license_owner_type,
    falLicenseURL: values?.license?.certificate_link
      ? values?.license?.certificate_link
      : values?.license?.license_owner_type === 'Agency'
        ? values?.agency_attributes?.license_attributes?.certificate_link
        : values?.license_attributes?.certificate_link,
    nameArabic: values?.name_l1,
    name: values?.name,
    email: values?.email,
    is_email_verified: values?.email_verified,
    mobile: values?.mobile ? tenantUtils.formatMobile(values?.mobile, 'singleNumber') : '',
    is_mobile_verified: values?.mobile_verified,
    phone: values?.phone ? tenantUtils.formatMobile(values?.phone, 'singleNumber') : '',
    address: tenantUtils.getLocalisedString(values, 'address'),
    country: values?.country_id || 155,
    location: {
      city: cityId && { location_id: cityId, name: cityName },
    },
    ...(profileImageUrl && {
      profile_image: [{ gallerythumb: profileImageUrl, ...imageStateObject() }],
    }),
    whatsapp: values?.whatsapp ? tenantUtils.formatMobile(values?.whatsapp, 'singleNumber') : '',
    gender: values?.gender?.slug
  };
};

const userDetailTransformer = async (response) => {
  if (!response?.user) return null;
  localStorage.setItem('showBanner', JSON.stringify(true));
  const data = response.user;

  const profileImageUrl =
    typeof data?.profile_image === 'object' && data?.profile_image?.sizes
      ? data.profile_image.sizes.thumbnail || data.profile_image.sizes.small || data.profile_image.sizes.medium
      : data?.profile_image;

  const mappedData = {
    ...data,
    is_email_verified: data?.email_verified,
    is_mobile_verified: data?.mobile_verified,
    is_agency_admin: data?.agency_admin,
    is_credit_user: data?.credit_user,
    user_role_within_agency: data?.role,
    city_id: data?.city?.id,
    city: data?.city?.title,
    city_l1: data?.city?.title_l1,
    external_id: data?.platform_mapping?.bayut?.external_id || data?.platform_mapping?.dubizzle?.external_id,
    credits: data?.credits
      ? (() => {
          const bayutCredits = data.credits.bayut
            ? {
                ...data.credits.bayut,
                expiring_credits: data.credits.bayut?.expiring,
                total: data.credits.bayut?.allocated,
                available: data.credits.bayut?.available,
                used: data.credits.bayut?.used,
                percentage_used: data.credits.bayut?.percentage_used,
              }
            : undefined;
          return {
            bayut: bayutCredits,
            // App platform slug is `ksa` while Surge credits are keyed `bayut`; keep both in sync for UI.
            ksa: bayutCredits,
            dubizzle: data.credits.dubizzle
              ? {
                  ...data.credits.dubizzle,
                  expiring_credits: data.credits.dubizzle?.expiring,
                  total: data.credits.dubizzle?.allocated,
                  available: data.credits.dubizzle?.available,
                  used: data.credits.dubizzle?.used,
                  percentage_used: data.credits.dubizzle?.percentage_used,
                }
              : undefined,
          };
        })()
      : data?.credits,
  };

  if (Array.isArray(data?.settings) && data.settings.length) {
    const bySlug = new Map();
    for (const item of data.settings) {
      if (item?.slug) bySlug.set(item.slug, item);
    }
    bySlug.forEach((item, slug) => {
      mappedData[slug] = {
        value: item.value,
        id: item.id,
        setting_id: item.setting_id,
        name: item.name,
        slug,
      };
    });
  }

  let settings = {};
  Object.keys(defaultPreferences).forEach(
    (e) => (settings[e] = mappedData?.[e]?.value == '0' ? false : mappedData?.[e]?.value == '1' ? true : mappedData?.[e]?.value ?? defaultPreferences[e]),
  );

  const isOnOlx = !!mappedData?.olx_user_id;
  const isMultiPlatform = mappedData?.platform_mapping?.bayut?.mapped && mappedData?.platform_mapping?.dubizzle?.mapped;

  return {
    ...mappedData,
    banners: Array.isArray(response?.banners) ? response.banners : [],
    profile_image: profileImageUrl,
    id: mappedData?.id,
    can_post_limit_listings: true,
    type: 'premium',
    package: getCurrentPackageFromCredits(mappedData.credits) ?? data?.package,
    permissions: mappedData?.is_agency_admin ? tenantUtils.getPermissionsObj(true) : tenantUtils.getPermissionsObj(false),
    is_owner: mappedData?.is_agency_admin,
    isMultiPlatform: isMultiPlatform,
    is_multi_platform: isMultiPlatform,
    is_package_user: mappedData?.is_package_user,
    can_post_free: { zameen: false, olx: false },
    listing_posted: !!mappedData?.is_listing_posted,
    platform_user: isOnOlx ? [{ id: 2, slug: 'olx', title: 'OLX' }] : [],
    settings: settings,
    ...getPlatformsAndProducts(mappedData?.platform_mapping),
    isCurrencyUser: mappedData?.is_credit_user,
    is_single_platform: !isOnOlx,
    is_shifted_to_olx_quota: mappedData?.is_quota_shifted,
    olx_user_id: mappedData?.olx_user_id,
    isLoggedinUser: true,
    isLoading: false,
    parsedNudges: parseUserNudges(data?.nudges),
    is_lms_enabled: mappedData?.is_lms_enabled
  };
};

const getLoggedInUserValues = (values) => {
  if (!values) return null;

  const profileImageUrl = values?.profile_image?.sizes?.thumbnail


  const cityId = values?.city?.id;
  const cityName = tenantUtils.getLocalisedString(values?.city, 'title');

  return {
    ...values,
    id: values?.id,
    agencyId: values?.agency?.id,
    fALLicenseNumber: values?.license?.number
      ? values?.license?.number
      : values?.license?.license_owner_type === 'Agency'
        ? values?.agency_attributes?.license_attributes?.number
        : values?.license_attributes?.number,
    fallid: values?.license?.id,
    fALLicenseExpiryDate: values?.license?.end_date,
    commercialRegistrationNumber: values?.commercial_registration_number,
    typeofBuisness: values?.broker_type,
    buisnessName: values?.agency?.name,
    nationalShortAddress: values?.national_short_address,
    is_nafaz_verified: values?.is_nafaz_verified,
    is_rega_verified: values?.is_rega_verified,
    license_type: values?.license?.license_owner_type,
    falLicenseURL: values?.license?.certificate_link
      ? values?.license?.certificate_link
      : values?.license?.license_owner_type === 'Agency'
        ? values?.agency_attributes?.license_attributes?.certificate_link
        : values?.license_attributes?.certificate_link,
    nameArabic: values?.name_l1,
    name: values?.name,
    email: values?.email,
    is_email_verified: values?.email_verified,
    mobile: values?.mobile ? tenantUtils.formatMobile(values?.mobile, 'singleNumber') : '',
    is_mobile_verified: values?.mobile_verified,
    phone: values?.phone ? tenantUtils.formatMobile(values?.phone, 'singleNumber') : '',
    address: tenantUtils.getLocalisedString(values, 'address'),
    country: values?.country_id || 155,
    location: {
      city: cityId && { location_id: cityId, name: cityName },
    },
    ...(profileImageUrl && {
      profile_image: [{ gallerythumb: profileImageUrl, ...imageStateObject() }],
    }),
    whatsapp: values?.whatsapp ? tenantUtils.formatMobile(values?.whatsapp, 'singleNumber') : '',
    agentDescription: values?.description,
    agentDescriptionArabic: values?.description_l1,
    serviceArea: values?.service_areas ? values?.service_areas?.map((e) => e?.id) : cityId, //missing key area
    languages: values?.languages ? values?.languages?.map((e) => e?.id || e) : null,
    experience: values?.experience?.value,
    gender: values?.gender?.slug
  };
};

export const settingsDetailDataMapper = (response) => {
  if (!response) return null;

  // Handle new surge API structure where languages, areaUnits, and experienceList come from separate API calls
  const languageList = response?.languageList || [];
  const areaUnitList = response?.areaUnits || [];
  const experienceList = response?.experienceList || [];

  return getLoggedInUserValues({
    ...response?.user,
    languageList: Array.isArray(languageList) ? languageList : [],
    areaUnitList: Array.isArray(areaUnitList) ? areaUnitList : [],
    experienceList: Array.isArray(experienceList)
      ? experienceList.map((e) => ({
          id: e?.value,
          name: tenantUtils.getLocalisedString(e, 'label'),
        }))
      : [],
  });
};

export const mapSurgeLanguagesListResponse = (response) =>
  (response?.languages || []).map((e) => ({
    id: e?.id,
    name: tenantUtils.getLocalisedString(e, 'name'),
  }));

export const mapSurgeExperienceListResponse = (response) =>
  (response?.experience || []).map((e) => ({
    id: e?.value,
    name: tenantUtils.getLocalisedString(e, 'label'),
  }));

const truBrokerLeaderboardMapper = (response) => {
  if (response) {
    if (response?.error) {
      return response;
    }
    return {
      list: response?.users?.map((e) => {
        return {
          ...e,
          rank_details: e?.rank ? t(e?.rank + getPositionSuffix(e?.rank)) : '-',

          agent_details: {
            name: tenantUtils.getLocalisedString(e, 'name'),
            user_agency_name: tenantUtils.getLocalisedString(e?.agency, 'name'),
            image: e?.profile_image,
          },
          tru_points: e?.score ? e?.score : '-',
        };
      }),

      table: [
        {
          title: 'Position',
          dataIndex: 'rank_details',
          key: 'rank_details',
          component: 'String',
        },

        {
          title: 'Name',
          dataIndex: 'agent_details',
          key: 'agent_details',
          component: 'StaffDetails',
        },
        {
          title: 'TruPoints™',
          dataIndex: 'tru_points',
          key: 'tru_points',
          component: 'String',
        },
      ],
      pagination: response?.pagination || null,
    };
  }
};

export default {
  userDetailTransformer,
  profileDataMapper,
  settingsDetailDataMapper,
  truBrokerLeaderboardMapper,
  mapSurgeLanguagesListResponse,
  mapSurgeExperienceListResponse,
};
