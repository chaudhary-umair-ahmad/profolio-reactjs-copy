import tenantData from '@data';
import tenantConstants from '@constants';

const findFeatureById = (arr, featureId) => {
  for (const group of arr) {
    const feature = group.features.find((feature) => feature.feature_id == featureId);
    if (feature) {
      return feature?.id;
    }
  }
  return null;
};

const getListingFeatures = (featuresAmenities, listingFeatures) =>
  featuresAmenities && Object.keys(featuresAmenities)?.length
    ? Object.keys(featuresAmenities)
        .map((e) =>
          !!findFeatureById(listingFeatures, e)
            ? {
                id: findFeatureById(listingFeatures, e),
                feature_id: e,
                ...(featuresAmenities?.[e] == undefined || featuresAmenities?.[e] == false
                  ? { _destroy: true }
                  : { feature_value: featuresAmenities?.[e] === true ? 'Yes' : featuresAmenities?.[e] }),
              }
            : featuresAmenities?.[e]
              ? { feature_id: e, feature_value: featuresAmenities?.[e] === true ? 'Yes' : featuresAmenities?.[e] }
              : null,
        )
        .filter((e) => !!e)
    : [];

const getUpdateListingPayload = (user, listingId, values, listing) => {
  const locObj = values.location_select;
  const lat_long_source = locObj.map.type;
  const images = values.property_images?.length
    ? values.property_images
        .filter((e) => e.id && e.uploaded)
        .map((image) => {
          const { id, uuid, isMainImage, _destroy, order } = image;
          return {
            name: uuid,
            is_main_image: !!isMainImage,
            order: order,
            ...(id &&
              typeof id === 'number' &&
              (image?.listing_id ? image?.listing_id === listingId && { id } : { id })),
            _destroy,
          };
        })
    : [];

  const mainImageIndex = images.findIndex((e) => !!e.is_main_image && !e._destroy);
  let orderedImages = [];
  if (mainImageIndex != -1) {
    const mainImage = images.splice(mainImageIndex, 1);
    images.unshift(mainImage?.[0]);
  } else {
    let index = images.findIndex((e) => !e._destroy);
    images[index] = { ...images[index], is_main_image: true };
  }

  orderedImages = images?.length ? images.map((e, index) => ({ ...e, order: index })) : [];

  const payload = {
    listing: {
      purpose_id: values.purpose,
      type_id: values.property_type,
      latitude: locObj.map.latitude,
      longitude: locObj.map.longitude,
      location_id: locObj?.location.location_id,
      ...(locObj.plot && { plot_no: locObj.plot.plot_number }),
      ...(locObj.plot?.id && { plotfinder_id: locObj.plot.id }),
      ...(lat_long_source && { lat_long_source }),
      title: values.property_title,
      description: values.property_description,
      possession_available: values.ready_for_possession,
      is_installment: values.installment_available,
      ...(values.installment_available && {
        advance_amount: values?.advance_amount?.value,
        remaining_installments: values?.no_of_installments,
        monthly_amount: values?.monthly_installment?.value,
      }),
      payment_detail_attributes: {
        balloon_payments_count: values.installment_available && values.balloon_payments_enabled ? values.num_balloon_payments : null,
        balloon_payment_amount: values.installment_available && values.balloon_payments_enabled ? values.amount_per_balloon_payment : null,
        balloting_fee: values.installment_available && values.balloting_fee_enabled ? values.balloting_fee?.value : null,
        possession_fee: values.installment_available && values.possession_fee_enabled ? values.possession_fee?.value : null,
        development_charges: values.installment_available && values.development_fee_enabled ? values.development_fee?.value : null,
      },
      ...(values?.project?.id && { dev_id: values.project.id }),
      posted_on_zameen: values?.platform_selection?.zameen?.checked || false,
      posted_on_olx: values?.platform_selection?.olx?.checked || false,
      area_unit_value: values.area.value,
      area_unit_id: values.area.unit,
      land: (
        values.area.value *
        tenantData.areaMapings[tenantData?.areaUnitList.find((e) => e.id === values?.area?.unit)?.slug]?.['square_feet']
      ).toFixed(0),
      source: tenantConstants.APP_SOURCE,
      ...(values.bedrooms && { beds: values.bedrooms }),
      ...(values.bathrooms && { bath: values.bathrooms }),
      listing_features_attributes: values?.id
        ? getListingFeatures(values?.feature_and_amenities, listing?.listing_features)
        : Object.keys(values?.feature_and_amenities || {}).map((e) => ({
            feature_id: e,
            id: findFeatureById(listing?.listing_features, e),
            feature_value:
              values.feature_and_amenities[e] !== undefined &&
              (values.feature_and_amenities[e] === true ? 'Yes' : values.feature_and_amenities[e]?.toString()),
            ...((values.feature_and_amenities[e] == undefined || values.feature_and_amenities[e] == false) && {
              _destroy: true,
            }),
          })),
      price: values?.purpose == 1 ? values?.price?.value : values?.monthly_rent?.value,
      contact_person: user?.name,
      mail: values.email,
      mobile: values?.mobile && values?.mobile,
      phone: values?.landline && values?.landline,
      ...(!!values?.monthly_rent?.value && { rental_price: values?.monthly_rent.value }),
      listing_images_attributes: images,
      listing_videos_attributes: values?.videos?.length
        ? values?.videos
            .filter((e) => e.id || (!e.id && !e._destroy))
            .map((e) => ({
              ...(e.id && { id: e.id }),
              video_host: 'youtube',
              video_title: '',
              video_link: e?.url,
              ...(e._destroy && { _destroy: e._destroy }),
            }))
        : [],
    },
    subject_id: user?.id,
  };

  return payload;
};

