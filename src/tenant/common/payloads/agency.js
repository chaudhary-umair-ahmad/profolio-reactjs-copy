export const agencySettings = (values, updatingAgencyUser, locale) => {
  return updatingAgencyUser
    ? {
        agency: {
          ...(values?.owner?.name && { owner_name: values?.owner?.name }),
          ...(values?.owner?.designation && { designation: values?.owner?.designation }),
          ...(values?.owner?.message && { message: values?.owner?.message }),
          owner_attributes: {
            id: values?.owner?.ownerId,
            name: values?.owner?.name,
            user_profile_id: !!values?.owner?.profilePhoto?.length ? values?.owner?.profilePhoto[0]?.id : null,
          },
        },
      }
    : {
        agency: {
          ...(locale == 'en' ? { name: values?.buisnessName } : { name_l1: values?.buisnessName }),
          country_id: values?.country,
          city_id: values?.city?.city?.city_id,
          address: values?.address,
          national_short_address: values?.nationalShortAddress,
          mobile: values?.mobile && values?.mobile,
          use_agency_whatsapp: !!values?.agencyWhatsappForAll ? values?.agencyWhatsappForAll : 0,
          agency_logo_id: !!values?.logo?.length ? values?.logo[0]?.uuid || values?.logo[0]?.id : null,
          //update_agency_listing_details: !!values?.updatePropertyListings ? values?.updatePropertyListings : 0,
          update_agency_listing_details: !!values?.updateCompanyListings ? values?.updateCompanyListings : 0,
          ...(!!values?.email && { email: values?.email }),
          ...(!!values?.website && { website: values?.website }),
          ...(!!values?.description && locale == 'en'
            ? { description: values?.description }
            : { description_l1: values?.description }),
          // ...(values?.landline && { phone: values?.landline }),
          // ...(!!values?.whatsapp && { whatsapp: values?.whatsapp }),
        },
      };
};

const updateAgencyStaffUserPayload = (values) => {
  return {
    user: {
      name: values?.name,
      name_l1: values?.nameArabic,
      email: values?.email,
      ...(values?.password && { pass: values?.password }),
      mobile: values?.mobile && values?.mobile,
      whatsapp: values?.whatsapp && values?.whatsapp,
      address: values?.address,
      national_short_address: values?.nationalShortAddress,
      country_id: values?.country || 155,
      city_id: values?.city?.city?.location_id || null,
      user_profile_id:
        !!values?.image && !!values?.image?.length ? values?.image?.[0]?.uuid || values?.image?.[0]?.id : '',
    },
  };
};
export const updateAgencyProfilePayload = (values, updatingAgencyUser, locale) => {
  return updatingAgencyUser
    ? {
        agency: {
          ...(values?.owner?.name && { owner_name: values?.owner?.name }),
          ...(values?.owner?.designation && { designation: values?.owner?.designation }),
          ...(values?.owner?.message && { message: values?.owner?.message }),
          owner_attributes: {
            id: values?.owner?.ownerId,
            name: values?.owner?.name,
            user_profile_id: !!values?.owner?.profilePhoto?.length ? values?.owner?.profilePhoto[0]?.id : null,
          },
        },
      }
    : {
        agency: {
          ...(locale == 'en' ? { name: values?.buisnessName } : { name_l1: values?.buisnessName }),
          country_id: values?.country,
          city_id: values?.city?.city?.city_id,
          address: values?.address,
          national_short_address: values?.nationalShortAddress,
          mobile: values?.mobile && values?.mobile,
          use_agency_whatsapp: !!values?.agencyWhatsappForAll ? values?.agencyWhatsappForAll : 0,
          agency_logo_id: !!values?.logo?.length ? values?.logo[0]?.uuid || values?.logo[0]?.id : null,
          //update_agency_listing_details: !!values?.updatePropertyListings ? values?.updatePropertyListings : 0,
          update_agency_listing_details: !!values?.updateCompanyListings ? values?.updateCompanyListings : 0,
          ...(!!values?.email && { email: values?.email }),
          ...(!!values?.website && { website: values?.website }),
          ...(!!values?.description && locale == 'en'
            ? { description: values?.description }
            : { description_l1: values?.description }),
          // ...(values?.landline && { phone: values?.landline }),
          // ...(!!values?.whatsapp && { whatsapp: values?.whatsapp }),
        },
      };
};
export default { agencySettings, updateAgencyStaffUserPayload, updateAgencyProfilePayload };
