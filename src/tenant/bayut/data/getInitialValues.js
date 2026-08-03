import tenantConstants from '@constants';
import { peekOpenDiscountForListingId } from '../utils/openDiscountListingsSession';
import isListingPostedOnBayut from '../../../helpers/isListingPostedOnBayut';
import { furnishedRadioFromListing } from '../../../helpers/furnishedPrefill';
import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';
import {
  getDynamicFieldsPrefill,
  resolveRentalFrequencyInitial,
  resolveResidenceTypeInitial,
  surgeListingPropertyTypeId,
  surgeListingPurposeId,
  surgeListingPurposeName,
} from './listingDynamicFieldsPrefill';
import { skipFieldsForField } from './listing-form-data';
import { listingTypes } from './listingTypes';
import { buildFeaturesRichFromListing, fetchAmenitiesFromListing } from '../../common/data/postListingFeaturesPrefill';

const resolveToggleValue = (value, defaultValue = false) => {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return defaultValue;
};

export const getPostListingInitialValues = (listing, user) => {
  const dfPrefill = getDynamicFieldsPrefill(listing);
  const selectedCity = listing?.location?.breadcrumb?.find((e) => e.level == tenantConstants.LOCATION_LEVELS?.city);
  const bedInitialValue = () => {
    const resolvedBeds =
      listing?.beds != null && listing?.beds !== ''
        ? listing.beds
        : dfPrefill.bedrooms != null
          ? dfPrefill.bedrooms
          : null;
    return skipFieldsForField?.['bedrooms'].property_type[surgeListingPropertyTypeId(listing)]?.studio &&
      resolvedBeds == -1
      ? null
      : resolvedBeds != null && resolvedBeds !== ''
        ? String(resolvedBeds)
        : null;
  };
  const amenities = fetchAmenitiesFromListing(listing);
  // Hydration is driven by whether a discount is applied on the API record (purpose-agnostic —
  // long-term rent flows through this initializer too; only daily-rental/off-plan use their own).
  const hasDiscountFromApi = listing?.discount_applied;
  // When a discount is applied the API returns the discounted value in `price` and the original
  // (REGA-registered) value in `actual_price`. Fall back to `price` for legacy listings that have
  // no separate `actual_price` so the original never renders empty/broken (AC edge #3).
  const originalPriceFromApi =
    listing?.actual_price != null && listing?.actual_price !== '' ? listing.actual_price : listing?.price;

  const locationInfoForForm = selectedCity
    ? {
        city: {
          ...selectedCity,
          name: selectedCity?.title,
          location_id: selectedCity?.id,
        },
        location: {
          ...listing?.location,
          id: listing?.location?.id,
          location_id: listing?.location?.id,
          // Keep API `level` (e.g. district = 3). Do not derive from breadcrumb−1 — that broke level and
          // left Location/District SelectSearch without a matching option label (raw id shown).
        },
      }
    : { map: { latitude: 24.774265, longitude: 46.738586, type: 'map' } };

  const locationEditableFromListing =
    listing?.dynamic_data?.dynamic_fields?.is_location_editable !== undefined
      ? !!listing.dynamic_data.dynamic_fields.is_location_editable
      : listing?.is_location_editable !== undefined
        ? !!listing.is_location_editable
        : true;

  return {
    ...listing,
    is_posted: isListingPostedOnBayut(listing),
    is_location_editable: listing == null ? true : locationEditableFromListing,
    purpose: surgeListingPurposeId(listing),
    purpose_name: surgeListingPurposeName(listing),
    property_type: surgeListingPropertyTypeId(listing),
    listing_type: (!listing?.listing_types?.length && listing?.listing_type) || null,
    listing_types: listing?.listing_types || [],
    property_title_en: listing?.title,
    property_title_ar: listing?.title_l1,
    generate_title: resolveToggleValue(
      listing?.title_translation_enabled ??
        listing?.dynamic_data?.dynamic_fields?.title_translation_enabled,
      true,
    ),
    generate_description: resolveToggleValue(
      listing?.description_translation_enabled ??
        listing?.dynamic_data?.dynamic_fields?.description_translation_enabled,
      true,
    ),
    property_description_en: listing?.description,
    property_description_ar: listing?.description_l1,
    bedrooms: bedInitialValue(),
    bathrooms:
      listing?.baths != null && listing?.baths !== ''
        ? String(listing.baths)
        : dfPrefill.bathrooms != null
          ? String(dfPrefill.bathrooms)
          : null,
    furnished: furnishedRadioFromListing(listing),
    residence_type: resolveResidenceTypeInitial(listing, dfPrefill),
    feature_and_amenities: listing?.listing_features?.length ? amenities : undefined,
    features: {
      ...buildFeaturesRichFromListing(listing),
      ...(dfPrefill.featuresRich || {}),
    },
    property_images: listing?.images
      ? [...listing.images]
          .sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0))
          .map((e) => ({
            ...e,
            ...(e?.default && { isMainImage: true }),
            ...imageStateObject(),
          }))
      : [],
    videos: listing?.videos
      ? listing.videos.map((e) => ({
          ...e,
          url: e?.link,
        }))
      : [],
    posting_as: listing?.contact_detail,
    mobile: user?.mobile || '+966',
    rental_price: listing?.price,
    rental_frequency: resolveRentalFrequencyInitial(listing, dfPrefill),
    national_address: dfPrefill.national_address ?? listing?.national_address,
    sale_type: dfPrefill.sale_type_slug,
    completion_status: listing?.completion_status ?? dfPrefill.completion_status,
    additional_number: listing?.rega_details?.location?.additional_number || null,
    area:
      listing?.area_unit?.value != null && listing?.area_unit?.value !== ''
        ? listing.area_unit.value
        : dfPrefill.area ?? '',
    latitude: listing?.latitude || listing?.location?.latitude || 23.8859, //default lattitude for SA
    longitude: listing?.longitude || listing?.location?.longitude || 45.0792, //default longitude for SA
    location: {
      ...listing?.location,
      value: listing?.location?.id,
      level: listing?.location?.level,
    },
    sub_listing_type: listing?.listing_type,
    'location-info': locationInfoForForm,
    ...(hasDiscountFromApi
      ? {
          property_discount_enabled: hasDiscountFromApi || peekOpenDiscountForListingId(listing?.id),
          discounted_price:
            listing?.price != null && listing?.price !== '' ? String(listing.price) : '',
          discount_percentage:
            listing?.discount_percentage != null && listing?.discount_percentage !== ''
              ? String(listing.discount_percentage)
              : '',
          // Surface the original on both price fields — sale reads `price`, rent reads the locked
          // `rental_price` — while `discounted_price` holds the live discounted value.
          price: originalPriceFromApi,
          rental_price: originalPriceFromApi,
        }
      : {
          price: listing?.price,
        }),
    property_discount_enabled: hasDiscountFromApi || peekOpenDiscountForListingId(listing?.id),
  };
};

