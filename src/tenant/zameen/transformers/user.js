import tenantData from '@data';
import tenantConstants from '@constants';
import tenantUtils from '@utils';
import store from '@store';
import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';

const defaultPreferences = {
  area_unit: 'marla',
  automated_reports: '0',
  currency: tenantConstants.CURRENCY,
  email_notification: '0',
  newsletter: '0',
};

const userDetailTransformer = async (response) => {
  localStorage.setItem('showBanner', JSON.stringify(true));
  const data = response?.user;
  let settings = [];
  const settingsData = ['area_unit', 'currency', 'email_notification', 'newsletter', 'automated_reports'];
  settingsData.forEach((e) => settings.push(data?.[e]));
  const isOnOlx = !!data?.platform_mapping?.olx?.mapped;
  const quotaCreditProducts = store.getState()?.app?.products?.data
    ? store.getState().app.products?.data
    : tenantData.products;

  return {
    ...data,
    is_zameen_package_user: data?.is_package_user,
    is_package_user: true, //No lite user for zameen
    id: data?.id,
    can_post_limit_listings: true,
    is_shifted_to_olx_quota: data?.is_quota_shifted,
    olx_user_id: data?.olx_user_id,
    type: data?.is_premium ? 'premium' : 'free',
    permissions: data?.is_agency_admin ? tenantUtils.getPermissionsObj(true) : tenantUtils.getPermissionsObj(false),
    is_owner: data?.is_agency_admin,
    is_single_platform: !isOnOlx,
    is_multi_platform: isOnOlx,
    can_post_free: { zameen: false, olx: false },
    listing_posted: !!data?.is_listing_posted,
    platform_user: isOnOlx ? [{ id: 2, slug: 'olx', title: 'OLX' }] : [],
    settings: settings,
    platforms: isOnOlx ? tenantData.platformList : [tenantData.platformList.find((e) => e.slug === 'zameen')],
    products: {
      platforms: {
        zameen: quotaCreditProducts?.filter((e) => e?.platform === 'zameen'),
        ...(!!isOnOlx && { olx: quotaCreditProducts?.filter((e) => e?.platform === 'olx') }),
      },
    },
    isLoading: false,
  };
};

export const profileDataMapper = (values) => {
  if (!values) return null;
  return {
    id: values?.id,
    name: values?.name,
    email: values?.email,
    mobile: values?.mobile ? tenantUtils.formatMobile(values?.mobile, 'singleNumber') : '',
    phone: values?.phone ? tenantUtils.formatMobile(values?.phone, 'singleNumber') : '',
    address: values?.address,
    location: { city: values?.city_id && { location_id: values?.city_id } },
    ...(values?.profile_image && {
      profile_image: [{ gallerythumb: values?.profile_image, ...imageStateObject() }],
    }),
    whatsapp: values?.whatsapp ? tenantUtils.formatMobile(values?.whatsapp, 'singleNumber') : '',
    olx_listings_number: values?.olx_listings_number,
    olx_user_id: values?.olx_user_id,
  };
};

const getLoggedInUserValues = (values) => {
  if (!values) return null;
  return {
    id: values?.id,
    name: values?.name,
    email: values?.email,
    mobile: values?.mobile ? tenantUtils.formatMobile(values?.mobile, 'singleNumber') : '',
    phone: values?.phone ? tenantUtils.formatMobile(values?.phone, 'singleNumber') : '',
    address: values?.address,
    location: { city: values?.city_id && { location_id: values?.city_id } },
    ...(values?.profile_image && {
      profile_image: [{ gallerythumb: values?.profile_image, ...imageStateObject() }],
    }),
    whatsapp: values?.whatsapp ? tenantUtils.formatMobile(values?.whatsapp, 'singleNumber') : '',
    olx_listings_number: values?.olx_listings_number,
    olx_user_id: values?.olx_user_id,
  };
};

export const settingsDetailDataMapper = (response) => {
  return getLoggedInUserValues(response?.user);
};

export default {
  userDetailTransformer,
  profileDataMapper,
  settingsDetailDataMapper,
};
