import { getCnicUuidFromImage } from '../../../helpers/imageHelpers/imageStateObject';

const updateAgencyStaffUserPayload = (values) => {
  const front = values?.cnic_front?.[0];
  const back = values?.cnic_back?.[0];
  return {
    user: {
      name: values?.name,
      email: values?.email,
      ...(values?.password && { pass: values?.password }),
      mobile: values?.mobile && values?.mobile,
      phone: values?.landline && values?.landline,
      address: values?.address,
      country_id: values?.country || 155,
      city_id: values?.city,
      user_profile_id:
        !!values?.image && !!values?.image?.length ? values?.image?.[0]?.uuid || values?.image?.[0]?.id : '',
      cnic: values?.cnic,
      user_cnic_front_id: getCnicUuidFromImage(front),
      user_cnic_back_id: getCnicUuidFromImage(back),
    },
  };
};

const transferQuotaCreditsPayload = (creditProducts) => {
  return {
    products: creditProducts?.map((e) => {
      return {
        from_user_id: e?.from_user_id,
        to_user_id: e?.to_user_id,
        platform_id: e?.platform === 'zameen' ? 1 : 2,
        product_id: e?.product_id,
        quantity: e?.quantity,
      };
    }),
  };
};

export const updateAgencyProfilePayload = (values) => {
  return {
    agency: {
      ...(values?.name && { owner_name: values?.name }),
      ...(values?.designation && { designation: values?.designation }),
      ...(values?.message && { message: values?.message }),
      owner_attributes: {
        id: values?.ownerId,
        name: values?.name,
        user_profile_id: !!values?.profilePhoto?.length
          ? values?.profilePhoto[0]?.uuid || values?.profilePhoto[0]?.id
          : null,
      },
      name: values?.companyTitle,
      country_id: values?.country,
      city_id: values?.city?.city?.location_id,
      address: values?.address,
      mobile: values?.mobile && values?.mobile,
      use_agency_whatsapp: !!values?.agencyWhatsappForAll ? values?.agencyWhatsappForAll : 0,
      agency_logo_id: !!values?.logo?.length ? values?.logo[0]?.uuid || values?.logo[0]?.id : null,
      update_agency_listing_details: !!values?.updatePropertyListings ? values?.updatePropertyListings : 0,
      ...(!!values?.email && { email: values?.email }),
      ...(!!values?.website && { website: values?.website }),
      ...(!!values?.description && { description: values?.description }),
      ...(values?.landline && { phone: values?.landline }),
      ...(!!values?.whatsapp && { whatsapp: values?.whatsapp }),
    },
  };
};

export default { updateAgencyStaffUserPayload, transferQuotaCreditsPayload, updateAgencyProfilePayload };
