import tenantData from '@data';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { COMMA_SPLIT } from '../../../constants/dynamicFields';
import { getDynamicDisplaySortOrder } from '../../../helpers/dynamicDisplayOrder';
import { t } from 'i18next';
import tenantTheme from '@theme';
import store from '@store';
import { capitalizeFirstLetter, resolveCreditsRequired } from '../../../utility/utility';

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

export const platformMapper = (e, user, platform, setStatsLoading = true, existingStats) => {
  let platformListing = null;
  let platformListingId;

  if (e?.platform_listings && Array.isArray(e.platform_listings)) {
    // New API structure: platform_listings is an array
    platformListing = e.platform_listings.find(pl => pl?.platform?.slug === platform?.slug);
    platformListingId = platformListing?.platform_listing_id;
  } else if (e?.platforms?.[platform?.slug]) {
    // Old structure: platforms is an object
    platformListing = e.platforms[platform.slug];
    platformListingId = platformListing?.platform_listing_id;
  } else if (!user?.isMultiPlatform) {
    // Fallback for non-multi-platform users
    const possiblePlatforms = ['bayut', 'dubizzle'];
    possiblePlatforms?.forEach(gccPlatform => {
      if (e?.platform_listings) {
        const found = e.platform_listings.find(pl => pl?.platform?.slug === gccPlatform);
        if (found) {
          platformListingId = found?.platform_listing_id;
        }
      } else if (e?.platforms?.[gccPlatform]) {
        platformListingId = e?.platforms?.[gccPlatform]?.platform_listing_id;
      }
    });
  }
  const statusSlug = platformListing?.status?.slug;
  const dispositionSlug = platformListing?.disposition?.slug;

  const productsInfoFromPl = platformListing?.products_information;
  const productsInfoResolved = Array.isArray(productsInfoFromPl)
    ? productsInfoFromPl.reduce((acc, p) => (p?.slug ? { ...acc, [p.slug]: p } : acc), {})
    : productsInfoFromPl;
  const productsInfo = e?.platforms?.[platform?.slug]?.products_information ?? productsInfoResolved;

  return {
    id: e.id,
    platform_listing_id: platformListingId,
    property_id: e?.id,
    slug: platform?.slug,
    ...(setStatsLoading && { stats: { views: 'loading', clicks: 'loading', leads: 'loading' } }),
    ...(!setStatsLoading && existingStats && { stats: existingStats?.platforms?.[platform?.slug]?.stats }),
    showPostedAt: statusSlug === 'active',
    postedOn: platformListing?.posted_at,
    status: tenantUtils.listingStatusMapper(statusSlug),
    public_url: platformListing?.url || tenantUtils.getLocalisedString(platformListing, 'url'),
    disposition: tenantUtils.listingDispositionMapper(platformListing?.disposition),
    location: { ...e.location, breadcrumb: e?.location?.breadcrumb || e?.location?.breadcrumbs },
    hidePostNowBtn:
      statusSlug === 'active' ||
      statusSlug === 'pending' ||
      dispositionSlug === 'rejected',
    showStats:
      statusSlug === 'active' ||
      dispositionSlug === 'changes-in-review',
    icon: platform?.icon,
    listingPlatformActions: tenantUtils.getListingPlatformActions(e, user, platform?.slug),
    isBadge:
      platform?.slug === 'bayut'
        ? platformListing?.products_information?.find(p => p?.slug === 'hot-listing')?.is_applied
        : platformListing?.products_information?.find(p => p?.slug === 'feature')?.is_applied,
    productsInfo,
    ...(!!e?.user && { listingOwner: e?.user }),
    ...(!!e?.posted_by && { listingOwner: e?.posted_by }),
    user: user,
  };
};

