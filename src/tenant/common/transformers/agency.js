import tenantUtils from '@utils';
import tenantData from '@data';
import tenantConstants from '@constants';
import store from '@store';

import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';
import { strings } from '../../../constants/strings';

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
    isMultiPlatform: agencyPlatforms?.length > 1,
  };
};

const agencyDataMapper = (agency) => {
  const loggedInUser = store.getState().app.loginUser.user;
  const data = {
    agencyDetails: {
      ...agency,
      ...getPlatformsAndProducts(agency?.platform_mapping),
      country: agency?.country_id || 155,
      commercialRegistrationNumber: agency?.commercial_registration_number,
      fALLicenseNumber: agency?.license?.number
        ? agency?.license?.number
        : agency?.license?.license_owner_type === 'Agency'
          ? agency?.agency_attributes?.license_attributes?.number
          : agency?.license_attributes?.number,
      fallId: agency?.license?.id,
      fALLicenseExpiryDate: agency?.license?.end_date,
      license_type: agency?.license?.license_owner_type,
      falLicenseURL: agency?.license?.certificate_link
        ? agency?.license?.certificate_link
        : agency?.license?.license_owner_type === 'Agency'
          ? agency?.agency_attributes?.license_attributes?.certificate_link
          : agency?.license_attributes?.certificate_link,
      city: { city: { location_id: agency?.city_id, name: tenantUtils.getLocalisedString(agency, 'city') } },
      description: tenantUtils.getLocalisedString(agency, 'description', true),
      mobile: agency?.mobile ? tenantUtils.formatMobile(agency?.mobile, 'singleNumber').split(',')?.[0] : '',
      landline: agency?.phone ? tenantUtils.formatMobile(agency?.phone, 'singleNumber') : '',
      whatsapp: agency?.whatsapp ? tenantUtils.formatMobile(agency?.whatsapp, 'singleNumber') : '',
      agencyWhatsappForAll: agency?.use_agency_whatsapp,
      logo: agency?.agency_logo && [{ gallerythumb: agency?.agency_logo, ...imageStateObject() }],
      address: tenantUtils.getLocalisedString(agency, 'company_address'),
      typeofBuisness: agency?.broker_type,
      buisnessName: tenantUtils.getLocalisedString(agency, 'name', true),
      nationalShortAddress: agency?.national_short_address,
      updateCompanyListings: agency?.update_agency_listing_details,
      ownerId: agency?.creator_id,
      name: agency?.owner?.name,
      designation: agency?.designation,
      message: agency?.owner?.message,
      profilePhoto: agency?.owner?.profile_image && [
        { gallerythumb: agency?.owner?.profile_image, ...imageStateObject() },
      ],
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
            isCurrencyUser: e?.is_credit_user,
            platform_user: isOnOlx ? [{ id: 2, slug: 'olx', title: 'OLX' }] : [],
            ...getPlatformsAndProducts(e?.platform_mapping),
          };
        })
      : [],
  };
  return data;
};

