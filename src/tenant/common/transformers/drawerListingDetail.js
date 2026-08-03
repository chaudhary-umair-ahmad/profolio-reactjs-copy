import tenantConstants from '@constants';
import tenantTransformers from '@transformers';
import { hasFurnishedOnListing, isListingFurnishedYes } from '../../../helpers/furnishedPrefill';

const toNumber = (value) => {
  if (value === undefined || value === null) {
    return value;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
};

const getBreadcrumbs = (location) => {
  if (!location) {
    return [];
  }
  if (Array.isArray(location?.breadcrumbs) && location?.breadcrumbs.length) {
    return location.breadcrumbs;
  }
  if (Array.isArray(location?.breadcrumb) && location?.breadcrumb.length) {
    return location.breadcrumb;
  }
  return [];
};

const normalizeLocation = (location) => {
  if (!location) {
    return location;
  }
  const breadcrumbs = getBreadcrumbs(location);
  return {
    ...location,
    breadcrumbs,
    breadcrumb: breadcrumbs.length ? [...breadcrumbs].reverse() : [],
  };
};

const buildListingFeatures = (dynamicFields) => {
  const features = dynamicFields?.features || [];
  const groupedSections = {};
  features.forEach((feature) => {
    const section = feature?.dynamic_section;
    const sectionKey = section ? (section?.id ?? section?.slug ?? 'default') : 'default';
    if (!groupedSections[sectionKey]) {
      groupedSections[sectionKey] = {
        group_id: section?.id,
        title: section?.name ?? 'Default',
        title_l1: section?.name_l1,
        features: [],
      };
    }
    const featureId = feature?.id ?? feature?.slug;
    if (featureId != null) {
      groupedSections[sectionKey].features.push({
        id: feature?.id,
        feature_id: featureId,
        title: feature?.label,
        title_l1: feature?.label_l1,
        format:
          feature?.format_type != null
            ? String(feature.format_type).trim().toLowerCase()
            : 'checkbox',
        slug: feature?.slug,
        value: feature?.value ?? 'Yes',
      });
    }
  });
  return Object.values(groupedSections);
};

/** Root listing_categories id from API (breadcrumbs root or this row when it is already a top-level purpose). */
const resolvePurposeCategoryIdFromListingCategory = (listingCategory = {}) => {
  const crumbs = listingCategory?.breadcrumbs;
  if (Array.isArray(crumbs) && crumbs.length > 0) {
    const sorted = [...crumbs].sort((a, b) => (a.level ?? 999) - (b.level ?? 999));
    const root = sorted[0];
    if (root?.id != null) return root.id;
  }
  if (listingCategory?.parent_id == null && listingCategory?.id != null) {
    return listingCategory.id;
  }
  return null;
};

const normalizeListingCategory = (listingCategory = {}) => {
  const purpose = listingCategory?.purpose;
  const purposeSlug = purpose?.toLowerCase().replace(/\s+/g, '-') || null;
  const purposeCategoryId = resolvePurposeCategoryIdFromListingCategory(listingCategory);

  return {
    listing_type: listingCategory?.name
      ? {
          title: listingCategory.name,
          title_l1: listingCategory.name_l1,
          slug: listingCategory.slug,
          id: listingCategory.id,
        }
      : null,
    listing_purpose: purpose
      ? {
          id: purposeCategoryId,
          title: purpose,
          title_l1: listingCategory.purpose_l1,
          slug: purposeSlug,
        }
      : null,
  };
};

const normalizeResidenceType = (dynamicFields, existingResidence, responseResidenceTypes) => {
  const residence = dynamicFields?.residence_type;
  if (!residence) {
    return existingResidence;
  }
  const types = responseResidenceTypes || [];
  const bySlug =
    residence?.slug != null ? types.find((r) => r?.slug === residence.slug) : null;
  const byId =
    residence?.id != null ? types.find((r) => String(r?.id) === String(residence.id)) : null;
  const match = bySlug || byId;
  const name = residence?.label ?? residence?.name ?? match?.name;
  const value = residence?.value ?? match?.value ?? match?.name ?? name;
  return {
    id: match?.id ?? residence?.id,
    slug: residence?.slug ?? match?.slug,
    value,
    label: residence?.label ?? residence?.name ?? match?.name,
    name,
    name_l1: residence?.label_l1 ?? match?.name_l1,
  };
};

const getListingPrice = (listing, currency) => {
  const priceValue = listing?.price ?? listing?.listingPrice?.value;
  return {
    value: priceValue,
    currency,
  };
};

const formatListingFeatures = (listing, dynamicFields) => {
  const dynamicFeatures = buildListingFeatures(dynamicFields);
  if (dynamicFeatures?.length) {
    return dynamicFeatures;
  }
  if (listing?.listing_features?.length) {
    return listing.listing_features;
  }
  return [];
};

/**
 * Build OLD shape platforms (e.g. platforms.ksa) and rega_details from NEW API
 * (listing.platform_listings and platform_listings[].rega_info.rega_details).
 */
const buildPlatformsAndRegaFromPlatformListings = (listing) => {
  const platformListings = listing?.platform_listings || [];
  if (!platformListings.length) return { platforms: null, rega_details: null };

  const platforms = {};
  let rega_details = null;

  platformListings.forEach((pl) => {
    const platformSlug = pl?.platform?.slug;
    const platformTitle = pl?.platform?.title;
    const regaInfo = pl?.rega_info;
    const regaDetails = regaInfo?.rega_details;

    const productsArray = pl?.products_information || [];
    const products_information = productsArray.reduce((acc, p) => {
      if (p?.slug != null) {
        acc[p.slug] = {
          ...p,
          till_date: p.end_date ?? p.till_date,
        };
      }
      return acc;
    }, {});

    const licenseInfo = regaDetails?.license_info;
    const rega_expiry_date = licenseInfo?.end_date ?? pl?.expiry_date ?? null;

    const platformPayload = {
      status: pl?.status,
      disposition: pl?.disposition,
      created_at: pl?.created_at,
      expires_at: pl?.expiry_date ?? pl?.expires_at,
      posted_at: pl?.posted_at,
      is_posted: pl?.disposition?.slug === 'live' || pl?.status?.slug === 'active',
      url: pl?.url,
      url_l1: pl?.url_l1,
      products_information,
      rega_expiry_date,
      health: pl?.health,
    };

    if (platformSlug === 'bayut' || platformTitle === 'KSA') {
      platforms.ksa = platformPayload;
    }
    if (platformSlug) {
      platforms[platformSlug] = platformPayload;
    }

    if (regaDetails && !rega_details) {
      rega_details = regaDetails;
    }
  });

  if (platforms.ksa?.rega_expiry_date) {
    platforms.rega_expiry_date = platforms.ksa.rega_expiry_date;
  }

  return { platforms: Object.keys(platforms).length ? platforms : null, rega_details };
};

const resolveContactDetailFromListing = (listing) => listing?.posted_by ?? null;

export const formatListingDetailResponse = (response, options = {}) => {
  const listing = response?.listing;
  if (!listing) {
    return { listing };
  }
  const dynamicFields = listing?.dynamic_data?.dynamic_fields || {};
  const location = normalizeLocation(listing?.location);
  const listingCategory = listing?.listing_category || response?.listing_category || {};
  const { listing_type: normalizedType, listing_purpose: normalizedPurpose } =
    normalizeListingCategory(listingCategory);
  const normalizeImageSizes = (images = []) =>
    images?.map((image) => ({
      ...image,
      full: image?.full || image?.sizes?.full,
      large: image?.large || image?.sizes?.large,
      medium: image?.medium || image?.sizes?.medium,
      small: image?.small || image?.sizes?.small,
      thumbnail: image?.thumbnail || image?.sizes?.thumbnail,
    }));

  const normalizedImages = (normalizeImageSizes(listing?.images) || []).map((img) => ({
    ...img,
    default: img?.main === 1 || img?.main === true || img?.default,
  }));

  const au = dynamicFields?.area_unit;
  const areaUnit =
    au != null || dynamicFields?.area_unit_value != null
      ? {
          value: dynamicFields.area_unit_value,
          id: au?.id,
          slug: au?.slug,
          label: au?.label,
          label_l1: au?.label_l1,
          name: au?.label ?? au?.value,
          name_l1: au?.label_l1 ?? au?.value_l1,
        }
      : listing?.area_unit;

  // Prefer dynamic_fields.rent_frequency (option id) so form dropdown matches; fallback to rent_frequencies by slug
  const rentFrequencyFromDynamic = dynamicFields?.rent_frequency
    ? {
        id: dynamicFields.rent_frequency.id,
        name: dynamicFields.rent_frequency.label ?? dynamicFields.rent_frequency.value,
        slug: dynamicFields.rent_frequency.slug,
      }
    : null;
  const rentFrequencyBySlug =
    response?.rent_frequencies?.find((r) => r?.slug === dynamicFields?.rent_frequency?.slug) || null;
  const rent_frequency =
    rentFrequencyFromDynamic ||
    (rentFrequencyBySlug
      ? { id: rentFrequencyBySlug.id, name: rentFrequencyBySlug.name, slug: rentFrequencyBySlug.slug }
      : listing?.rent_frequency);

  const { platforms: builtPlatforms, rega_details: builtRegaDetails } =
    buildPlatformsAndRegaFromPlatformListings(listing);

  /** Prefer `dynamic_data.dynamic_fields.is_location_editable` from `/api/surge/listings/:id/edit`; fall back to the root key for older payloads. */
  const locationEditableFromApi =
    dynamicFields?.is_location_editable !== undefined
      ? !!dynamicFields.is_location_editable
      : listing?.is_location_editable !== undefined
        ? !!listing.is_location_editable
        : true;

  let normalizedListing = {
    ...listing,
    /** Per-listing flag from listing edit API; dynamic field `is_editable` does not control location. */
    is_location_editable: locationEditableFromApi,
    contact_detail: resolveContactDetailFromListing(listing),
    location,
    beds: toNumber(dynamicFields?.beds?.value ?? dynamicFields?.beds?.label ?? dynamicFields?.beds ?? listing?.beds),
    baths: toNumber(dynamicFields?.baths?.value ?? dynamicFields?.baths?.label ?? dynamicFields?.baths ?? listing?.baths),
    residence_type: normalizeResidenceType(dynamicFields, listing?.residence_type, response?.residence_types),
    listing_type: normalizedType || listing?.listing_type,
    listing_purpose: normalizedPurpose || listing?.listing_purpose,
    is_furnished: hasFurnishedOnListing(listing)
      ? isListingFurnishedYes(listing)
      : (dynamicFields?.is_furnished ?? listing?.is_furnished),
    area_unit: areaUnit,
    rent_frequency,
    listingPrice: getListingPrice(listing, options.currency || tenantConstants.CURRENCY),
    listing_features: formatListingFeatures(listing, dynamicFields),
    images: normalizedImages,
    platform: {
      ...listing?.platform,
      ksa: tenantTransformers.postedToBayut(listing?.status?.name),
    },
    ...(builtPlatforms && { platforms: { ...listing?.platforms, ...builtPlatforms } }),
    ...(builtRegaDetails && { rega_details: builtRegaDetails }),
  };
  const listingCategoriesFromResponse = response?.listing_categories ?? listing?.listing_categories;
  if (listingCategoriesFromResponse !== undefined) {
    normalizedListing = { ...normalizedListing, listing_categories: listingCategoriesFromResponse };
  }
  if (response?.residence_types) {
    normalizedListing = { ...normalizedListing, residenceTypes: response?.residence_types };
  }
  if (response?.sale_types?.length) {
    normalizedListing = { ...normalizedListing, saleTypes: response.sale_types };
  }
  if (options.afterNormalize) {
    normalizedListing = options.afterNormalize(normalizedListing);
  }
  const result = { listing: normalizedListing };
  if (options.includeListingTypes) {
    result.listing_types = options.listingTypes ?? response?.listing_types;
  }
  if (options.includeSaleTypes) {
    const saleTypes = options.saleTypes ?? response?.sale_types;
    if (saleTypes?.length) {
      const mapper = options.saleTypesMapper || ((type) => type);
      result.saleTypes = saleTypes.map(mapper);
    }
  }
  return result;
};