export const listingMapper = (listing, user, setStatsLoading, existingStats = {}) => {
  const platformsObj = {};
  if (listing?.platform_listings && Array.isArray(listing.platform_listings)) {
    listing.platform_listings.forEach(platformListing => {
      const platformSlug = platformListing?.platform?.slug;
      if (platformSlug) {
        // Transform products_information from array to object for compatibility
        const productsInfoArray = platformListing?.products_information || [];
        const productsInfoObject = productsInfoArray.reduce((acc, product) => {
          if (product?.slug) {
            acc[product.slug] = product;
          }
          return acc;
        }, {});

        platformsObj[platformSlug] = {
          ...platformListing,
          products_information: productsInfoObject,
        };
      }
    });
  } else if (listing?.platforms) {
    // Keep existing platforms structure if present
    Object.assign(platformsObj, listing.platforms);
  }
  // Extract dynamic fields
  const dynamicFields = listing?.dynamic_data?.dynamic_fields || {};
  const areaValue = dynamicFields?.area || dynamicFields?.area_unit_value;
  const areaUnit = dynamicFields?.area_unit;
  // Extract beds and baths - can be object with value property or direct value
  const beds = typeof dynamicFields?.beds === 'object' && dynamicFields?.beds?.value
    ? dynamicFields.beds.value
    : dynamicFields?.beds;
  const baths = typeof dynamicFields?.baths === 'object' && dynamicFields?.baths?.value
    ? dynamicFields.baths.value
    : dynamicFields?.baths;

  // Map listing_category to listing_purpose and listing_type
  const listingCategory = listing?.listing_category;
  const listingPurpose = listingCategory?.purpose
    ? {
      title: listingCategory.purpose,
      title_l1: listingCategory.purpose_l1,
      slug: listingCategory.purpose.toLowerCase().replace(/\s+/g, '-'),
    }
    : null;

  const listingType = listingCategory?.name
    ? {
      title: listingCategory.name,
      title_l1: listingCategory.name_l1,
      slug: listingCategory.slug,
    }
    : null;

  // Handle location breadcrumbs (can be breadcrumb or breadcrumbs)
  const locationBreadcrumbs = listing?.location?.breadcrumbs || listing?.location?.breadcrumb || [];
  const breadcrumbString = locationBreadcrumbs
    ?.filter((e) => e?.level > 1)
    ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
    ?.join(', ');

  // Get main image - handle both array of image objects and single image
  const images = listing?.images || [];
  const mainImageObj = images.find(img => img?.main === 1) || images[0];
  // Extract image URL from object (can have sizes property) or use directly
  const mainImage = mainImageObj?.sizes?.thumbnail || null;
  const imageCount = images.length;

  // Calculate expiry days from platform listings
  let expiryDays = listing?.expiry_days || 30;
  if (listing?.platform_listings?.length > 0) {
    const firstPlatform = listing.platform_listings[0];
    if (firstPlatform?.expiry_date) {
      const expiryDate = new Date(firstPlatform.expiry_date);
      const now = new Date();
      expiryDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    }
  }

  const platformHealth =
    listing?.health || listing?.platform_listings?.find((pl) => pl?.platform?.slug === 'bayut')?.health || null;

  // Build platforms object with platform-specific data
  const platforms = {
    property_id: listing?.id,
    ...(listingPurpose && {
      purpose: listingPurpose,
      purposeId: listingPurpose?.title,
    }),
    expiryDays: expiryDays,
    isMultiPlatform: user?.isMultiPlatform,
    listingRowActions: (refsObject, loading) => {
      // Create a listing object with platforms structure for getListingRowActions
      const listingWithPlatforms = {
        ...listing,
        platforms: platformsObj,
        platform_listings: listing?.platform_listings,
      };
      const actions = tenantUtils.getListingRowActions(listingWithPlatforms, refsObject, loading, user);
      return actions;
    },
    ...(user?.platforms || []).reduce((acc, platform) => {
      if (platform?.slug) {
        // Create a merged listing object with platforms structure for platformMapper
        const listingWithPlatforms = {
          ...listing,
          platforms: platformsObj,
          platform_listings: listing?.platform_listings,
        };
        acc[platform.slug] = platformMapper(listingWithPlatforms, user, platform, setStatsLoading, existingStats);
      }
      return acc;
    }, {}),
  };
  return {
    ...listing,
    id: listing?.id,
    images: images,
    property: {
      id: listing?.id,
      ...(listingPurpose && { purpose: listingPurpose }),
      type: listingType,
      area: {
        value: areaValue || listing?.area_unit?.value,
        unit: areaUnit?.label || areaUnit?.name || listing?.area_unit?.name
      },
      location: {
        ...listing?.location,
        breadcrumb: breadcrumbString,
        breadcrumbs: locationBreadcrumbs,
      },
      image: mainImage,
      imageCount: imageCount,
      price: {
        value: listing?.price,
        currency: listing?.currency || tenantConstants.CURRENCY
      },
      details: {
        listingSpecs: tenantData?.getListingSpecs({
          ...listing,
          beds: beds,
          baths: baths,
        }),
        listing_type: listingType,
      },
      ...(platformHealth && {
        health: platformHealth,
      }),
      showHealth: true,
    },
    platforms,
    platform_listings: listing?.platform_listings,
  };
};

