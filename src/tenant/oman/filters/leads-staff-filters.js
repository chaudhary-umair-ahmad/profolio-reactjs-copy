import tenantUtils from '@utils';
import { getTimeDateString } from '../../../utility/date';
import { t } from 'i18next';

const getLeadsStaffFilters = (users) => [
  {
    type: 'unitSelect',
    label: 'Search By',
    key: 'search',
    subList: [
      { label: t('Listing ID'), key: 'listing_id', queryParamKey: 'f[interests.listing.id]' },
      { label: t('Lead ID'), key: 'lead_id', queryParamKey: 'f[lead_client.id]' },
      { label: t('Lead Name'), key: 'lead_name', queryParamKey: 's[name]' },
    ],
  },
  {
    label: t('Lead Received'),
    key: 'lead_received',
    queryParamKey: ['f[created_at][gte]', 'f[created_at][lte]'],
    placeholder: t('Select Date Range'),
    type: 'dateRange',
    getOptionLabel: (value) => {
      return value
        .split(',')
        .map((e) => getTimeDateString(e, false, true, false, false))
        .join(' - ');
    },
  },
  {
    label: t('Last Interaction'),
    key: 'last_interaction',
    queryParamKey: ['f[updated_at][gte]', 'f[updated_at][lte]'],
    placeholder: t('Select Date Range'),
    type: 'dateRange',

    getOptionLabel: (value) => {
      return value
        .split(',')
        .map((e) => getTimeDateString(e, false, true, false, false))
        .join(' - ');
    },
  },
  ...(users?.length > 1
    ? [
        {
          key: 'user_id',
          queryParamKey: 'f[user_id]',
          label: t('Users'),
          labelProps: { muted: true },
          placeholder: t('Select Users'),
          type: 'select',
          list: users,
          showTag: true,
          singleValue: true,
          getOptionLabel: (e) => tenantUtils.getLocalisedString(e, 'name'),
          getOptionValue: (op) => op.id.toString(),
        },
      ]
    : []),
];
export default getLeadsStaffFilters;