const getPostNewListingPayload = (user, values) => {
  const locObj = values.location_select;
  const lat_long_source = locObj.map.type;

  const images = values.property_images?.length
    ? values.property_images
        .filter((e) => e.uuid && e.uploaded)
        .map(({ id, uuid, isMainImage }) => ({ uuid: uuid, name: uuid, is_main_image: !!isMainImage }))
    : [];

  const mainImageIndex = images.findIndex((e) => !!e.is_main_image && !e._destroy);
  let orderedImages = [];
  if (mainImageIndex != -1) {
    const mainImage = images.splice(mainImageIndex, 1);
    images.unshift(mainImage?.[0]);
  } else {
    let index = images.findIndex((e) => !e._destroy);
    images[index] = { ...images[index], is_main_image: true };
  }
  orderedImages = images?.length ? images.map((e, index) => ({ ...e, order: index })) : [];

  const payload = {
    subject_id: user?.id,
    listing: {
      purpose_id: values.purpose,
      type_id: values.property_type,
      ...(values.project_selection && { dev_id: values.project.id }),
      latitude: locObj.map.latitude,
      longitude: locObj.map.longitude,
      location_id: locObj?.location.location_id,
      ...(locObj.plot && { plot_no: locObj.plot.plot_number }),
      ...(locObj.plot?.id && { plotfinder_id: locObj.plot.id }),
      ...(lat_long_source && { lat_long_source }),
      title: values.property_title,
      description: values.property_description,
      possession_available: values.ready_for_possession,
      posted_on_zameen: !!values?.platform_selection?.zameen?.checked ? 1 : 0,
      posted_on_olx: !!values?.platform_selection?.olx?.checked ? 1 : 0,
      is_installment: values.installment_available,
      ...(values.installment_available && {
        advance_amount: values.advance_amount.value,
        remaining_installments: values.no_of_installments,
        monthly_amount: values.monthly_installment.value,
      }),
      payment_detail_attributes: {
        balloon_payments_count: values.installment_available && values.balloon_payments_enabled ? values.num_balloon_payments : null,
        balloon_payment_amount: values.installment_available && values.balloon_payments_enabled ? values.amount_per_balloon_payment : null,
        balloting_fee: values.installment_available && values.balloting_fee_enabled ? values.balloting_fee?.value : null,
        possession_fee: values.installment_available && values.possession_fee_enabled ? values.possession_fee?.value : null,
        development_charges: values.installment_available && values.development_fee_enabled ? values.development_fee?.value : null,
      },
      listing_features_attributes: Object.keys(values?.feature_and_amenities || {})
        .filter((e) => !!values.feature_and_amenities[e])
        .map((e) => ({
          feature_id: e,
          feature_value: values.feature_and_amenities[e] === true ? 'Yes' : values.feature_and_amenities[e]?.toString(),
        })),
      ...(values.bedrooms && { beds: values.bedrooms }),
      ...(values.bathrooms && { bath: values.bathrooms }),
      price: values?.purpose == 1 ? values?.price?.value : values?.monthly_rent?.value,
      ...(!!values.monthly_rent.value && { rental_price: values.monthly_rent.value }),
      ...(!!values.monthly_rent.value && { rental_prices: { rental_price: values.monthly_rent.value } }),
      area_unit_value: values?.area?.value,
      land: (
        values.area.value *
        tenantData.areaMapings[tenantData?.areaUnitList.find((e) => e.id === values?.area?.unit)?.slug]?.['square_feet']
      ).toFixed(0),
      area_unit_id: values?.area?.unit,
      contact_person: user?.name,
      mail: values.email,
      mobile: values?.mobile && values?.mobile,
      phone: values?.landline,
      listing_images_attributes: orderedImages,
      listing_videos_attributes: values?.videos?.length
        ? values?.videos
            .filter((e) => e.id || (!e.id && !e._destroy))
            .map((e) => ({
              ...(e.id && { id: e.id }),
              video_host: 'youtube',
              video_title: '',
              video_link: e?.url,
              ...(e._destroy && { _destroy: e._destroy }),
            }))
        : [],
      source: tenantConstants.APP_SOURCE,
    },
  };
  return payload;
};

export default { getUpdateListingPayload, getPostNewListingPayload };
