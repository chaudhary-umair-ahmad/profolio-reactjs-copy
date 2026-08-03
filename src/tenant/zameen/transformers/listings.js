import tenantData from '@data';
import tenantUtils from '@utils';
import { t } from 'i18next';
import store from '@store';
import { capitalizeFirstLetter } from '../../../utility/utility';

export const postedToZameen = (e) => {
  switch (e) {
    case 'not_listed':
      return false;
    case undefined:
      return false;
    case 'limit':
      return false;
    default:
      return true;
  }
};

export const postedToOLX = (e) => {
  switch (e) {
    case 'not_listed':
      return false;
    case undefined:
      return false;
    default:
      return true;
  }
};

const getTitle = (key) => {
  switch (key) {
    case 'active':
      return {
        title: 'Active',
        mapping: 'Active',
      };
    case 'deleted':
      return {
        title: 'Deleted',
        mapping: 'Deleted',
      };
    case 'downgraded':
      return {
        title: 'Downgraded',
        mapping: 'Downgraded',
      };

    case 'expired':
      return {
        title: 'Expired',
        mapping: 'Expired',
      };
    case 'inactive':
      return {
        title: 'Inactive',
        mapping: 'Inactive',
      };
    case 'pending':
      return {
        title: 'Pending',
        mapping: 'Pending',
      };
    case 'rejected':
      return {
        title: 'Rejected',
        mapping: 'Rejected',
      };
  }
};

const getSummaryData = (data) => {
  delete data.limit;
  const arr = Object.keys(data)?.length > 0 ? Object.keys(data) : [];
  const stats = {};
  arr.forEach((e) => {
    stats[capitalizeFirstLetter(e)] = {
      ...getTitle(e),
      total: data[e],
    };
  });
  return stats;
};

export const zameenMapper = (e, statsExists = false) => {
  return {
    id: e.id,
    property_id: e?.id,
    slug: 'zameen',
    posted_on: e?.platform?.zameen?.posted_at,
    consumedQuota: e?.consumed_quota,
    expiry_date: e?.expiry_date,
    updated_at: e?.updated_at,
    status: tenantUtils.listingStatusMapper(e?.platform?.zameen?.status, e, 'zameen'),
    statusKey: 'status',
    ...(e.listing_purpose && { purpose: e.listing_purpose.title }),
    price: { value: e?.price ? e?.price : e?.rental_price, currency: e?.currency },
    location: e.location,
    hidden: e?.platform?.zameen?.hidden,
    ...(!statsExists && {
      views: e?.listing_stats?.imp_total,
      leads:
        e?.listing_stats?.phone_total +
        e?.listing_stats?.email_total +
        e?.listing_stats?.whatsapp_total +
        e?.listing_stats?.sms_total,
      clicks: e?.listing_stats?.views_count,
    }),
    posted: e?.platform?.zameen?.status ? postedToZameen(e?.platform?.zameen?.status) : false,
    stories: e?.platform?.zameen?.stories,
    category: e?.platform?.zameen?.mark?.title,
    icon: 'IconZameen',
    public_url: e?.platform?.zameen?.public_url,
    listingPlatformActions: tenantUtils.getListingPlatformActions(e, 'zameen'),
    listingRowActions: (refsObject, loading) => {
      const actions = tenantUtils.getListingRowActions(e, 'zameen', refsObject, loading);
      return actions;
    },
    ...(!!e?.user && { listingOwner: e?.user }),
  };
};