export const getMyListingsData = (summaryRes, listingsRes, userId) => {
  const listings = listingsRes?.listings;
  const pagination = listingsRes?.pagination;
  const summary = getSummaryData(summaryRes?.summary, summaryRes?.statuses_and_dispositions);
  const loginUser = store.getState().app.loginUser?.user;
  const isAgency = loginUser?.agency?.id;
  let user = {};
  if (isAgency) {
    user = loginUser?.agency?.users?.find((e) => e?.id == userId);
  } else {
    user = loginUser;
  }
  if (!user || userId == -1) {
    user = {
      ...loginUser,
      ...loginUser?.agency,
      name: loginUser?.agency?.name,
      name_l1: loginUser?.agency?.name_l1,
      id: -1,
      profile_image: loginUser?.agency?.agency_logo,
      is_agency_admin: true,
    };
  }
  return {
    list: listings && listings?.length ? listings?.map((item) => listingMapper(item, user)) : [],
    pagination: tenantUtils.getPaginationObject(pagination),
    tabFilterKey: 'f[nested.platform_listings.status.slug]',
    dontAllowRowSlection: true,
    statuses_and_dispositions: summaryRes?.statuses_and_dispositions,
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
      emails: listing?.sum_email_lead_count,
      sms: listing?.sum_sms_view_count,
      whatsapp: listing?.sum_whatsapp_view_count,
      chat: listing?.sum_chat_lead_count,
      stats: {
        views: listing?.sum_search_count,
        clicks: listing?.sum_view_count,
        leads: listing?.sum_lead_count,
      },
    };
  } else {
    return {
      views: '',
      leads: '',
      clicks: '',
      ctr: '',
      calls: '',
      emails: '',
      sms: '',
      whatsapp: '',
      chat: '',
      stats: {
        views: '',
        clicks: '',
        leads: '',
      },
      statsError: 'Bayut Stats Error',
    };
  }
};

const getProductDetailToBeApplied = (data, productSlug) => {
  const details = data?.products?.find((it) => it?.slug == productSlug);
  if (details) {
    return {
      ...tenantData.getListingActions(productSlug),
      ...details,
      isSufficient:
        data?.available_credits >=
        (resolveCreditsRequired(details?.credits_required, 30, details?.default_expiry_days) ?? 0),
      availableCredits: data?.available_credits,
    };
  } else {
    return details;
  }
};

const getProductDetails = (allProducts) => {
  return allProducts?.length
    ? allProducts?.map((e) => {
        const productDetails = tenantData.getListingActions(e?.slug);
        if (productDetails) {
          return { ...productDetails, ...e };
        } else {
          return e;
        }
      })
    : [];
};

/**
 * Normalize new surge applicable_products API response to old shape per platform.
 * New API: platform has credits.available, products[].id|required_quantity|price|title|usage_type
 * Old shape: available_credits, products[].product_id|credits_required|product_price|product_title|product_usage_type
 */
