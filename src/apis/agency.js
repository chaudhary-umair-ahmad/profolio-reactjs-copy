import rtkApis from '@rtkApis';
import { setAppUser, setUsersList } from '../store/appSlice';
import parentApi from '../store/parentApi';

const agencyApis = parentApi.injectEndpoints({
  endpoints: (build) => ({
    getAgencyProfileDetails: build.query({
      query: (agencyId) => rtkApis.getAgencyProfileDetails.query(agencyId)?.url,
      transformResponse: (response) => rtkApis.getAgencyProfileDetails?.transformer(response),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          if (!!data) {
            const { user } = getState()?.app?.loginUser;
            dispatch(
              setAppUser({ ...user, agency: { ...data?.agencyDetails, ...user?.agency, users: data?.agencyUsers } }),
            );
            dispatch(setUsersList(data?.agencyUsers));
          }
        } catch (e) {
          console.error('Failed to update user agency.', e);
        }
      },
      providesTags: ['agency-profile'],
    }),

    updateAgencyProfile: build.mutation({
      query: (data) => rtkApis.updateAgencyProfile?.query(data),
      transformResponse: (response) => rtkApis.updateAgencyProfile?.transformer(response),
    }),

    getAgencyActiveLicenses: build.query({
      query: (agencyId) => rtkApis.getAgencyActiveLicenses(agencyId)?.url,
    }),

    getAgencyStaffList: build.query({
      query: (agencyId) => rtkApis.getAgencyStaffList.query(agencyId)?.url,
      transformResponse: (response) => rtkApis.getAgencyStaffList?.transformer(response),
      providesTags: ['agency-staff'],
    }),

    deleteAgencyUser: build.mutation({
      query: ({ agencyId, userId }) => rtkApis.deleteAgencyUser.query({ agencyId, userId }),
      invalidatesTags: ['agency-staff', 'agency-profile'],
    }),

    getAgencyUserDetails: build.query({
      query: (userId) => rtkApis.getAgencyUserDetails.query(userId)?.url,
      transformResponse: (response) => rtkApis.getAgencyUserDetails.transformer(response),
      providesTags: ['agency-staff-user'],
      invalidatesTags: ['agency-staff'],
    }),

    updateAgencyStaffUser: build.mutation({
      query: (body) => rtkApis.updateAgencyStaffUser.query(body),
      invalidatesTags: ['agency-staff', 'agency-profile', 'agency-staff-user'],
    }),

    addAgencyStaffUser: build.mutation({
      query: (body) => rtkApis.addAgencyStaffUser.query(body),
      invalidatesTags: ['agency-staff', 'agency-profile', 'agency-staff-user'],
    }),

    updateAgencySettings: build.mutation({
      query: (body) => rtkApis.updateAgencySettings.query(body),
      invalidatesTags: ['agency-staff', 'agency-profile', 'agency-staff-user'],
    }),

    updateAgencyUser: build.mutation({
      query: (body) => rtkApis.updateAgencyUser.query(body),
      invalidatesTags: ['agency-staff', 'agency-profile', 'agency-staff-user'],
    }),

    getInviteInformation: build.query({
      query: (query) => rtkApis.getInviteInformation.query(query),
    }),

    manageAgencyInvite: build.mutation({
      query: (body) => rtkApis.manageAgencyInvite.query(body),
    }),

    getOtpForInviteUserToAgency: build.query({
      query: (params) => rtkApis.getOtpForInviteUserToAgency.query(params),
    }),

    validateOtpForInvitation: build.mutation({
      query: (body) => rtkApis.validateOtpForInvitation.query(body),
    }),

    updateAgencyStaffUserCapping: build.mutation({
      query: (body) => rtkApis.updateAgencyStaffUserCapping.query(body),
      invalidatesTags: ['agency-staff'],
    }),

    convertToAgency: build.mutation({
      query: (body) => rtkApis.convertToAgency.query(body),
    }),
    getAgencySeatsSummary: build.query({
      query: (agencyId) => ({
        url: `/api/surge/agencies/${agencyId}/seats_summary`,
        method: 'GET',
      }),
      providesTags: ['agency-seats'],
    }),
  }),
});

export const {
  useGetAgencyProfileDetailsQuery,
  useLazyGetInviteInformationQuery,
  useUpdateAgencyUserMutation,
  useUpdateAgencySettingsMutation,
  useManageAgencyInviteMutation,
  useLazyGetAgencyProfileDetailsQuery,
  useUpdateAgencyProfileMutation,
  useGetAgencyStaffListQuery,
  useDeleteAgencyUserMutation,
  useGetAgencyUserDetailsQuery,
  useUpdateAgencyStaffUserMutation,
  useAddAgencyStaffUserMutation,
  useConvertToAgencyMutation,
  useLazyGetOtpForInviteUserToAgencyQuery,
  useValidateOtpForInvitationMutation,
  useUpdateAgencyStaffUserCappingMutation,
  useGetAgencyActiveLicensesQuery,
  useGetAgencySeatsSummaryQuery,
} = agencyApis;