const olxMapper = (e, statsExists = false) => {
  return {
    id: e?.platform?.olx?.platform_listing_id,
    property_id: e?.id,
    slug: 'olx',
    posted: !!e?.platform?.olx?.status ? postedToOLX(e?.platform?.olx?.status) : false,
    consumedQuota: e?.platform?.olx?.consumed_quota,
    status: tenantUtils.listingStatusMapper(e?.platform?.olx?.status, e, 'olx'),
    statusKey: 'status',
    ...(e.listing_purpose && { purpose: e.listing_purpose.title }),
    price: { value: e.price ? e?.price : e?.rental_price, currency: e?.currency },
    location: e.location,
    posted_on: !!e?.platform?.olx && e?.platform?.olx?.posted_at,
    updated_at: !!e?.platform?.olx && e?.platform?.olx?.date_updated,
    hidden: e?.platform?.olx?.hidden,
    ...(!statsExists && { views: 'loading' }),
    ...(!statsExists && { leads: 'loading' }),
    category: e?.platform?.olx?.mark?.title,
    public_url: e?.platform?.olx?.public_url,
    icon: 'IconOLX',
    listingPlatformActions: tenantUtils.getListingPlatformActions(e, 'olx'),
    listingRowActions: (refsObject, loading) => {
      const actions = tenantUtils.getListingRowActions(e, 'olx', refsObject, loading);
      return actions;
    },
    ...(!!e?.user && { listingOwner: e?.user }),
  };
};

const listingMapper = (listing, user, statsExists) => {
  const platforms = {
    property_id: listing?.id,
    ...(listing?.listing_purpose && { purpose: listing?.listing_purpose }),
    type: listing?.listing_type,
    price: { value: listing?.price ? listing?.price : listing?.rental_price, currency: listing?.currency },
    location: listing?.location,
    stories: listing?.platform?.zameen?.stories,
    stats: listing?.listing_stats,
    data: [
      ...(!!user?.products?.platforms['zameen'] ? [zameenMapper(listing, statsExists && statsExists)] : []),
      ...(!!user?.products?.platforms['olx'] ? [olxMapper(listing, statsExists && statsExists)] : []),
    ],
  };

  return {
    ...listing,
    id: listing?.id,
    type: listing?.listing_type?.title,
    property: {
      id: listing?.id,
      ...(listing?.listing_purpose && { purpose: listing?.listing_purpose }),
      type: listing?.listing_type,
      area: { value: listing?.area_unit_value, unit: listing?.area_unit },
      location: {
        ...listing?.location,
        breadcrumb: listing?.location?.breadcrumb
          ?.filter((e) => e?.level > 1)
          ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
          ?.join(', '),
      },
      ...(listing?.listing_health && {
        health: listing?.listing_health,
      }),
      canApplyRefresh: !listing?.platform?.zameen?.refresh_upto
        ? true
        : !!(new Date() > new Date(listing?.platform?.zameen?.refresh_upto)),
      details: {
        listing_type: listing?.listing_type,
        listingSpecs: tenantData?.getListingSpecs(listing),
      },
      platforms,
      image: listing?.images?.find((e) => e?.is_main_image === 1),
      imageCount: listing?.images_count,
      price: { value: listing.price ? listing?.price : listing?.rental_price, currency: listing?.currency },
    },
    price: { value: listing.price ? listing?.price : listing?.rental_price, currency: listing?.currency },
    area: { value: listing?.area_unit_value, unit: listing?.area_unit },
    posted_by: { name: listing?.user?.name },
    active_images_count: { value: listing?.images_count },
    ...(listing?.listing_health && {
      health: listing?.listing_health,
    }),
    platforms,
  };
};

export const getMyListingsData = (summaryRes, listingsRes) => {
  const listings = listingsRes?.listings;
  const pagination = listingsRes?.pagination;
  const summary = getSummaryData(summaryRes?.summary);
  const user = store.getState().app.loginUser.user;

  return {
    list: listings && listings?.length ? listings?.map((item) => listingMapper(item, user)) : [],
    pagination: tenantUtils.getPaginationObject(pagination),
    tabFilterKey: 'q[firmstate]',
    statuses: summary
      ? [
          ...Object.keys(summary).map((e) => ({
            ...summary[e],
            key: e === 'All' ? '' : summary[e].mapping,
            label: `${capitalizeFirstLetter(e)} (${summary[e].total})`,
            tab: `${capitalizeFirstLetter(e)} (${summary[e].total})`,
          })),
        ]
      : [],
  };
};

