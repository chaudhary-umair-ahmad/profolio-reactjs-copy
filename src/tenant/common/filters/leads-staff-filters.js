import tenantUtils from '@utils';
import { getTimeDateString } from '../../../utility/date';
import { t } from 'i18next';

const getLeadsStaffFilters = (users) => [
  {
    type: 'unitSelect',
    label: t('Search By'),
    key: 'search',
    subList: [
      { label: t('Listing ID'), key: 'listing_id', queryParamKey: 'f[interests.listing.id]' },
      { label: t('REGA Ad License Number'), key: 'ad_license', queryParamKey: 'f[ad_license_number]' },
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

  // {
  //   key: 'product_id',
  //   queryParamKey: 'q[product_id_in][]',
  //   label: 'Task Performed',
  //   labelProps: { muted: true },
  //   placeholder: 'Select Task Performed',
  //   type: 'select',
  //   showTag: true,
  //   singleValue: true,
  //   getOptionLabel: (e) => tenantUtils.getLocalisedString(e, 'product_title'),
  // },
  // {
  //   key: 'product_id',
  //   queryParamKey: 'q[product_id_in][]',
  //   label: 'Planned Task',
  //   labelProps: { muted: true },
  //   placeholder: 'Select Planned Task',
  //   type: 'select',
  //   showTag: true,
  //   singleValue: true,
  //   getOptionLabel: (e) => tenantUtils.getLocalisedString(e, 'product_title'),
  // },
];
export default getLeadsStaffFilters;