export const normalizeApplicableProductsResponse = (rawResponse) => {
  if (!rawResponse || typeof rawResponse !== 'object') return rawResponse;
  const normalized = {};
  Object.keys(rawResponse).forEach((key) => {
    if (key === 'success') {
      normalized[key] = rawResponse[key];
      return;
    }
    const platformData = rawResponse[key];
    if (!platformData || !platformData?.products) {
      normalized[key] = platformData;
      return;
    }
    normalized[key] = {
      ...platformData,
      available_credits: platformData?.credits?.available,
      products: (platformData.products || []).map((p) => ({
        ...p,
        product_id: p.id,
        product_title: p.title,
        product_title_l1: p.title_l1,
        // Keep per-duration maps for upsell UI (requiredCredits[activeDuration]); do not collapse to a scalar.
        credits_required: (() => {
          const src = p.required_quantity ?? p.credits_required;
          if (src != null && typeof src === 'object' && !Array.isArray(src)) return src;
          return resolveCreditsRequired(src, p.default_expiry_days, p.default_expiry_days);
        })(),
        product_price: (() => {
          const src = p.price ?? p.product_price;
          if (src != null && typeof src === 'object' && !Array.isArray(src)) return src;
          return resolveCreditsRequired(src, p.default_expiry_days, p.default_expiry_days);
        })(),
        product_usage_type: p.usage_type,
      })),
    };
  });
  return normalized;
};

const upsellDataMapper = (platformWiseData, listingDetailResponse, platformProductSlugs) => {
  const user = store.getState().app.loginUser.user;

  const products = { bayut: ['hot-listing'], dubizzle: ['feature'] };

  let data = {
    platforms: {},
  };
  user?.platforms?.forEach((e) => {
    if (platformWiseData?.[e?.slug]) {
      const hasProductsFromApi = (platformWiseData[e.slug]?.products?.length ?? 0) > 0;
      const isPosted = listingDetailResponse?.listing?.platforms?.[e?.slug]?.is_posted;
      if (!hasProductsFromApi && !isPosted) return;
      data.platforms[e.slug] = {
        availableCredits: 0,
        creditUnitPrice: 0,
        isPosted: false,
        products: products?.[e?.slug],
      };
    }
  });

  Object.keys(data.platforms)?.forEach((platform) => {
    data.platforms[platform] = {
      ...data?.platforms?.[platform],
      availableCredits: platformWiseData?.[platform]?.available_credits,
      creditUnitPrice: platformWiseData?.[platform]?.credit_unit_price,
      isPosted: listingDetailResponse?.listing?.platforms?.[platform]?.is_posted,
      products: data.platforms?.[platform]?.products
        ?.map((e) => {
          const tenantProduct = tenantData.products.find((pr) => pr?.slug == e);
          const resProduct = platformWiseData?.[platform]?.products?.find((prod) => prod?.slug == e);
          if (!resProduct) return null;
          return {
            ...tenantProduct,
            requiredCredits: resProduct.credits_required,
            price: resProduct.product_price,
            isRecommended: resProduct.is_recommended,
            isAddOn: resProduct.is_add_on,
            activeDuration: listingDetailResponse?.listingExpiryDays || 30,
            id: resProduct.product_id,
            title: tenantUtils.getLocalisedString(resProduct, 'product_title'),
            description: tenantUtils.getLocalisedString(resProduct, 'description'),
          };
        })
        ?.filter(Boolean),
    };
  });
  let totalCredits = 0;
  Object.values(data?.platforms)?.forEach((plat) => {
    if (plat?.products?.length) totalCredits = totalCredits + plat.availableCredits;
  });
  data.currency = totalCredits > 0 ? 'Credits' : tenantConstants.CURRENCY;
  data.headingMsg = 'Listing Posted';
  data.descriptionMsg = `Your listing has been successfully posted`;
  data.listing = listingDetailResponse;
  return data;
};

const listingCardMapper = (listing) => {
  const cat = listing?.listing_category;
  const dyn = listing?.dynamic_data?.dynamic_fields || {};
  const purpose = cat ? { slug: cat.purpose.toLowerCase().replace(/\s+/g, '-'), title: cat.purpose } : null;
  const type = cat ? { title: cat.name, name: cat.name } : null;

  return {
    id: listing?.id,
    ...(purpose && { purpose }),
    type,
    area: { value: dyn?.area, unit: dyn?.area_unit?.label || 2 },
    location: {
      ...listing?.location,
      breadcrumb: listing?.location?.breadcrumbs
        ?.filter((e) => e?.level > 1)
        ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
        ?.join(', '),
    },
    image: (() => {
      const img = listing?.images?.find((item) => item?.main === 1) || listing?.images?.[0];
      return img?.sizes?.thumbnail || img?.sizes?.medium || null;
    })(),
    price: { value: listing?.price, currency: tenantConstants.CURRENCY },
    details: {
      listingSpecs: tenantData?.getListingSpecs({ ...listing, beds: dyn?.beds, baths: dyn?.baths }),
      listing_type: type,
      regaId: listing?.ad_license,
    },
    ...(listing?.health && { health: listing?.health }),
    disposition: listing?.platform_listings?.[0]?.disposition?.slug,
    permit_number: listing?.permit_number,
  };
};