const updateListingStats = (listing) => {
  if (listing) {
    return {
      views: listing?.sum_search_count,
      leads: listing?.sum_phone_view_count + listing?.sum_sms_view_count + listing?.sum_chat_lead_count,
      clicks: listing?.sum_view_count,
      ctr: (listing?.sum_view_count / listing?.sum_search_count) * 100,
      calls: listing?.sum_phone_view_count,
      emails: listing?.sum_email_view_count,
      sms: listing?.sum_sms_view_count,
      whatsapp: listing?.sum_whatsapp_view_count,
      chat: listing?.sum_chat_lead_count,
    };
  } else {
    return {
      views: '',
      clicks: '',
      ctr: '',
      calls: '',
      emails: '',
      sms: '',
      whatsapp: '',
      leads: '',
      statsError: 'Olx Stats Error',
    };
  }
};

/** Zameen-only: legacy sufficient-credits check (no duration-map resolution). */
const getProductDetailToBeApplied = (data, productSlug) => {
  const details = data?.products?.find((it) => it?.slug == productSlug);
  if (details) {
    return {
      ...tenantData.getListingActions(productSlug),
      ...details,
      isSufficient: data?.available_credits >= details?.credits_required,
      availableCredits: data?.available_credits,
    };
  }
  return details;
};

export const deleteListingTransformer = (response) => {
  if (!response?.listing) {
    return {
      dontUpdate: true,
    };
  } else {
    return {
      data:
        platform === 'olx'
          ? {
              data: {
                ...olxMapper(response.data.listing, true),
                listing_id: listingId,
                replaceKey: 'platforms.data[1]',
                valueExists: true,
                quota_consumption: response?.listing?.platform?.['olx']?.consumed_quota,
              },
            }
          : {
              data: {
                ...zameenMapper(response.data.listing, true),
                listing_id: listingId,
                replaceKey: 'platforms.data[0]',
                valueExists: true,
                quota_consumption: response?.listing?.platform?.['zameen']?.consumed_quota,
              },
            },
    };
  }
};

const listingHasUpgrades = (listing, user) => {
  return (
    (!!user?.platforms?.[0] && !listing?.platforms?.zameen) ||
    (!!user?.platforms?.[1] && !listing?.platforms?.olx) ||
    !!(listing?.platforms?.zameen && listing?.platforms?.zameen?.haveUpgrades) ||
    !!(listing?.platforms?.olx && listing?.platforms?.haveUpgrades)
  );
};

const upsellListingMapper = (listing) => {
  const platforms = {};
  if (postedToZameen(listing.platform?.zameen?.status) || listing?.platform?.zameen?.status == 'limit') {
    platforms.zameen = {
      status: tenantUtils.listingStatusMapper(listing.platform?.zameen?.status),
      isFreeListing: !!(listing?.platform?.zameen?.status === 'limit'),
      haveUpgrades: !!tenantData.getListingActions('shot_listing', listing.platform, 'zameen')?.canApply,
      products: [
        {
          ...tenantData.getListingActions('shot_listing', listing.platform, 'zameen'),
          upgradeTitle: 'Make Listing Super Hot Listing',
          name: 'Super Hot Listing',
        },
        {
          ...tenantData.getListingActions('hot_listing', listing.platform, 'zameen'),
          upgradeTitle: 'Make Listing Hot Listing',
          name: 'Hot Listing',
        },
      ],
      description: 'Better reach on the platform',
    };
  }
  if (postedToOLX(listing?.platform?.olx?.status)) {
    platforms.olx = {
      ...listing.platform.olx,
      status: tenantUtils.listingStatusMapper(listing.platform.olx.status),
      haveUpgrades: !!tenantData.getListingActions('olx_feature', listing.platform, 'olx')?.canApply,
      description: 'Better reach on the platform',
      isFreeListing: false,
      products: [
        {
          ...tenantData.getListingActions('olx_feature', listing.platform, 'olx'),
          upgradeTitle: 'Make Listing Feature',
          name: 'Feature',
        },
      ],
    };
  }
  return platforms;
};