const agencyStaffDataMapper = (response) => {
  const { user } = store?.getState()?.app?.loginUser;
  let listingsPosted = 0;
  const creditSummary = Object.values(response?.agency?.credits || {}).reduce(
    (summary, platformCredits) => {
      return {
        available: summary.available + (platformCredits?.available || 0),
        used: summary.used + (platformCredits?.used || 0),
        total: summary.total + (platformCredits?.total || 0),
      };
    },
    { available: 0, used: 0, total: 0 },
  );
  return {
    owner_id: response?.agency?.creator_id,
    total_agency_credits: creditSummary?.total,
    agency_available_credits: creditSummary?.available,
    agency_used_credits: creditSummary?.used,
    list: response?.agency?.users?.map((e) => {
      let activeListings = 0;
      return {
        ...e,
        user_name: tenantUtils.getLocalisedString(e, 'name'),
        user_email: e?.email,
        user_phone: e?.mobile,
        user_image: e?.profile_image,
        user_credits: e?.credits?.ksa?.total ? { value: e?.credits?.ksa?.total } : { value: 0, dashForNone: false },
        used_credits: e?.credits?.ksa?.used ? { value: e?.credits?.ksa?.used } : { value: 0, dashForNone: false },
        quota: e?.quotas?.available ? formatNumberString(e?.quotas?.available) : 0,
        active_listings: { value: activeListings },
        leads: { value: null },
        agent_rank: {
          scoreTitle: e?.rank ? e?.rank + 'th' : 0,
          scoreIcon: e?.rank && 'SvgLeaderBoardGradient',
        },
        tru_points: { scoreTitle: e?.score || 0, scoreIcon: e?.score && 'SvgStarGradient', userId: e?.id },
        user_details: {
          user_role: e?.user_role_within_agency,
          name: tenantUtils.getLocalisedString(e, 'name'),
          email: e?.email,
          phone: e?.mobile,
          image: e?.profile_image,
          is_tru_broker: !!e?.is_tru_broker,
          platforms: Object.keys(e?.platform_mapping || {}).filter((platform) => e.platform_mapping[platform].mapped),
        },
        rowActions: {
          ...e,
          agencyId: response?.agency?.id,
          userId: e?.id,
          isAdmin: e?.is_admin,
          isOwner: e?.user_role_within_agency === 'owner',
          name: tenantUtils.getLocalisedString(e, 'name'),
          creditsAvailable: e?.credits?.ksa?.available,
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
            list: [
              {
                ...e,
                name: tenantUtils.getLocalisedString(e, 'name'),
                active_listings: { value: activeListings },
              },
            ],
          },
        },
      };
    }),
    cappedUsersList: response?.agency?.users
      ?.filter((e) => e?.user_role_within_agency != 'owner')
      ?.map((e, index, originalArray) => {
        return {
          ...e,
          staff_user_details: {
            user_name: tenantUtils.getLocalisedString(e, 'name'),
            image: e?.profile_image,
          },
          user_credit_details: {
            user_id: e?.id,
            available_credits: e?.credits?.ksa?.available ? e?.credits?.ksa?.available : 0,
            used_credits: e?.credits?.ksa?.used ? e?.credits?.ksa?.used : 0,
            total_available_credits: e?.credits?.ksa?.total ? e?.credits?.ksa?.total : 0,
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
        title: 'Staff Details',
        dataIndex: 'user_details',
        key: 'user_details',
        component: 'StaffDetails',
      },
      ...(!user?.is_credit_user
        ? [
            {
              title: 'Available Quota',
              dataIndex: 'quota',
              key: 'quota',
              component: 'String',
            },
          ]
        : [
            // {
            //   title: 'Credits Limit',
            //   dataIndex: 'user_credits',
            //   key: 'user_credits',
            //   component: 'Number',
            // },
            // {
            //   title: 'Used Credits',
            //   dataIndex: 'used_credits',
            //   key: 'used_credits',
            //   component: 'Number',
            // },
          ]),
      {
        title: 'Actions',
        dataIndex: 'rowActions',
        key: 'rowActions',
        component: 'UserRowActions',
      },
    ],
    creditCappingDetails: {
      table: [
        {
          title: 'Staff Details',
          dataIndex: 'user_name',
          key: 'user_name',
          component: 'AvatarName',
        },
        {
          title: 'Set Limit',
          dataIndex: 'user_credit_details',
          key: 'user_credit_details',
          component: 'SetCappingLimit',
        },
      ],
    },
  };
};

const agencyStaffUserMapper = async (response) => {
  if (!response) return null;
  const values = response?.user;

  return {
    name: values?.name,
    email: values?.email,
    mobile: values?.mobile ? tenantUtils.formatMobile(values?.mobile, 'singleNumber') : '',
    whatsapp: values?.whatsapp ? tenantUtils.formatMobile(values?.whatsapp, 'singleNumber') : '',
    landline: values?.phone ? tenantUtils.formatMobile(values?.phone, 'singleNumber') : '',
    address: values?.address,
    country: values?.country_id || 155,
    city: {
      city: values?.city_id && { location_id: values?.city_id, name: tenantUtils.getLocalisedString(values, 'city') },
    },
    ...(values?.profile_image && {
      image: [{ gallerythumb: values?.profile_image?.sizes?.thumbnail, ...imageStateObject() }],
    }),
    nameArabic: values?.name_l1,
    fALLicenseNumber: values?.license?.number,
    fALLicenseExpiryDate: values?.license?.end_date,
    falLicenseURL: values?.license?.certificate_link,
    nationalShortAddress: values?.national_short_address,
    agentDescription: values?.description,
    agentDescriptionArabic: values?.description_l1,
    serviceArea: values?.service_areas ? values?.service_areas?.map((e) => e?.id) : values?.city_id,
    languages: values?.languages ? values?.languages?.map((e) => e?.id) : null,
    experience: values?.experience?.value,
    languageList: response?.languages
      ? response?.languages?.map((e) => ({
          id: e?.id,
          name: tenantUtils.getLocalisedString(e, 'name'),
        }))
      : [],
    experienceList: response?.experience
      ? response?.experience?.map((e) => ({
          id: e?.value,
          name: tenantUtils.getLocalisedString(e, 'label'),
        }))
      : [],
  };
};

const mapCredits = (credits, isUserCredits = false) => {
  if (!credits) return credits;

  const isZameen = !!tenantConstants?.ZAMEEN_KEY;

  if (isZameen) {
    // Zameen tenant: zameen -> ksa, olx -> olx
    if (credits?.zameen) {
      if (isUserCredits) {
        // User credits: only map primary platform (zameen -> ksa)
        return {
          ksa: {
            expiring_credits: credits?.zameen?.expiring,
            available: credits?.zameen?.available,
            total: credits?.zameen?.allocated,
            used: credits?.zameen?.used,
            percentage_used: credits?.zameen?.percentage_used,
          },
        };
      }
      // Agency credits: map both platforms
      return {
        ksa: {
          expiring_credits: credits?.zameen?.expiring,
          available: credits?.zameen?.available,
          total: credits?.zameen?.allocated,
          used: credits?.zameen?.used,
          percentage_used: credits?.zameen?.percentage_used,
        },
        olx: credits?.olx
          ? {
              expiring_credits: credits?.olx?.expiring,
              available: credits?.olx?.available,
              total: credits?.olx?.allocated,
              used: credits?.olx?.used,
              percentage_used: credits?.olx?.percentage_used,
            }
          : {
              expiring_credits: 0,
              available: 0,
              total: 0,
              used: 0,
              percentage_used: 0,
            },
      };
    }
    return credits;
  } else {
    // Other tenants: bayut -> ksa, dubizzle -> dubizzle
    if (credits?.bayut) {
      if (isUserCredits) {
        // User credits: only map primary platform (bayut -> ksa)
        return {
          ksa: {
            expiring_credits: credits?.bayut?.expiring,
            available: credits?.bayut?.available,
            total: credits?.bayut?.allocated,
            used: credits?.bayut?.used,
            percentage_used: credits?.bayut?.percentage_used,
          },
        };
      }
      // Agency credits: map both platforms
      return {
        ksa: {
          expiring_credits: credits?.bayut?.expiring,
          available: credits?.bayut?.available,
          total: credits?.bayut?.allocated,
          used: credits?.bayut?.used,
          percentage_used: credits?.bayut?.percentage_used,
        },
        dubizzle: credits?.dubizzle
          ? {
              expiring_credits: credits?.dubizzle?.expiring,
              available: credits?.dubizzle?.available,
              total: credits?.dubizzle?.allocated,
              used: credits?.dubizzle?.used,
              percentage_used: credits?.dubizzle?.percentage_used,
            }
          : {
              expiring_credits: 0,
              available: 0,
              total: 0,
              used: 0,
              percentage_used: 0,
            },
      };
    }
    return credits;
  }
};

const mapSurgeAgencyResponse = (response) => {
  if (!response?.agency) return response;

  const agency = response.agency;

  const mappedAgency = {
    ...agency,
    agency_logo: agency?.logo?.sizes?.thumbnail ?? null, //what will i get in logo 
    company_address: agency?.address,
    city_id: agency?.city?.id,
    city: agency?.city?.name,
    city_l1: agency?.city?.name_l1,
    dealing_cities: agency?.dealing_cities || [],
    credits: mapCredits(agency?.credits),
    quotas: agency?.quotas?.bayut !== undefined ? { ksa: agency.quotas.bayut } : agency.quotas,
    users: agency?.users?.map((user) => {
      const profileImageUrl = user?.profile_image?.sizes?.thumbnail;
      const userCredits = mapCredits(user?.credits, true);

      return {
        ...user,
        profile_image: profileImageUrl,
        user_role_within_agency: user?.role,
        is_credit_user: user?.credit_user,
        credits: userCredits,
        quotas: user?.quotas?.bayut !== undefined ? { ksa: user.quotas.bayut } : user.quotas,
        city_id: user?.city_id || (user?.city?.id ? user.city.id : null), //missing key
        location: user?.location,
        settings: user?.settings || [],//missing key
      };
    }) || [],
    designation: agency?.designation,//missing key
    broker_type: agency?.broker_type,
    license: agency?.license,//missing key
    country_id: agency?.country_id,//missing key
    agency_type: agency?.agency_type,
    agency_status: agency?.dispostion?.name,

    owner: agency?.owner
      ? {
          ...agency.owner,
          profile_image: agency?.owner?.profile_image,
          designation: agency?.owner?.designation,
          message: agency.owner.message,
        }
      : null,
  };

  return {
    ...response,
    agency: mappedAgency,
  };
};

export default { agencyDataMapper, agencyStaffDataMapper, agencyStaffUserMapper, mapSurgeAgencyResponse };