export const amenitiesDataMapper = (payload) => {
  const fieldType = { number: 'input', text: 'input', checkbox: 'checkbox', select: 'select' };

  const sortIndex = { number: 3, text: 2, checkbox: 4, select: 1 };
  const amenitiesData = {};
  payload &&
    payload.forEach((amenityItem, index) => {
      if (amenityItem.groups.length) {
        Object.defineProperty(amenitiesData, amenityItem.type_id, { value: { fields: {}, fieldsSections: [] } });
      }
      amenityItem.groups.forEach((e, i) => {
        amenitiesData?.[amenityItem.type_id].fieldsSections.push({
          title: tenantUtils.getLocalisedString(e, 'title'),
          fields: [],
        });
        // to sort
        const features = e.features.sort((first, second) => {
          return sortIndex[first.format] < sortIndex[second.format]
            ? -1
            : sortIndex[first.format] == sortIndex[second.format]
              ? 0
              : 1;
        });
        features.forEach((item) => {
          amenitiesData[amenityItem.type_id].fields[item.id] = {
            type: fieldType[item.format],
            initialValue: '',
            value: '',
            props: {
              options:
                fieldType[item.format] === 'select'
                  ? tenantUtils
                      .getLocalisedString(item, 'options')
                      .split(',')
                      .map((e) => ({ id: e, name: e }))
                  : undefined,
              label: tenantUtils.getLocalisedString(item, 'title'),
              horizontal: true,
              id: item.id,
            },
          };
          amenitiesData[amenityItem.type_id].fieldsSections[i].fields.push(item.id);
        });
      });
    });
  return { data: amenitiesData };
};

/**
 * Converts the "features" field from dynamic_fields API (dynamic_field_options + dynamic_section)
 * into the amenities-style format expected by AddAmenities modal: { fields, fieldsSections }.
 * Uses dynamic_section to form groups (same structure as /api/surge/amenities groups).
 * Single source of truth: no fallback to amenities API.
 * Recognized format_type values: checkbox, select, number (numeric input).
 * @param {Object} featuresDef - The features field from dynamicFieldDefinitions: { apiKeyName, options } where each option has id, label, label_l1, value, slug, dynamic_section
 * @param {{ useSecondaryDisplayOrder?: boolean }} [modalOptions]
 * @returns {{ fields: Object, fieldsSections: Array }}
 */