export const getRentalInitialValues = (listing, user) => {
  const dfPrefill = getDynamicFieldsPrefill(listing);
  const selectedCity = listing?.location?.breadcrumb?.find((e) => e.level == tenantConstants.LOCATION_LEVELS?.city);

  const purposeId = surgeListingPurposeId(listing);
  const propertyTypeInitialValue = listingTypes()?.find((e) => e.id === purposeId)?.sub_types[0].id;

  const amenities = fetchAmenitiesFromListing(listing);

  return {
    ...listing,
    is_posted: isListingPostedOnBayut(listing),
    property_type: surgeListingPropertyTypeId(listing) ?? propertyTypeInitialValue,
    property_type_label: listing?.listing_type?.title
      ? listing?.listing_type?.title
      : listing?.listing_category?.name
        ? listing.listing_category.name
        : listingTypes()?.find((e) => e.id === purposeId)?.sub_types[0]?.title?.en,
    property_title_en: listing?.title,
    property_title_ar: listing?.title_l1,
    generate_title: resolveToggleValue(
      listing?.title_translation_enabled ??
        listing?.dynamic_data?.dynamic_fields?.title_translation_enabled,
      true,
    ),
    generate_description: resolveToggleValue(
      listing?.description_translation_enabled ??
        listing?.dynamic_data?.dynamic_fields?.description_translation_enabled,
      true,
    ),
    property_description_en: listing?.description,
    property_description_ar: listing?.description_l1,
    bedrooms:
      listing?.beds != null && listing?.beds !== ''
        ? String(listing.beds)
        : dfPrefill.bedrooms ?? null,
    bathrooms:
      listing?.baths != null && listing?.baths !== ''
        ? String(listing.baths)
        : dfPrefill.bathrooms ?? null,
    furnished: furnishedRadioFromListing(listing),
    national_address: dfPrefill.national_address ?? listing?.national_address ?? null,
    sale_type: dfPrefill.sale_type_slug,
    feature_and_amenities: listing?.listing_features?.length ? amenities : undefined,
    features: {
      ...buildFeaturesRichFromListing(listing),
      ...(dfPrefill.featuresRich || {}),
    },
    property_images: listing?.images
      ? [...listing.images]
          .sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0))
          .map((e) => ({
            ...e,
            ...(e?.default && { isMainImage: true }),
            ...imageStateObject(),
          }))
      : [],
    videos: listing?.videos
      ? listing.videos.map((e) => ({
          ...e,
          url: e?.link,
        }))
      : [],
    posting_as: listing?.contact_detail,
    mobile: user?.mobile || tenantConstants.PHONE_CODE,
    price: listing?.price ? listing?.price : '',
    area:
      listing?.area_unit?.value != null && listing?.area_unit?.value !== ''
        ? listing.area_unit.value
        : dfPrefill.area ?? '',
    latitude: listing?.latitude || listing?.location?.latitude || 23.8859, //default lattitude for SA
    longitude: listing?.longitude || listing?.location?.longitude || 45.0792, //default longitude for SA
    location: {
      ...listing?.location,
      value: listing?.location?.id,
      level: listing?.location?.level,
    },
    'location-info': selectedCity
      ? {
          city: {
            ...selectedCity,
            name: selectedCity?.title,
            location_id: selectedCity?.id,
          },
          location: {
            ...listing?.location,
            id: listing?.location?.id,
            location_id: listing?.location?.id,
          },
        }
      : { map: { latitude: 24.774265, longitude: 46.738586, type: 'map' } },
    redirection_link: dfPrefill.redirection_link ?? listing?.redirection_link ?? null,
    rental_frequency: resolveRentalFrequencyInitial(listing, dfPrefill),
    residence_type: resolveResidenceTypeInitial(listing, dfPrefill),
  };
};
export const getOffPlanInitialValues = (listing, user) => {
  const dfPrefill = getDynamicFieldsPrefill(listing);
  const selectedCity = listing?.location?.breadcrumb?.find((e) => e.level == tenantConstants.LOCATION_LEVELS?.city);

  const bedInitialValue = () => {
    const resolvedBeds =
      listing?.beds != null && listing?.beds !== ''
        ? listing.beds
        : dfPrefill.bedrooms != null
          ? dfPrefill.bedrooms
          : null;
    return skipFieldsForField?.['bedrooms'].property_type[surgeListingPropertyTypeId(listing)]?.studio &&
      resolvedBeds == -1
      ? null
      : resolvedBeds != null && resolvedBeds !== ''
        ? String(resolvedBeds)
        : null;
  };

  const amenities = fetchAmenitiesFromListing(listing);
  const offPlanPurposeSlug = listing?.listing_purpose?.slug;
  const isOffPlanSalePurpose = offPlanPurposeSlug === 'sale';
  const hasDiscountFromApi = listing?.discount_applied;
  const isOffPlan = listing?.is_offplan_listing;
  return {
    ...listing,
    is_posted: isListingPostedOnBayut(listing),
    property_type: surgeListingPropertyTypeId(listing),
    purpose: surgeListingPurposeId(listing),
    property_title_en: listing?.title,
    property_title_ar: listing?.title_l1,
    property_description_en: listing?.description,
    property_description_ar: listing?.description_l1,
    generate_title: resolveToggleValue(
      listing?.title_translation_enabled ??
        listing?.dynamic_data?.dynamic_fields?.title_translation_enabled,
      true,
    ),
    generate_description: resolveToggleValue(
      listing?.description_translation_enabled ??
        listing?.dynamic_data?.dynamic_fields?.description_translation_enabled,
      true,
    ),
    bedrooms: bedInitialValue(),
    bathrooms:
      listing?.baths != null && listing?.baths !== ''
        ? String(listing.baths)
        : dfPrefill.bathrooms != null
          ? String(dfPrefill.bathrooms)
          : null,
    furnished: furnishedRadioFromListing(listing),
    feature_and_amenities: listing?.listing_features?.length ? amenities : undefined,
    features: {
      ...buildFeaturesRichFromListing(listing),
      ...(dfPrefill.featuresRich || {}),
    },
    property_images: listing?.images
      ? [...listing.images]
          .sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0))
          .map((e) => ({
            ...e,
            ...(e?.default && { isMainImage: true }),
            ...imageStateObject(),
          }))
      : [],
    posting_as: listing?.contact_detail,
    mobile: user?.mobile || '+966',
    rental_price: listing?.price,
    rental_frequency: resolveRentalFrequencyInitial(listing, dfPrefill),
    sale_type: dfPrefill.sale_type_slug,
    area:
      listing?.area_unit?.value != null && listing?.area_unit?.value !== ''
        ? listing.area_unit.value
        : dfPrefill.area ?? '',
    latitude: listing?.latitude || listing?.location?.latitude || 23.8859, //default lattitude for SA
    longitude: listing?.longitude || listing?.location?.longitude || 45.0792, //default longitude for SA
    location: {
      ...listing?.location,
      value: listing?.location?.id,
      level: listing?.location?.level,
    },
    unit_variant: listing?.unit_variant?.id,
    sub_listing_type: listing?.listing_type,
    additional_number: listing?.rega_details?.location?.additional_number || null,
    completion_status: listing?.completion_status ?? dfPrefill.completion_status,
    'location-info': selectedCity
      ? {
          city: {
            ...selectedCity,
            name: selectedCity?.title,
            location_id: selectedCity?.id,
          },
          location: {
            ...listing?.location,
            id: listing?.location?.id,
            location_id: listing?.location?.id,
          },
        }
      : { map: { latitude: 24.774265, longitude: 46.738586, type: 'map' } },
    ...(isOffPlanSalePurpose && hasDiscountFromApi && !isOffPlan
      ? {
          property_discount_enabled: hasDiscountFromApi || peekOpenDiscountForListingId(listing?.id),
          discounted_price:
            listing?.price != null && listing?.price !== '' ? String(listing.price) : '',
          discount_percentage:
            listing?.discount_percentage != null && listing?.discount_percentage !== ''
              ? String(listing.discount_percentage)
              : '',
          price: listing?.actual_price,
        }
      : {
          price: listing?.price,
        }),
    property_discount_enabled:
      isOffPlanSalePurpose && (hasDiscountFromApi || peekOpenDiscountForListingId(listing?.id)) && !isOffPlan,
  };
};

export const getAdLicenseInitialValues = (user) => {
  return {
    is_location_editable: true,
    purpose: null,
    property_type: null,
    property_sub_type: null,
    property_ownership_document_number: '',
    property_age: null,
    bedrooms: null,
    area_size: '',
    city: null,
    location: null,
    price: '',
    name: user?.name || '',
    mobile: user?.mobile || '',
    'location-info': {
      map: {
        latitude: 24.774265,
        longitude: 46.738586,
        type: 'map'
      }
    },
  };
}
