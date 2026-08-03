import tenantConstants from '@constants';
import isListingPostedOnBayut from '../../../helpers/isListingPostedOnBayut';
import { furnishedRadioFromListing } from '../../../helpers/furnishedPrefill';
import { TENANT_KEY } from '../../../utility/env';
import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';
import { propertyTypes, skipFieldsForField } from './listing-form-data';
import { buildFeaturesRichFromListing, fetchAmenitiesFromListing } from './postListingFeaturesPrefill';

const DEFAULT_COORDS = {
  eg: { latitude: 30.0444, longitude: 31.2357 }, // Cairo, Egypt
  oman: { latitude: 23.588, longitude: 58.3829 }, // Muscat, Oman
};
const getDefaultCoords = () => DEFAULT_COORDS[TENANT_KEY] || DEFAULT_COORDS.oman;

export const getPostListingInitialValues = (listing, user) => {
  const selectedCity = listing?.location?.breadcrumb?.find((e) => e.level == tenantConstants.LOCATION_LEVELS?.city);

  const getSelectedSubType = (typeId) => {
    let propertyType = null;
    Object.keys(propertyTypes).forEach((key) => {
      const foundItem = propertyTypes[key].find((item) => item.id === typeId);
      if (foundItem) propertyType = foundItem;
    });
    return propertyType;
  };

  const bedInitialValue = () => {
    return skipFieldsForField?.['bedrooms'].property_type[listing?.listing_type?.id]?.studio && listing?.beds == -1
      ? null
      : listing?.beds
        ? listing?.beds?.toString()
        : null;
  };

  const amenities = fetchAmenitiesFromListing(listing);

  const locationInfo = selectedCity
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
          level:
            listing?.location?.level ??
            listing?.location?.breadcrumb?.[listing?.location?.breadcrumb?.length - 1]?.level,
        },
      }
    : {
        city: null,
        location: null,
        map: { latitude: getDefaultCoords().latitude, longitude: getDefaultCoords().longitude, type: 'map' },
      };

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
    purpose: listing?.listing_purpose?.id || 1,
    area: listing?.area_unit?.value || '',
    property_type: listing?.listing_type?.id,
    property_title_en: listing?.title,
    property_title_ar: listing?.title_l1,
    generate_title: !!(
      listing?.title_translation_enabled ??
      listing?.dynamic_data?.dynamic_fields?.title_translation_enabled
    ),
    generate_description: !!(
      listing?.description_translation_enabled ??
      listing?.dynamic_data?.dynamic_fields?.description_translation_enabled
    ),
    property_description_en: listing?.description,
    property_description_ar: listing?.description_l1,
    bedrooms: bedInitialValue(),
    bathrooms: listing?.baths ? listing?.baths?.toString() : null,
    furnished: furnishedRadioFromListing(listing),
    residence_type: listing?.residence_type
      ? listing?.residence_type?.id
      : listing?.residenceTypes?.length
        ? listing?.residenceTypes[0]?.id
        : null,
    feature_and_amenities: listing?.listing_features?.length ? amenities : {},
    features: buildFeaturesRichFromListing(listing),
    property_images: listing?.images
      ? [...listing.images]
          .sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0))
          .map((e) => ({
            ...e,
            ...(e?.default && { isMainImage: true }),
            ...imageStateObject(),
          }))
      : [],
    posting_as: listing?.contact_detail || user,
    mobile: listing?.contact_detail?.mobile || user?.mobile || tenantConstants.PHONE_CODE,
    price: listing?.price,
    rental_price: listing?.price,
    rental_frequency: listing?.rent_frequency ? listing?.rent_frequency?.id : null,
    latitude: listing?.latitude || listing?.location?.latitude || getDefaultCoords().latitude,
    longitude: listing?.longitude || listing?.location?.longitude || getDefaultCoords().longitude,
    location: {
      ...listing?.location,
      value: listing?.location?.id,
      level: listing?.location?.level,
    },
    sub_listing_type: getSelectedSubType(listing?.listing_type?.id),
    'location-info': locationInfo,
  };
};