export const dynamicFieldsToFeaturesModalData = (featuresDef, modalOptions = {}) => {
  const { useSecondaryDisplayOrder = false } = modalOptions;
  const fieldType = { select: 'select', checkbox: 'checkbox', number: 'input' };
  const sortIndex = { select: 1, checkbox: 2, number: 3 };
  const fields = {};
  const fieldsSections = [];

  const options = featuresDef?.options ?? [];
  if (!options.length) return { fields, fieldsSections };

  // Group options by dynamic_section (by section id), preserve section order
  const sectionMap = new Map();
  const sectionOrder = [];
  options.forEach((opt) => {
    const section = opt?.dynamic_section ?? { id: 'default', name: null, name_l1: null, slug: 'default', display_order: 999 };
    const sid = section.id ?? section.slug ?? 'default';
    if (!sectionMap.has(sid)) {
      sectionMap.set(sid, { section, optionIds: [] });
      sectionOrder.push({
        id: sid,
        display_order: getDynamicDisplaySortOrder(section, useSecondaryDisplayOrder, 999),
      });
    }
    sectionMap.get(sid).optionIds.push(opt);
  });

  sectionOrder.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999));

  sectionOrder.forEach(({ id: sid }) => {
    const { section, optionIds } = sectionMap.get(sid) || {};
    if (!section || !optionIds.length) return;

    // Section title from API only (no fallbacks)
    fieldsSections.push({
      title: section.name ?? null,
      title_l1: section.name_l1 ?? null,
      fields: [],
    });
    const sectionIndex = fieldsSections.length - 1;

    // Format from API format_type when present; else derive from value
    const formatForOption = (opt) => {
      if (opt?.format_type === 'checkbox' || opt?.format_type === 'select' || opt?.format_type === 'number') {
        return opt.format_type;
      }
      const v = opt?.value;
      if (v == null || (typeof v === 'string' && !v.trim())) return 'checkbox';
      const trimmed = String(v).trim();
      if (COMMA_SPLIT.test(trimmed)) return 'select';
      return 'checkbox';
    };

    const sortedOptions = [...optionIds].sort((a, b) => {
      const fa = formatForOption(a);
      const fb = formatForOption(b);
      const byFormat = (sortIndex[fa] ?? 2) - (sortIndex[fb] ?? 2);
      if (byFormat !== 0) return byFormat;
      return (
        getDynamicDisplaySortOrder(a, useSecondaryDisplayOrder, 0) -
        getDynamicDisplaySortOrder(b, useSecondaryDisplayOrder, 0)
      );
    });

    sortedOptions.forEach((item) => {
      const format = formatForOption(item);
      const type = fieldType[format] ?? 'checkbox';
      const valueStr = item.value != null ? tenantUtils.getLocalisedString(item, 'value') : null;
      const optionsProp =
        type === 'select' && valueStr && String(valueStr).trim()
          ? String(valueStr)
              .split(COMMA_SPLIT)
              .map((x) => ({ id: x.trim(), name: x.trim() }))
          : undefined;
      const labelFromApi = item.label != null || item.label_l1 != null ? tenantUtils.getLocalisedString(item, 'label') : null;
      fields[item.id] = {
        type,
        initialValue: '',
        value: '',
        props: {
          options: optionsProp,
          label: labelFromApi,
          horizontal: true,
          id: item.id,
          slug: item.slug ?? null,
          ...(format === 'number' && { type: 'number' }),
        },
      };
      fieldsSections[sectionIndex].fields.push(item.id);
    });
  });

  return { fields, fieldsSections };
};

