import tenantUtils from '@utils';
import tenantData from '@data';
import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';
import store from '@store';
import { strings } from '../../../constants/strings';
import { t } from 'i18next';

const agencyDataMapper = (agency) => {
  const loggedInUser = store.getState().app.loginUser.user;
  const getPlatformsAndProducts = (platforms) => {
    if (!platforms) return { products: { platforms: {} }, platforms: [] };

    const agencyProducts = {};
    const agencyPlatforms = [];

    tenantData.platformList.forEach(({ key, ...rest }) => {
      const platform = platforms[key];
      if (platform?.mapped) {
        agencyProducts[key] = { key, ...rest };
        agencyPlatforms.push({ key, ...rest });
      }
    });

    return {
      products: { platforms: agencyProducts },
      platforms: agencyPlatforms,
    };
  };

  const data = {
    agencyDetails: {
      ...agency,
      ...getPlatformsAndProducts(agency?.platform_mapping),
      companyTitle: agency?.name,
      city: { city: agency?.city_id ? { location_id: agency?.city_id } : null },
      email: agency?.email,
      website: agency?.website,
      description: agency?.description,
      mobile: agency?.mobile ? tenantUtils.formatMobile(agency?.mobile, 'singleNumber').split(',')?.[0] : '',
      landline: agency?.phone ? tenantUtils.formatMobile(agency?.phone, 'singleNumber') : '',
      whatsapp: agency?.whatsapp ? tenantUtils.formatMobile(agency?.whatsapp, 'singleNumber') : '',
      agencyWhatsappForAll: agency?.use_agency_whatsapp,
      logo: agency?.agency_logo && [{ gallerythumb: agency?.agency_logo, ...imageStateObject() }],
      address: agency?.company_address,
      updatePropertyListings: agency?.update_agency_listing_details,
      enable_whatsapp_leads: agency?.enable_whatsapp_leads,
      ownerId: agency?.creator_id,
      name: agency?.owner_name,
      designation: agency?.designation,
      message: agency?.owner?.message,
      profilePhoto: agency?.owner?.profile_image && [
        { gallerythumb: agency?.owner?.profile_image, ...imageStateObject() },
      ],
      // updatePropertyListings: false,
    },
    agencyUsers: agency?.users?.length
      ? agency?.users.map((e) => {
          const isOnOlx = e?.mapped_on_olx;
          return {
            ...e,
            id: e?.id,
            name: e?.name,
            email: e?.email,
            mobile: e?.mobile,
            landline: e?.phone,
            ...(!!e?.quota && { quota: { products: e?.quota } }),
            ...(!!e?.credits && { credits: { products: e?.credits } }),
            type: 'premium',
            permissions: e?.is_admin ? tenantUtils.getPermissionsObj(true) : tenantUtils.getPermissionsObj(false),
            is_owner: e?.id == agency?.creator_id,
            is_single_platform: !isOnOlx,
            can_post_free: { zameen: loggedInUser?.can_post_limit_listings, olx: false },
            listing_posted: e?.listing_posted > 0,
            platform_user: isOnOlx ? [{ id: 2, slug: 'olx', title: 'OLX' }] : [],
            platforms: isOnOlx ? tenantData.platformList : tenantData.platformList?.filter((e) => e?.slug != 'olx'),
            products: {
              platforms: {
                zameen: tenantData.platformList?.[0],
                ...(isOnOlx && { olx: tenantData.platformList?.[1] }),
              },
            },
          };
        })
      : [],
  };
  return data;
};

const mapUserStatusToBadge = (statusName) => {
  const key = (statusName || '').toLowerCase();
  switch (key) {
    case 'active':
      return { color: 'green', label: t('Active') };
    case 'pending':
      return { color: 'warning', label: t('Pending') };
    case 'removed':
      return { color: 'red', label: t('Removed') };
    default:
      return { color: 'blue', label: statusName || '-' };
  }
};

const agencyStaffDataMapper = (response) => {
  let listingsPosted = 0;
  const data = {
    list: response?.agency?.users?.map((e) => {
      let activeListings = 0;
      return {
        ...e,
        user_name: e?.name,
        user_email: e?.email,
        user_phone: e?.mobile,
        user_status_badge: { 
          state: mapUserStatusToBadge(e?.status?.name),
          disposition: e?.disposition
        },
        active_listings: { value: activeListings },
        leads: { value: null },
        zameenQuota:
          !!e?.quotas?.zameen?.available_quota >= 1
            ? `${e?.quotas?.zameen?.available_quota.toFixed(1)}/${e?.quotas?.zameen?.total_quota.toFixed(1)}`
            : '-',
        olxQuota: !!e?.mapped_on_olx
          ? !!e?.quotas?.olx?.available_quota >= 1
            ? `${e?.quotas?.olx?.available_quota.toFixed(1)}/${e?.quotas?.olx?.total_quota.toFixed(1)}`
            : '-'
          : 'Not mapped',
        rowActions: {
          ...e,
          agencyId: response?.agency?.id,
          userId: e?.id,
          isAdmin: e?.is_admin,
          isOwner: e?.user_role_within_agency === 'owner',
          name: e?.name,
          deleteModalData: {
            table: [
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                component: 'String',
              },
              {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                component: 'String',
              },
            ],
            list: [{ ...e, active_listings: { value: activeListings } }],
          },
        },
      };
    }),
    headerCards: [
      {
        icon: 'MdPersonPinCircle',
        iconColor: '',
        iconSize: '1em',
        title: strings.total_agents,
        value: response?.agency?.users?.length,
      },
      {
        icon: 'IoMdPin',
        iconColor: '#00a651',
        iconSize: '1em',
        title: strings.listings_posted,
        value: listingsPosted,
      },
    ],
    table: [
      {
        title: 'Staff Detail',
        dataIndex: 'lead_info',
        key: 'lead_info',
        component: 'LeadInfo',
      },
      {
        title: 'Status',
        dataIndex: 'user_status_badge',
        key: 'user_status_badge',
        component: 'OrderStatus',
      },
      {
        title: 'Zameen Quota',
        dataIndex: 'zameenQuota',
        key: 'zameenQuota',
        component: 'String',
      },
      {
        title: 'Olx Quota',
        dataIndex: 'olxQuota',
        key: 'olxQuota',
        component: 'String',
      },
      {
        title: 'Controls',
        dataIndex: 'rowActions',
        key: 'rowActions',
        component: 'UserRowActions',
        align: 'right',
        width: 220
      },
    ],
  };
  return data;
};

const agencyStaffUserMapper = async (values) => {
  if (!values) return null;
  return {
    name: values?.name,
    email: values?.email,
    mobile: values?.mobile ? tenantUtils.formatMobile(values?.mobile, 'singleNumber') : '',
    landline: values?.phone ? tenantUtils.formatMobile(values?.phone, 'singleNumber') : '',
    address: values?.address,
    city: values?.city_id,
    image: values?.profile_image && [{ gallerythumb: values?.profile_image?.sizes?.thumbnail, ...imageStateObject() }],
    cnic: values?.cnic,
    cnic_front: values?.cnic_image_front && [{ gallerythumb: values?.cnic_image_front?.thumbnail, ...imageStateObject() }],
    cnic_back: values?.cnic_image_back && [{ gallerythumb: values?.cnic_image_back?.thumbnail, ...imageStateObject() }],
  };
};

export default { agencyDataMapper, agencyStaffDataMapper, agencyStaffUserMapper };
