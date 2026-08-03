import tenantUtils from '@utils';
import tenantConstants from '@constants';
import store from '@store';
import { strings } from '../../../constants/strings';

const agencyStaffDataMapper = (response) => {
  const { user } = store?.getState()?.app?.loginUser;
  let listingsPosted = 0;
  return {
    agency_logo: response?.agency?.agency_logo,
    owner_id: response?.agency?.creator_id,
    total_agency_credits: response?.agency?.credits?.ksa?.total,
    agency_available_credits: response?.agency?.credits?.ksa?.available,
    agency_used_credits: response?.agency?.credits?.ksa?.used,
    list: response?.agency?.users?.map((e) => {
      let activeListings = 0;
      return {
        ...e,
        user_name: tenantUtils.getLocalisedString(e, 'name'),
        user_email: e?.email,
        user_phone: e?.mobile,
        user_image: e?.profile_image,
        user_credits: e?.credits?.ksa?.total ? { value: e?.credits?.ksa?.total } : { value: 0, dashForNone: false },
        used_credits: e?.credits?.ksa?.used ? { value: e?.credits?.ksa?.used } : { value: 0, dashForNone: false },
        quota: e?.quotas?.available ? formatNumberString(e?.quotas?.available) : 0,
        active_listings: { value: activeListings },
        leads: { value: null },
        agent_rank: {
          scoreTitle: e?.is_tru_broker ? (e?.rank ? e?.rank : '-') : '-',
          scoreIcon: e?.is_tru_broker && e?.rank > 0 && 'SvgLeaderBoardGradient',
          scoreValue: e?.is_tru_broker && e?.rank,
          score: e?.is_tru_broker && e?.score,
          name: tenantUtils.getLocalisedString(e, 'name'),
          agency_name: tenantUtils.getLocalisedString(e?.agency, 'name'),
          is_tru_broker: !!e?.is_tru_broker,
          profile_image: e?.profile_image,
        },
        tru_points: {
          scoreTitle: e?.is_tru_broker ? (e?.monthly_score ? e?.monthly_score : '-') : '-',
          scoreIcon: e?.is_tru_broker && e?.monthly_score > 0 && 'SvgStarGradient',
          userId: e?.id,
          scoreValue: e?.is_tru_broker && e?.monthly_score,
        },
        user_details: {
          user_role: e?.user_role_within_agency,
          name: tenantUtils.getLocalisedString(e, 'name'),
          email: e?.email,
          phone: e?.mobile,
          image: e?.profile_image,
          is_tru_broker: !!e?.is_tru_broker,
        },
        rowActions: {
          ...e,
          agencyId: response?.agency?.id,
          userId: e?.id,
          isAdmin: e?.is_admin,
          isOwner: e?.user_role_within_agency === 'owner',
          name: tenantUtils.getLocalisedString(e, 'name'),
          creditsAvailable: e?.credits?.ksa?.available,
          deleteModalData: {
            table: [
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                component: 'String',
              },
              {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                component: 'String',
              },
            ],
            list: [
              {
                ...e,
                name: tenantUtils.getLocalisedString(e, 'name'),
                active_listings: { value: activeListings },
              },
            ],
          },
        },
      };
    }),
    cappedUsersList: response?.agency?.users
      ?.filter((e) => e?.user_role_within_agency != 'owner')
      ?.map((e, index, originalArray) => {
        return {
          id: index,
          ...e,
          staff_user_details: {
            user_name: tenantUtils.getLocalisedString(e, 'name'),
            image: e?.profile_image,
          },
          user_credit_details: {
            user_id: e?.id,
            available_credits: e?.credits?.ksa?.available ? e?.credits?.ksa?.available : 0,
            used_credits: e?.credits?.ksa?.used ? e?.credits?.ksa?.used : 0,
            total_available_credits: e?.credits?.ksa?.total ? e?.credits?.ksa?.total : 0,
          },
        };
      }),
    headerCards: [
      {
        icon: 'MdPersonPinCircle',
        iconColor: '',
        iconSize: '1em',
        title: strings.total_agents,
        value: response?.agency?.users?.length,
      },
      {
        icon: 'IoMdPin',
        iconColor: '#00a651',
        iconSize: '1em',
        title: strings.listings_posted,
        value: listingsPosted,
      },
    ],
    table: [
      {
        title: 'Staff Details',
        dataIndex: 'user_details',
        key: 'user_details',
        component: 'StaffDetails',
      },
      ...(!user?.is_credit_user
        ? [
            {
              title: 'Available Quota',
              dataIndex: 'quota',
              key: 'quota',
              component: 'String',
            },
          ]
        : [
            {
              title: 'Credits Limit',
              dataIndex: 'user_credits',
              key: 'user_credits',
              component: 'Number',
            },
            {
              title: 'Used Credits',
              dataIndex: 'used_credits',
              key: 'used_credits',
              component: 'Number',
            },
          ]),
      ...(tenantConstants?.TRU_BROKER_ENABLED
        ? [{ title: 'Rank', dataIndex: 'agent_rank', key: 'agent_rank', component: 'TruBrokerScore' }]
        : []),
      ...(tenantConstants?.TRU_BROKER_ENABLED
        ? [{ title: 'TruPoints™', dataIndex: 'tru_points', key: 'tru_points', component: 'TruBrokerScore' }]
        : []),
      {
        title: 'Actions',
        dataIndex: 'rowActions',
        key: 'rowActions',
        component: 'UserRowActions',
      },
    ],
    creditCappingDetails: {
      table: [
        {
          title: 'Staff Details',
          dataIndex: 'user_name',
          key: 'user_name',
          component: 'AvatarName',
        },
        {
          title: 'Set Limit',
          dataIndex: 'user_credit_details',
          key: 'user_credit_details',
          component: 'SetCappingLimit',
        },
      ],
    },
  };
};

export default { agencyStaffDataMapper };
