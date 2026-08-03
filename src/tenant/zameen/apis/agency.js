import tenantPayloads from '@payloads';
import tenantTransformers from '@transformers';
import { getCnicUuidFromImage } from '../../../helpers/imageHelpers/imageStateObject';

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

  updateAgencyProfile: {
    query: (data) => ({
      url: `/api/surge/agencies/${data?.agencyId}`,
      method: 'PUT',
      body: tenantPayloads.updateAgencyProfilePayload(data?.body, data?.updatingAgencyOwner, data?.locale),
    }),
    transformer: (response) => tenantTransformers.agencyDataMapper(response?.agency),
  },

  getAgencyStaffList: {
    query: (agencyId) => ({
      url: `/api/surge/agencies/${agencyId}`,
    }),
    transformer: (response) => {
      const mappedResponse = tenantTransformers.mapSurgeAgencyResponse(response);
      return tenantTransformers.agencyStaffDataMapper(mappedResponse);
    },
  },

  deleteAgencyUser: {
    query: ({ agencyId, userId }) => ({
      url: `/api/agencies/${agencyId}/remove_staff`,
      method: 'DELETE',
      body: {
        user_id: userId,
      },
    }),
  },

  getAgencyUserDetails: {
    query: (userId) => ({
      url: `/api/users/${userId}`,
    }),
    transformer: (response) => tenantTransformers.agencyStaffUserMapper(response?.user),
  },

  updateAgencyStaffUser: {
    query: (body) => ({
      url: `/api/users/${body?.userId}`,
      method: 'PUT',
      body: tenantPayloads.updateAgencyStaffUserPayload(body),
    }),
  },

  addAgencyStaffUser: {
    query: (body) => ({
      url: `/api/agencies/${body?.agencyId}/add_staff`,
      method: 'POST',
      body: tenantPayloads.updateAgencyStaffUserPayload(body),
    }),
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

  updateAgencyUser: {
    query: ({ userId, agencyId, values }) => {
      const front = values?.cnic_front?.[0];
      const back = values?.cnic_back?.[0];
      return {
        url: `/api/users/${userId}`,
        method: 'PUT',
        body: {
          user: {
            name: values?.name,
            email: values?.email,
            cnic: values?.cnic,
            ...(values?.password && { pass: values?.password }),
            mobile: values?.mobile && values?.mobile,
            phone: values?.landline && values?.landline,
            address: values?.address,
            country_id: values?.country || 155,
            city_id: values?.city,
            user_profile_id:
              !!values?.image && !!values?.image?.length ? values?.image?.[0]?.uuid || values?.image?.[0]?.id : '',
            user_cnic_front_id: getCnicUuidFromImage(front),
            user_cnic_back_id: getCnicUuidFromImage(back),
          },
        },
      };
    },
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

  updateAgencyStaffUserCapping: {
    query: (body) => ({
      url: `/api/agencies/${body.agencyId}/update_staff_cap`,
      method: 'PATCH',
      body: body,
    }),
  },
};

export default agencyApiEndpoints;
