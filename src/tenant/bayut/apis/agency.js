import tenantPayloads from '@payloads';
import tenantTransformers from '@transformers';

const convertToAgencyPayload = (values, userId) => {
  return {
    user: {
      agency_attributes: {
        name: values?.name,
        name_l1: values?.nameArabic,
        email: values?.email,
        mobile: values?.mobile,
        landline: values?.landline,
        entity_type: values?.typeOfAgency,
        address: values?.address,
        city_id: values?.city?.city?.location_id,
        agency_logo_id: values?.agency_logo?.[0]?.uuid,
        website: values?.website,
        description: values?.description,
        description_l1: values?.descriptionArabic,
        creator_id: userId,
      },
    },
  };
};

const agencyApiEndpoints = {
  getAgencyProfileDetails: {
    query: (agencyId) => ({
      url: `/api/surge/agencies/${agencyId}`,
    }),
    transformer: (response) => {
      const mappedResponse = tenantTransformers.mapSurgeAgencyResponse(response);
      return tenantTransformers.agencyDataMapper(mappedResponse?.agency);
    },
  },

  //needs refactoring
  updateAgencyProfile: {
    query: (data) => ({
      url: `/api/surge/agencies/${data?.agencyId}`,
      method: 'PUT',
      body: tenantPayloads.updateAgencyProfilePayload(data?.body, false, data?.locale),
    }),
    transformer: (response) => tenantTransformers.agencyDataMapper(response?.agency),
  },

  updateAgencySettings: {
    query: (data) => ({
      url: `/api/surge/agencies/${data?.agencyId}`,
      method: 'PUT',
      body: tenantPayloads.agencySettings(data?.values, data?.updatingAgencyOwner, data?.locale),
    }),
    transformer: (response) => {
      return {
        user: {
          ...response.data?.agency,
          agentid: response.data?.id,
          agent_type: response.data?.agency_type,
          agent_status: response.data?.agency_status,
          company_name: response.data?.name,
          agent_country: response.data?.country_id,
          company_phone: response.data?.phone,
          company_cell: response.data?.mobile,
          company_email: response.data?.email,
          company_website: response.data?.website,
          agent_logo: response.data?.agency_logo,
          time_added: response.data?.created_at,
          owner_title: response.data?.designation,
          company_whatsapp: response.data?.whatsapp,
        },
      };
    },
  },

  getAgencyStaffList: {
    query: (agencyId) => {
      const url = `/api/surge/agencies/${agencyId}`;
      return {
        url,
      };
    },
    transformer: (response) => {
      const mappedResponse = tenantTransformers.mapSurgeAgencyResponse(response);
      return tenantTransformers.agencyStaffDataMapper(mappedResponse);
    },
  },

  deleteAgencyUser: {
    query: ({ agencyId, userId }) => ({
      url: `/api/surge/agencies/${agencyId}/remove_staff`,
      method: 'DELETE',
      body: {
        user_id: userId,
      },
    }),
  },

  updateAgencyUser: {
    query: ({ userId, agencyId, values }) => {
      return {
        url: `/api/surge/agencies/${agencyId}/update_staff?user_id=${userId}`,
        method: 'PUT',
        body: {
          user: {
            name: values?.name,
            name_l1: values?.nameArabic,
            email: values?.email,
            ...(values?.password && { pass: values?.password }),
            mobile: values?.mobile && values?.mobile,
            // phone: values?.landline && values?.landline,
            whatsapp: values?.whatsapp && values?.whatsapp,
            address: values?.address,
            national_short_address: values?.nationalShortAddress,
            country_id: values?.country || 155,
            city_id: values?.city?.city?.location_id || null,
            user_profile_id:
              !!values?.image && !!values?.image?.length ? values?.image?.[0]?.uuid || values?.image?.[0]?.id : '',
            description: values?.agentDescription,
            description_l1: values?.agentDescriptionArabic,
            service_areas: values?.serviceArea,
            languages: values?.languages,
            experience: values?.experience,
          },
        },
      };
    },
  },

  getAgencyUserDetails: {
    query: (userId) => ({
      url: `/api/surge/users/${userId}`,
    }),
    transformer: (response) => tenantTransformers.agencyStaffUserMapper(response),
  },

  updateAgencyStaffUser: {
    query: (body) => ({
      url: `/api/surge/users/${body?.userId}`,
      method: 'PUT',
      body: tenantPayloads.updateAgencyStaffUserPayload(body),
    }),
  },

  getInviteInformation: {
    query: ({ values }) => {
      return {
        url: `/api/surge/invitations?token=${values?.token}`,
      };
    },
  },

  addAgencyStaffUser: {
    query: (body) => ({
      url: `/api/surge/agencies/${body?.agencyId}/add_staff`,
      method: 'POST',
      body: tenantPayloads.updateAgencyStaffUserPayload(body),
    }),
  },

  manageAgencyInvite: {
    query: (values) => {
      return {
        url: '/api/surge/invitations',
        method: 'PUT',
        body: values,
      };
    },
  },

  getOtpForInviteUserToAgency: {
    query: ({ userId, identifier }) => ({
      url: `/api/surge/otps`,
      method: 'POST',
      body: {
        channel: 'phone',
        purpose: 'create_invitation',
        entity_type: 'Invitation',
        user_id: userId,
        identifier,
      },
    }),
  },

  validateOtpForInvitation: {
    query: ({ code, referenceNumber }) => ({
      url: `/api/surge/otps/verify`,
      method: 'POST',
      body: {
        code,
        reference_number: referenceNumber,
        purpose: 'create_invitation',
      },
    }),
  },

  updateAgencyStaffUserCapping: {
    query: (body) => ({
      url: `/api/surge/agencies/${body.agencyId}/update_staff_cap`,
      method: 'PATCH',
      body: body,
    }),
  },

  convertToAgency: {
    query: ({ userId, values }) => ({
      url: `/api/surge/users/${userId}`,
      method: 'PUT',
      body: convertToAgencyPayload(values, userId),
    }),
  },
};

export default agencyApiEndpoints;
