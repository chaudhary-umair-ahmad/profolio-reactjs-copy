import tenantConstants from '@constants';
const updateProfilePayload = (values) => {
  return {
    user: {
      name: values?.name,
      name_l1: values?.nameArabic,
      mobile: values?.mobile,
      national_short_address: values?.nationalShortAddress,
      address: values?.address,
      description: values?.agentDescription,
      description_l1: values?.agentDescriptionArabic,
      country_id: values?.country || 155,
      city_id: values?.location?.city?.location_id || null,
      user_profile_id:
        !!values?.profile_image && !!values?.profile_image.length
          ? values?.profile_image?.[0]?.uuid || values?.profile_image?.[0]?.id
          : '',
      update_user_listing_details: !!values?.updatePropertyListings,
      whatsapp: values?.whatsapp,
      ...(tenantConstants.SERVICE_AREAS_ENABLED && {
        service_areas: values?.serviceArea,
        languages: values?.languages,
        experience: values?.experience,
      }),
      ...(values?.gender && { gender: values?.gender }),
    },
  };
};
const autoGenerateUserDescriptionPayload = ({ values }) => {
  return {
    agency_name: values?.agency?.name,
  };
};

export default { updateProfilePayload, autoGenerateUserDescriptionPayload };
