import { imageStateObject } from '../../../helpers/imageHelpers/imageStateObject';
import tenantUtils from '@utils';
import tenantTransformers from '@transformers';
import { listingTypes } from './listingTypes';
import { areaUnitList, currencyList } from './staticLists';

const getlistingvideos = (videos) => {
  return videos?.map((e) => {
    return { ...e, url: e?.link };
  });
};

export const getPostListingInitialValues = (listing, isOwner, loggedInUser, users) => {
  if (listing) {
    const amenities = {};
    if (listing?.listing_features && listing?.listing_features?.length > 0) {
      listing.listing_features?.forEach((e, index) => {
        listing?.listing_features?.[index]?.features?.forEach((it) => {
          amenities[it.feature_id] =
            it?.value == 'YES' || it?.value == 'Yes' || it?.value == 'yes' || it?.value == 'true' ? true : it?.value;
        });
      });
    }

    const locationCity = listing?.location?.breadcrumb.find((e) => e.level == 3);
    return {
      purpose: listing?.listing_purpose?.id,
      property_type: listing?.listing_type?.id,
      ...(listing?.project && { project_selection: true }),
      project: listing?.project,
      location_select: {
        city: { ...locationCity, location_id: locationCity?.id, title: { en: locationCity?.title } },
        location: { ...listing?.location, location_id: listing?.location.id, title: { en: listing?.location.title } },
        plot: listing.plot_no ? { id: listing.plotfinder_id, plot_number: listing.plot_no } : null,
        map: {
          longitude: listing?.longitude,
          latitude: listing?.latitude,
          type: listing.lat_long_source,
        },
      },
      area: {
        unit: (listing?.area_unit && areaUnitList?.find((e) => e.title === listing?.area_unit)?.id) || 5,
        value: listing.area_unit_value,
      },
      price: { unit: currencyList[0].id, value: listing.price },
      monthly_rent: { unit: currencyList[0].id, value: listing?.rental_price },
      installment_available: !!listing.is_installment,
      advance_amount: {
        unit: currencyList[0].id,
        value: listing?.advance_amount || undefined,
      },
      monthly_installment: {
        unit: currencyList[0].id,
        value: listing?.monthly_amount || undefined,
      },
      no_of_installments: listing.remaining_installments || '',
      balloon_payments_enabled: !!(listing?.payment_details?.balloon_payments_count && listing?.payment_details?.balloon_payment_amount),
      num_balloon_payments: listing?.payment_details?.balloon_payments_count || '',
      amount_per_balloon_payment: listing?.payment_details?.balloon_payment_amount || undefined,
      balloting_fee_enabled: !!listing?.payment_details?.balloting_fee,
      balloting_fee: {
        value: listing?.payment_details?.balloting_fee || undefined,
      },
      possession_fee_enabled: !!listing?.payment_details?.possession_fee,
      possession_fee: {
        value: listing?.payment_details?.possession_fee || undefined,
      },
      development_fee_enabled: !!listing?.payment_details?.development_charges,
      development_fee: {
        value: listing?.payment_details?.development_charges || undefined
      },
      ready_for_possession: listing.possession_available,
      bedrooms: listing.beds + '',
      bathrooms: listing.baths + '',
      property_title: listing.title,
      property_description: listing.description,
      feature_and_amenities: listing?.listing_features.length ? amenities : undefined,
      property_images: listing?.images
        ? [...listing.images]
            .sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0))
            .map((e) => ({
              ...e,
              ...(e.default && { isMainImage: true }),
              ...imageStateObject(),
            }))
        : [],
      // documents: listing?.documents ? listing?.documents.map(e => ({ ...e, ...imageStateObject() })) : [],
      videos: listing?.videos ? getlistingvideos(listing.videos) : [],
      posting_as: users && users.find((e) => e.id == listing?.user_id),
      email: listing?.contact_detail?.email ? listing?.contact_detail?.email : listing?.user?.email,
      landline: listing?.contact_detail?.phone
        ? tenantUtils.formatMobile(listing?.contact_detail?.phone, 'singleNumber')
        : listing?.user?.phone
          ? tenantUtils.formatMobile(listing?.user?.phone, 'singleNumber')
          : '',
      mobile: listing?.contact_detail?.contact_numbers
        ? tenantUtils.formatMobile(listing?.contact_detail?.contact_numbers?.join(','), 'singleNumber').split(',')
        : listing?.user?.mobile
          ? tenantUtils.formatMobile(listing?.user?.mobile, 'singleNumber').split(',')
          : [''],
      platform_selection: {
        zameen: { cheked: !!tenantTransformers.postedToZameen(listing?.platfrom?.zameen?.status), disable: true },
        olx: { cheked: !!tenantTransformers.postedToOLX(listing?.platfrom?.olx?.status), disable: true },
      },
    };
  }
  return {
    purpose: 1,
    property_type: listingTypes()[0].sub_types[0].id,
    location_select: {},
    area: {
      unit:
        areaUnitList.find(
          (e) =>
            e.slug == loggedInUser?.settings?.find((it) => it?.name == 'area_unit')?.value ||
            e.title_short == loggedInUser?.settings?.find((it) => it?.name == 'area_unit')?.value,
        )?.id || 5,
    },
    price: { unit: currencyList[0].id },
    installment_available: false,
    advance_amount: { unit: currencyList[0].id },
    monthly_installment: { unit: currencyList[0].id },
    monthly_rent: { unit: currencyList[0].id },
    no_of_installments: '',
    // Balloon payment fields
    balloon_payments_enabled: false,
    num_balloon_payments: '',
    amount_per_balloon_payment: undefined,
    balloting_fee_enabled: false,
    balloting_fee: { value: undefined },
    possession_fee_enabled: false,
    possession_fee: { value: undefined },
    development_fee_enabled: false,
    development_fee: { value: undefined },
    ready_for_possession: false,
    property_title: '',
    property_description: '',
    property_images: [],
    videos: [],
    posting_as: loggedInUser,
    email: loggedInUser?.email || '',
    mobile: loggedInUser.mobile ? tenantUtils.formatMobile(loggedInUser?.mobile, 'singleNumber').split(',') : [''],
    landline: loggedInUser?.phone ? tenantUtils.formatMobile(loggedInUser?.phone, 'singleNumber') : '',
    platform_selection: { zameen: { checked: true, disable: false }, olx: { checked: false, disable: false } },
  };
};