const productsDataMapper = (response) => {
  let productsByPlatform = {};
  const productList = response?.products;

  tenantData.platformList.forEach(({ key, responseKey }) => {
    productsByPlatform[key] = [];
    const platformProducts = productList?.filter((e) => e?.platform?.slug == responseKey);
    platformProducts?.forEach((product) => {
      const { slug } = product;
      const productId = product?.id ?? product?.product_id;
      const productTitle = product?.name ?? product?.product_title;
      const productTitleL1 = product?.name_l1 ?? product?.product_title_l1;

      productsByPlatform[key].push({
        ...product,
        ...tenantData.getListingActions(slug),
        product_id: productId,
        product_title: productTitle,
        product_title_l1: productTitleL1,
      });
    });
  });

  return {
    platformProducts: productsByPlatform,
    products: !!productList?.length ? productList.map((e) => ({
      ...tenantData.getListingActions(e?.slug),
      ...e,
      product_id: e?.id ?? e?.product_id,
      product_title: e?.name ?? e?.product_title,
      product_title_l1: e?.name_l1 ?? e?.product_title_l1,
    })) : [],
  };
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

  data?.availableCredits > 0 ? (data.currency = 'Credits') : (data.currency = t(tenantConstants.CURRENCY));

  platformWiseData?.products.forEach((item) => {
    if (item.is_add_on === false && item.slug !== 'refresh') {
      data.applicableProducts.push({
        ...productsHash[item.slug],
        requiredCredits: item.credits_required,
        price: item.product_price,
        isRecommended: item.is_recommended,
        isAddOn: item.is_add_on,
        activeDuration: listingDetailResponse?.listingExpiryDays || 30,
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
        activeDuration: listingDetailResponse?.listingExpiryDays || 30,
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

export const mapPlatformData = (res, platforms, listingDetailResponse) => {
  const data = {};
  platforms?.forEach((platform) => {
    data[platform?.slug] = dataMapper(res, listingDetailResponse);
  });
  return data;
};

const widgetParser = (listings, platform) => {
  const productsToShow = {
    bayut: [{ slug: 'hot-listing' }, { slug: 'basic-listing' }],
    dubizzle: [{ slug: 'basic-listing-dubizzle' }, { slug: 'feature' }, { slug: 'boost-to-top' }],
  };
  const data = {
    [platform]: {
      title: 'Listings',
      icon_data: {},
      link_data: {
        text: 'View All Listings',
        to: '/listings',
      },
      total_title: 'Active',
      total_title_icon: 'MdCircle',
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
        // {
        //   id: 4,
        //   icon: 'IconRental',
        //   iconProps: { color: tenantTheme['color-for-rent'], hasBackground: true },
        //   title: 'Daily Rentals',
        //   value: '',
        // },
      ],
      products: tenantUtils.generateProductData(productsToShow?.[platform]),
    },
  };

  const currentPlatform = data?.[platform];
  currentPlatform.total_value = listings?.active;
  currentPlatform.purposes[0].value = listings?.sale;
  currentPlatform.purposes[1].value = listings?.rent;
  // currentPlatform.purposes[2].value = listings?.daily_rental;
  currentPlatform.products.forEach((item, i) => {
    currentPlatform.products[i].value = listings?.[item.slug_alt];
  });

  return data?.[platform];
};

const getListingSummaryStats = (response, platform) => {
  return { [platform]: widgetParser(response?.data?.stats?.platforms?.[platform], platform) };
};

const getFirstPlatformListing = (listing) =>
  Array.isArray(listing?.platform_listings) && listing.platform_listings.length > 0
    ? listing.platform_listings[0]
    : null;

const resolveListingPurposeAndType = (listing) => {
  const category = listing?.listing_category;
  const purpose =
    listing?.listing_purpose ||
    (category?.purpose_hash
      ? {
          title: category.purpose_hash.name,
          title_l1: category.purpose_hash.name_l1,
          slug: category.purpose_hash.slug,
        }
      : category?.purpose
        ? {
            title: category.purpose,
            title_l1: category.purpose_l1,
            slug: String(category.purpose).toLowerCase().replace(/\s+/g, '-'),
          }
        : undefined);

  const type =
    listing?.listing_type ||
    (category
      ? {
          title: category.name,
          title_l1: category.name_l1,
          slug: category.slug,
        }
      : undefined);

  return { purpose, type };
};

const buildListingLocationBreadcrumb = (listing) => {
  const loc = listing?.location;
  if (!loc) return undefined;
  const crumbs = loc.breadcrumb || loc.breadcrumbs;
  if (!Array.isArray(crumbs) || !crumbs.length) return undefined;
  return [...crumbs]
    .reverse()
    .filter((e) => e?.level > 1)
    .map((e) => tenantUtils.getLocalisedString(e, 'title') || tenantUtils.getLocalisedString(e, 'name') || e?.name)
    .filter(Boolean)
    .join(', ');
};

const resolveListingDetailImage = (listing) => {
  const fromImages = () => {
    const img = listing?.images?.find((i) => i?.main === 1) || listing?.images?.[0];
    return img?.sizes?.thumbnail || img?.sizes?.medium || null;
  };
  return (
    listing?.cover_image?.sizes?.thumbnail ||
    listing?.cover_image?.sizes?.medium ||
    (typeof listing?.image === 'string' ? listing.image : null) ||
    listing?.image?.thumbnail ||
    listing?.image?.medium ||
    fromImages()
  );
};

const resolveListingPublicUrl = (listing) => {
  const fromRoot = tenantUtils.getLocalisedString(listing, 'url');
  if (fromRoot) return fromRoot;
  const pl = getFirstPlatformListing(listing);
  return pl ? tenantUtils.getLocalisedString(pl, 'url') : undefined;
};

export const listingDetailMapper = (listing, platforms) => {
  if (listing?.project_info?.id) {
    return {
      ...listing,
      id: listing?.id,
      location: {
        ...listing?.location,
        breadcrumbs: listing?.location?.breadcrumbs,
      },
      images: listing?.images || [],
      image: (() => {
        const img = listing?.images?.find((img) => img?.main === 1) || listing?.images?.[0];
        return img?.sizes?.thumbnail || img?.sizes?.medium || null;
      })(),
      total_units: listing?.total_units,
      under_construction: listing?.under_construction,
      project_info: listing?.project_info,
    };
  }

  const dyn = listing?.dynamic_data?.dynamic_fields || {};
  const dynScalar = (field) =>
    field == null
      ? undefined
      : typeof field === 'object'
        ? field.value ?? field.label ?? undefined
        : field;
  const bedsForSpecs = listing?.beds ?? dynScalar(dyn?.beds);
  const bathsForSpecs = listing?.baths ?? dynScalar(dyn?.baths);
  const areaUnitDyn = dyn?.area_unit;
  const areaValue = listing?.area_unit?.value ?? dyn?.area ?? dyn?.area_unit_value;
  const areaUnitName =
    listing?.area_unit?.name ??
    (typeof areaUnitDyn === 'object' && areaUnitDyn != null
      ? tenantUtils.getLocalisedString(areaUnitDyn, 'label') || areaUnitDyn?.value || areaUnitDyn?.label
      : undefined);

  const { purpose: resolvedPurpose, type: resolvedType } = resolveListingPurposeAndType(listing);
  const firstPlatformListing = getFirstPlatformListing(listing);
  const productsInfo =
    listing?.platforms?.ksa?.products_information || firstPlatformListing?.products_information;

  const imageCount =
    (listing?.images?.length || 0) ||
    (listing?.cover_image ? 1 : 0) ||
    (listing?.image && (typeof listing.image === 'object' || typeof listing.image === 'string') ? 1 : 0);

  return {
    id: listing?.id,
    permit_number: listing?.permit_number,
    ...(resolvedPurpose && { purpose: resolvedPurpose }),
    isDailyRental: resolvedPurpose?.slug === 'daily-rental',
    isOffPlan: listing?.is_offplan_listing || null,
    projectStatus: listing?.completion_status === 'ready' ? 'Ready' : 'Off-Plan',
    saleType: listing?.sale_type,
    floorPlan: listing?.unit_variant?.floor_plan?.length > 0 ? true : false,
    completion_status: listing?.completion_status,
    type: resolvedType,
    area: { value: areaValue, unit: areaUnitName },
    location: {
      ...listing?.location,
      breadcrumb: buildListingLocationBreadcrumb(listing),
    },
    image: resolveListingDetailImage(listing),
    imageCount,
    price: { value: listing?.price, currency: tenantConstants.CURRENCY },
    details: {
      ...listing?.rega_details?.property_specs,
      listingSpecs: tenantData?.getListingSpecs({ ...listing, beds: bedsForSpecs, baths: bathsForSpecs }),
      listing_type: resolvedType,
      regaId: listing?.ad_license,
      regaExpiryDate:
        listing?.platforms?.rega_expiry_date ??
        listing?.platforms?.ksa?.rega_expiry_date ??
        firstPlatformListing?.rega_expiry_date,
      permit_number: listing?.permit_number,
    },
    ...(listing?.health && {
      health: listing?.health,
    }),
    showHealth: true,
    productsInfo,
    isBadge: !!productsInfo?.['basic-listing']?.is_applied,
    status: listing?.status?.slug || firstPlatformListing?.status?.slug,
    platforms: platforms,
    url: resolveListingPublicUrl(listing),
  };
};
export default {
  getMyListingsData,
  productsDataMapper,
  mapPlatformData,
  normalizeApplicableProductsResponse,
  listingMapper,
  platformMapper,
  amenitiesDataMapper,
  dynamicFieldsToFeaturesModalData,
  updateListingStats,
  getProductDetailToBeApplied,
  getProductDetails,
  postedToBayut,
  upsellDataMapper,
  getListingSummaryStats,
  listingCardMapper,
  listingDetailMapper,
};
