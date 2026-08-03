const updateProfilePayload = (values) => {
  return {
    user: {
      name: values?.name,
      mobile: values?.mobile,
      address: values?.address,
      country_id: values?.country || 155,
      city_id: values?.location?.city?.location_id,
      user_profile_id:
        !!values?.profile_image && !!values?.profile_image.length
          ? values?.profile_image?.[0]?.uuid || values?.profile_image?.[0]?.id
          : '',
      update_user_listing_details: !!values?.updatePropertyListings,
      ...(!!values?.phone && { phone: values?.phone }),
      ...(!!values?.whatsapp && { whatsapp: values?.whatsapp }),
    },
  };
};



export default { updateProfilePayload };