export const productsDataMapper = (response) => {
  const productsByPlatform = { zameen: [], olx: [] };

  const productList = response?.products || [];
  if (productList.length) {
    productList.forEach((product) => {
      const { product_id, key: slug } = product;

      if (slug?.includes('olx')) {
        productsByPlatform.olx.push({
          ...tenantData.getListingActions(slug),
          ...product,
          product_id,
          price: tenantUtils.makePriceForPackage('olx', product),
        });
      } else {
        productsByPlatform.zameen.push({
          ...tenantData.getListingActions(slug),
          ...product,
          product_id,
          price: tenantUtils.makePriceForPackage('zameen', product),
        });
      }
    });
  }

  return {
    platformProducts: productsByPlatform,
    products: productList.map((e) => ({
      ...tenantData.getListingActions(e?.key),
      ...e,
    })),
  };
};

const widgetParser = (listings, platform) => {
  const data = {
    zameen: {
      brandColor: tenantData?.platformList?.find((item) => item.slug === 'zameen')?.brandColor,
      title: 'Listings',
      icon_data: {
        icon: 'IconZameen',
        icon_props: {
          size: '1.6em',
          iconBackgroundColor: '#fff',
          hasBackground: true,
        },
      },
      link_data: {
        text: 'View all Zameen Listings',
        to: '/listings?platform=zameen',
      },

      total_title: 'Active',
      total_title_icon: 'ActiveListingIcon',
      total_value: '',
      purposes: [
        {
          id: 1,
          icon: 'IconPropertyBuy',
          title: 'For Sale',
          iconProps: { color: '#28b16d', hasBackground: true },
          value: '',
        },
        {
          id: 2,
          icon: 'IconPropertyRent',
          iconProps: { color: '#479eeb', hasBackground: true },
          title: 'For Rent',
          value: '',
        },
      ],
      products: tenantUtils.generateProductData([{ slug: 'shot_listing' }, { slug: 'hot_listing' }]),
    },
    olx: {
      brandColor: tenantData.platformList?.find((item) => item.slug === 'olx')?.brandColor,
      title: 'Listings',
      icon_data: {
        icon: 'IconOLX',
        icon_props: {
          size: '1.6em',
          iconBackgroundColor: '#fff',
          hasBackground: true,
        },
      },
      link_data: {
        text: 'View all Olx Listings',
        to: '/listings?platform=olx',
      },
      total_title: 'Active',
      total_title_icon: 'ActiveListingIcon',
      total_value: '',
      purposes: [
        {
          id: 1,
          icon: 'IconPropertyBuy',
          iconProps: { color: '#28b16d', hasBackground: true },
          title: 'For Sale',
          value: '',
        },
        {
          id: 2,
          icon: 'IconPropertyRent',
          iconProps: { color: '#479eeb', hasBackground: true },
          title: 'For Rent',
          value: '',
        },
      ],
      products: tenantUtils.generateProductData([
        {
          slug: 'olx_feature',
          iconProps: {
            hasBackground: true,
            color: '#1f1f1f',
            size: '1em',
            style: {
              '--icon-bg-color': '#ffec74',
            },
          },
        },
        {
          slug: 'olx_standard',
          iconProps: {
            hasBackground: true,
            color: '#1f1f1f',
            size: '1em',
          },
        },
      ]),
    },
  };

  const currentPlatform = data[platform];
  currentPlatform.total_value = listings?.total;
  currentPlatform.purposes[0].value = listings?.sale;
  currentPlatform.purposes[1].value = listings?.rent;
  currentPlatform.products.forEach((item, i) => {
    currentPlatform.products[i].value = listings?.[item?.slug_alt];
  });

  return data?.[platform];
};

const getListingSummaryStats = (response, platform) => {
  return { [platform]: widgetParser(response?.data?.listings?.[platform], platform) };
};

export default {
  getMyListingsData,
  getListingSummaryStats,
  postedToZameen,
  productsDataMapper,
  postedToOLX,
  zameenMapper,
  olxMapper,
  listingMapper,
  updateListingStats,
  getProductDetailToBeApplied,
  deleteListingTransformer,
  listingHasUpgrades,
  upsellListingMapper,
};
