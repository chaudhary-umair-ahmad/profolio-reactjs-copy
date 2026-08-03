import tenantData from '@data';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { t } from 'i18next';
import tenantTheme from '@theme';
import store from '@store';
import { capitalizeFirstLetter } from '../../../utility/utility';
import { normalizeBookedDateRanges } from '../../../helpers/bookedDateRanges';
import { isLandPropertyType } from '../data/listing-form-data';

export const postedToBayut = (e) => {
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

const getSummaryData = (data, statuses) => {
  const arr = Object.keys(data)?.length > 0 ? Object.keys(data) : [];
  const stats = {};
  arr.forEach((e) => {
    const status = statuses?.find((it) => it.slug == e);
    stats[capitalizeFirstLetter(e)] = {
      title: status?.name,
      mapping: status?.id,
      total: data[e],
    };
  });
  return stats;
};

const mapListingPurpose = (listingPurpose, listingCategory) => {
  const purposeHash = listingCategory?.purpose_hash;
  if (purposeHash?.slug || purposeHash?.name || purposeHash?.name_l1) {
    return {
      id: purposeHash?.id ?? listingCategory?.id,
      slug: purposeHash?.slug,
      title: purposeHash?.name,
      title_l1: purposeHash?.name_l1,
      name: purposeHash?.name,
      name_l1: purposeHash?.name_l1,
    };
  }
  if (listingPurpose) return listingPurpose;
  if (!listingCategory) return undefined;
  return {
    id: listingCategory?.id,
    slug: String(listingCategory?.purpose || '')
      .toLowerCase()
      .replace(/\s+/g, '-'),
    title: listingCategory?.purpose || listingCategory?.name,
    title_l1: listingCategory?.purpose_l1 || listingCategory?.name_l1,
    name: listingCategory?.purpose || listingCategory?.name,
    name_l1: listingCategory?.purpose_l1 || listingCategory?.name_l1,
  };
};

export const platformMapper = (e, user, setStatsLoading = true, existingStats) => {
  const pl = e?.platform_listings?.[0];
  const cat = e?.listing_category;
  const fallbackListingPurpose = mapListingPurpose(e?.listing_purpose, cat);
  const postedAt = e?.platforms?.posted_at ?? pl?.posted_at ?? e?.posted_at;
  const status = e?.status ?? pl?.status;
  const disposition = e?.disposition ?? pl?.disposition;
  const productsInfo = e?.platforms?.['ksa']?.products_information ?? (pl?.products_information || []).reduce((acc, p) => (p?.slug ? { ...acc, [p.slug]: p } : acc), {});
  const dyn = e?.dynamic_data?.dynamic_fields || {};
  const rawAdditionalForActions =
    dyn?.additional_details != null && typeof dyn.additional_details === 'object'
      ? dyn.additional_details
      : e?.additional_details != null && typeof e.additional_details === 'object'
        ? e.additional_details
        : null;
  const additionalDetailsForActions = rawAdditionalForActions
    ? {
        ...rawAdditionalForActions,
        booked_dates: normalizeBookedDateRanges(rawAdditionalForActions.booked_dates),
      }
    : null;
  const bookedForActions =
    dyn?.booked != null
      ? !!dyn.booked
      : e?.booked != null
        ? !!e.booked
        : !!(additionalDetailsForActions?.booked_dates?.length > 0);
  const listingForActions = {
    ...e,
    status,
    disposition,
    listing_purpose: e?.listing_purpose ?? fallbackListingPurpose,
    platforms: { ...e?.platforms, ksa: { ...e?.platforms?.ksa, products_information: productsInfo } },
    booked: bookedForActions,
    ...(additionalDetailsForActions != null && { additional_details: additionalDetailsForActions }),
  };
  return {
    id: e.id,
    property_id: e?.id,
    slug: 'ksa',
    posted_on: postedAt,
    expiry_date: e?.expiry_date ?? pl?.expiry_date,
    updated_at: e?.updated_at ?? pl?.updated_at,
    created_at: e?.created_at ?? pl?.created_at,
    renewing_on: e?.platforms?.['ksa']?.products_information?.['basic-listing']?.['auto_renewable_item']?.renewing_on ?? productsInfo['basic-listing']?.auto_renewable_item?.renewing_on,
    removed_at: e?.removed_at,
    ...(setStatsLoading && { views: 'loading', clicks: 'loading', leads: 'loading' }),
    status: tenantUtils.listingStatusMapper(status?.slug),
    ...(!setStatsLoading && existingStats && existingStats),
    disposition: tenantUtils.listingDispositionMapper(disposition, e),
    statusKey: 'disposition',
    ...((e.listing_purpose || fallbackListingPurpose) && {
      purpose: e.listing_purpose?.title ?? fallbackListingPurpose?.title,
      purposeId: e?.listing_purpose?.id ?? fallbackListingPurpose?.id,
    }),
    price: { value: e?.price, currency: t(tenantConstants.CURRENCY) },
    location: { ...e.location, breadcrumb: e?.location?.breadcrumb ?? e?.location?.breadcrumbs },
    posted: status ? postedToBayut(status?.slug) : false,
    icon: 'IconBayut',
    public_url: tenantUtils.getLocalisedString(e, 'url'),
    listingPlatformActions: tenantUtils.getListingPlatformActions(listingForActions, 'ksa', user),
    listingRowActions: (refsObject, loading) => {
      return tenantUtils.getListingRowActions(listingForActions, 'ksa', refsObject, loading);
    },
    expiryDays: e?.expiry_days || 30,
    ...(!!e?.user && { listingOwner: e?.user }),
    trucheck: e?.trucheck,
    is_otp_required: e?.is_otp_required,
    phone_number: e?.phone_number,
  };
};

export const listingMapper = (listing, user, setStatsLoading, existingStats = {}) => {
  const pl = listing?.platform_listings?.[0];
  const cat = listing?.listing_category;
  const dyn = listing?.dynamic_data?.dynamic_fields || {};
  const rawAdditionalFromResponse =
    dyn?.additional_details != null && typeof dyn.additional_details === 'object'
      ? dyn.additional_details
      : listing?.additional_details != null && typeof listing.additional_details === 'object'
        ? listing.additional_details
        : null;
  const additionalDetailsFromResponse = rawAdditionalFromResponse
    ? {
        ...rawAdditionalFromResponse,
        booked_dates: normalizeBookedDateRanges(rawAdditionalFromResponse.booked_dates),
      }
    : null;
  const bookedFromResponse =
    dyn?.booked != null
      ? !!dyn.booked
      : listing?.booked != null
        ? !!listing.booked
        : !!(additionalDetailsFromResponse?.booked_dates?.length > 0);
  const listingPurpose = mapListingPurpose(listing?.listing_purpose, cat);
  const listingType = listing?.listing_type ?? (cat && { title: cat.name, name: cat.name });
  const areaUnit =
    listing?.area_unit ??
    (dyn.area_unit != null || dyn.area_unit_value != null
      ? {
          value: dyn.area_unit_value,
          name: dyn.area_unit?.label ?? dyn.area_unit?.value,
          name_l1: dyn.area_unit?.label_l1 ?? dyn.area_unit?.value_l1,
        }
      : undefined);
  const breadcrumb = listing?.location?.breadcrumb ?? listing?.location?.breadcrumbs;
  const image = listing?.image ?? (listing?.images?.find((i) => i.main === 1) || listing?.images?.[0])?.sizes?.thumbnail;
  const productsInfo = listing?.platforms?.['ksa']?.products_information ?? (pl?.products_information || []).reduce((acc, p) => (p?.slug ? { ...acc, [p.slug]: p } : acc), {});

  const platforms = {
    property_id: listing?.id,
    ...(listingPurpose && { purpose: listingPurpose }),
    type: listingType,
    price: { value: listing?.price, currency: tenantConstants.CURRENCY },
    location: { ...listing?.location, breadcrumb },
    auto_renewable_item: (() => {
      const basic = productsInfo['basic-listing']?.auto_renewable_item ?? listing?.platforms?.['ksa']?.products_information?.['basic-listing']?.auto_renewable_item;
      return {
        isApplied: listing?.is_autorenewal_on ?? !!basic?.id,
        ...basic,
      };
    })(),
    data: [
      ...(!!user?.products?.platforms['ksa'] ? [platformMapper(listing, user, setStatsLoading, existingStats)] : []),
    ],
  };
  return {
    ...listing,
    id: listing?.id,
    booked: bookedFromResponse,
    ...(additionalDetailsFromResponse != null && { additional_details: additionalDetailsFromResponse }),
    listing_purpose: listingPurpose,
    type: listingType?.title,
    purpose: listingPurpose,
    property: {
      id: listing?.id,
      ...(listingPurpose && { purpose: listingPurpose }),
      isDailyRental: listingPurpose?.slug == 'daily-rental',
      isOffPlan: listing?.is_offplan_listing || null,
      // Land listings never surface Ready / Off-Plan.
      completion_status: isLandPropertyType(
        cat?.external_id ?? cat?.id ?? listing?.listing_type?.external_id ?? listing?.listing_type?.id,
      )
        ? null
        : listing?.completion_status ?? dyn.completion_status?.slug ?? null,
      projectStatus: (listing?.completion_status ?? dyn.completion_status?.slug) === 'ready' ? 'Ready' : 'Off-Plan',
      booked: bookedFromResponse,
      bookedDates: additionalDetailsFromResponse?.booked_dates,
      saleType: listing?.sale_type ?? dyn.sale_type,
      type: listingType,
      area: { value: areaUnit?.value, unit: areaUnit?.name },
      location: {
        ...listing?.location,
        breadcrumb: Array.isArray(breadcrumb) ? breadcrumb?.filter((e) => e?.level > 1)?.map((e) => tenantUtils.getLocalisedString(e, 'title'))?.join(', ') : breadcrumb,
      },
      image,
      imageCount: listing?.images_count ?? listing?.images?.length,
      price: { value: listing.price, currency: tenantConstants.CURRENCY },
      details: {
        ...listing?.rega_details?.property_specs,
        listingSpecs: tenantData?.getListingSpecs(listing),
        listing_type: listingType,
        regaId: listing?.ad_license,
        regaExpiryDate: listing?.platforms?.rega_expiry_date ?? pl?.rega_info?.rega_details?.expiry_date,
        permit_number: listing?.permit_number,
      },
      ...(listing?.health && { health: listing?.health }),
      showHealth: true,
      platform_listings: listing?.platform_listings,
      productsInfo: listing?.platforms?.ksa?.products_information ?? productsInfo,
      isBadge: !!productsInfo?.['basic-listing']?.is_applied,
      ...(listing?.discount_applied !== undefined && {
        discount_applied: listing.discount_applied,
      }),
      ...(listing?.discount_percentage != null && listing?.discount_percentage !== '' && {
        discount_percentage: listing.discount_percentage,
      }),
      ...(listing?.actual_price != null &&
        listing?.actual_price !== '' && {
          actual_price: listing.actual_price,
        }),
      platforms,
    },
    price: { value: listing.price, currency: tenantConstants.CURRENCY },
    area: { value: areaUnit?.value, unit: areaUnit?.id || 2 },
    ...(listing?.health && { health: listing?.health }),
    platforms,
  };
};

export const getMyListingsData = (summaryRes, listingsRes) => {
  const listings = listingsRes?.listings;
  const pagination = listingsRes?.pagination;
  const summary = getSummaryData(summaryRes?.summary, listingsRes?.statuses_and_dispositions);
  const user = store.getState().app.loginUser.user;

  return {
    list: listings && listings?.length ? listings?.map((item) => listingMapper(item, user, false)) : [],
    pagination: tenantUtils.getPaginationObject(pagination),
    tabFilterKey: 'f[nested.platform_listings.status.slug]',
    dontAllowRowSlection: true,
    statuses_and_dispositions: listingsRes?.statuses_and_dispositions,
    statuses: summary
      ? [
          ...Object.keys(summary).map((e) => ({
            ...summary[e],
            key: e === 'All' ? '' : summary[e].mapping,
            label: `${t(capitalizeFirstLetter(e))} (${summary[e].total})`,
            tab: `${t(capitalizeFirstLetter(e))} (${summary[e].total})`,
          })),
        ]
      : [],
  };
};

const updateListingStats = (listing) => {
  if (listing) {
    return {
      views: listing?.sum_search_count,
      leads: listing?.sum_lead_count,
      clicks: listing?.sum_view_count,
      ctr: (listing?.sum_view_count / listing?.sum_search_count) * 100,
      calls: listing?.sum_phone_view_count,
      emails_clicked: listing?.sum_email_view_count,
      emails_received: listing?.sum_email_lead_count,
      sms: listing?.sum_sms_view_count,
      whatsapp: listing?.sum_whatsapp_view_count,
      chat: listing?.sum_chat_lead_count,
      stats: {
        views: listing?.sum_search_count,
        clicks: listing?.sum_view_count,
        leads: listing?.sum_lead_count,
      },
      whatsapp_sent: listing?.sum_whatsapp_lead_count,
      whatsapp_chats: listing?.chats_initiated,
      calls_received: listing?.received_calls,
      calls_answered: listing?.answered_calls,
      calls_missed: listing?.missed_calls,
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
      statsError: 'Bayut Stats Error',
    };
  }
};

const getProductDetailToBeApplied = (allProducts, productSlug) => {
  const details = allProducts?.find((it) => it?.slug == productSlug);

  if (details) {
    return { ...tenantData.getListingActions(productSlug), ...details };
  } else {
    return details;
  }
};

/** Pick a duration key that exists on tier maps (30/60/90); listing calendar days may not match product tiers. */
const pickProductTierDuration = (listingExpiryDays, product) => {
  const map = product?.credits_required ?? product?.required_quantity;
  let allowed = Array.isArray(product?.allowed_expiry_durations)
    ? product.allowed_expiry_durations.map(String)
    : null;
  if (!allowed?.length && map && typeof map === 'object' && !Array.isArray(map)) {
    allowed = Object.keys(map).map(String);
  }
  if (!allowed?.length) {
    return String(listingExpiryDays ?? product?.default_expiry_days ?? 30);
  }
  const pref = listingExpiryDays != null && listingExpiryDays !== '' ? String(listingExpiryDays) : null;
  if (pref && allowed.includes(pref)) return pref;
  const def = product?.default_expiry_days != null ? String(product.default_expiry_days) : '30';
  if (allowed.includes(def)) return def;
  const sorted = [...allowed].sort((a, b) => Number(a) - Number(b));
  return sorted[0] ?? def;
};

const upsellDataMapper = (platformWiseData, listingDetailResponse) => {
  const productsHash = {};
  tenantData.products.forEach((e) => {
    productsHash[e.slug] = e;
  });

  const data = {
    availableCredits: platformWiseData?.available_credits,
    creditUnitPrice: platformWiseData?.credit_unit_price,
    isPosted: listingDetailResponse?.isListingPosted,
    // isPosted: true,
    headingMsg: '',
    descriptionMsg: '',
    currency: '',
    applicableProducts: [],
    subServices: [],
    serviceStates: {},
    autoRenewState: {},
    listing: listingDetailResponse?.listing,
  };

  data?.availableCredits > 0 ? (data.currency = 'Credits') : (data.currency = tenantConstants.CURRENCY_SYMBOL());

  platformWiseData?.products.forEach((item) => {
    const activeDuration = pickProductTierDuration(listingDetailResponse?.listingExpiryDays, item);
    if (item.is_add_on === false && item.slug !== 'refresh') {
      data.applicableProducts.push({
        ...productsHash[item.slug],
        requiredCredits: item.credits_required,
        price: item.product_price,
        isRecommended: item.is_recommended,
        isAddOn: item.is_add_on,
        activeDuration,
        id: item.product_id,
        title: tenantUtils.getLocalisedString(item, 'product_title'),
        description: tenantUtils.getLocalisedString(item, 'description'),
      });
      data.autoRenewState[item.product_id] = false;
    } else if (item.is_add_on === true) {
      data.subServices.push({
        ...productsHash[item.slug],
        requiredCredits: item.credits_required,
        price: item.product_price,
        isRecommended: item.is_recommended,
        activeDuration,
        id: item.product_id,
        title: tenantUtils.getLocalisedString(item, 'product_title'),
        description: tenantUtils.getLocalisedString(item, 'description'),
      });
      data.serviceStates[item.product_id] = false;
    }
  });
  data.headingMsg = listingDetailResponse?.isListingPosted
    ? 'Your Listing has been Posted Successfully!'
    : 'Almost There';
  data.descriptionMsg = listingDetailResponse?.isListingPosted
    ? 'Make your Listing Hot and reach 10x more Buyers'
    : 'Choose the type of listing you want to publish';

  return data;
};

export const dataMapper = (platformWiseData, listingDetailResponse) => {
  const productsHash = {};
  tenantData.products.forEach((e) => {
    productsHash[e.slug] = e;
  });

  const data = {
    availableCredits: platformWiseData?.available_credits,
    creditUnitPrice: platformWiseData?.credit_unit_price,
    isPosted: listingDetailResponse?.isListingPosted,
    // isPosted: true,
    headingMsg: '',
    descriptionMsg: '',
    currency: '',
    applicableProducts: [],
    subServices: [],
    serviceStates: {},
    autoRenewState: {},
    listing: listingDetailResponse?.listing,
  };

  data?.availableCredits > 0 ? (data.currency = 'Credits') : (data.currency = tenantConstants.CURRENCY_SYMBOL());

  platformWiseData?.products.forEach((item) => {
    const activeDuration = pickProductTierDuration(listingDetailResponse?.listingExpiryDays, item);
    if (item.is_add_on === false && item.slug !== 'refresh') {
      data.applicableProducts.push({
        ...productsHash[item.slug],
        requiredCredits: item.credits_required,
        price: item.product_price,
        isRecommended: item.is_recommended,
        isAddOn: item.is_add_on,
        activeDuration,
        id: item.product_id,
        title: tenantUtils.getLocalisedString(item, 'product_title'),
        description: tenantUtils.getLocalisedString(item, 'description'),
      });
      data.autoRenewState[item.product_id] = false;
    } else if (item.is_add_on === true) {
      data.subServices.push({
        ...productsHash[item.slug],
        requiredCredits: item.credits_required,
        price: item.product_price,
        isRecommended: item.is_recommended,
        activeDuration,
        id: item.product_id,
        title: tenantUtils.getLocalisedString(item, 'product_title'),
        description: tenantUtils.getLocalisedString(item, 'description'),
      });
      data.serviceStates[item.product_id] = false;
    }
  });
  data.headingMsg = listingDetailResponse?.isListingPosted
    ? 'Your Listing has been Posted Successfully!'
    : 'Almost There';
  data.descriptionMsg = listingDetailResponse?.isListingPosted
    ? 'Make your Listing Hot and reach 10x more Buyers'
    : 'Choose the type of listing you want to publish';

  return data;
};

const widgetParser = (listings, platform) => {
  const user = store.getState().app?.loginUser.user;
  const productsToShow = user?.isCurrencyUser
    ? [{ slug: 'signature-listing' }, { slug: 'hot-listing' }, { slug: 'basic-listing' }]
    : [{ slug: 'hot-listing' }, { slug: 'basic-listing' }];

  const data = {
    ksa: {
      title: 'Listings',
      icon_data: {},
      link_data: {
        text: 'View All Listings',
        to: '/listings',
      },
      total_title: 'Active',
      total_title_icon: 'ActiveListingIcon',
      total_value: '',
      purposes: [
        {
          id: 1,
          icon: 'IconForSale',
          iconProps: { color: tenantTheme['color-for-sale'], hasBackground: true },
          title: 'For Sale',
          value: '',
        },
        {
          id: 2,
          icon: 'IconForRent',
          iconProps: { color: tenantTheme['color-for-rent'], hasBackground: true },
          title: 'To Rent',
          value: '',
        },
        {
          id: 4,
          icon: 'IconRental',
          iconProps: { color: tenantTheme['color-for-rent'], hasBackground: true },
          title: 'Daily Rentals',
          value: '',
        },
      ],
      products: tenantUtils.generateProductData(productsToShow),
    },
  };

  const currentPlatform = data?.[platform];
  currentPlatform.total_value = listings?.active;
  currentPlatform.purposes[0].value = listings?.sale;
  currentPlatform.purposes[1].value = listings?.rent;
  currentPlatform.purposes[2].value = listings?.daily_rental;
  currentPlatform.products.forEach((item, i) => {
    currentPlatform.products[i].value = listings?.[item.slug_alt];
  });

  return data?.[platform];
};

const getListingSummaryStats = (response, platform) => {
  return { [platform]: widgetParser(response?.data?.stats?.[platform], platform) };
};


export default {
  getMyListingsData,
  listingMapper,
  platformMapper,
  updateListingStats,
  getProductDetailToBeApplied,
  upsellDataMapper,
  getListingSummaryStats,
};
