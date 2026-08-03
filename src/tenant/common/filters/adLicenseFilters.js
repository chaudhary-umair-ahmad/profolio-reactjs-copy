import { t } from 'i18next';
import { getTimeDateString } from '../../../utility/date';

const getAdLicenseFilters = (user, agencyUsersList) => [
  {
    label: t('Request ID'),
    type: 'input',
    key: 'request_id',
    queryParamKey: 'q[id_eq]',
    placeholder: t('Enter Request ID'),
    labelProps: { muted: true },
    inputType: 'number',
    limit: 10,
  },
  {
    label: t('Deed Number'),
    type: 'input',
    key: 'deed_number',
    queryParamKey: 'q[deed_number_eq]',
    placeholder: t('Enter Deed Number'),
    labelProps: { muted: true },
    inputType: 'text',
    limit: 20,
  },
  {
    label: t('Status'),
    list: [
      { id: 'completed', title: 'Completed' },
      { id: 'payment_pending', title: 'Payment Pending' },
      { id: 'request_confirmation', title: 'Verifying Details' },
      { id: 'rega_contract_signing', title: 'Contract Signing' },
      { id: 'rega_contract_creation', title: 'Preparing Contract' },
      { id: 'ad_license_creation', title: 'Creating License' },
      { id: 'post_listing', title: 'License Ready' },
      { id: 'rejected', title: 'Request Cancelled' },
    ],
    type: 'select',
    key: 'jarvis_stages',
    queryParamKey: 'q[jarvis_stages_eq]',
    placeholder: t('Select Status'),
    labelProps: { muted: false },
    getOptionValue: (e) => e?.id?.toString(),
    getOptionLabel: (e) => t(e?.title),
  },
  {
    label: t('Created On'),
    key: 'created_date',
    queryParamKey: ['q[created_at_gteq]', 'q[created_at_lteq]'],
    placeholder: t('Select Date'),
    type: 'dateRange',
    labelProps: { muted: true },
    getOptionLabel: (value) => {
      return getTimeDateString(value, false, true, false, false);
    },
  },
];

export default getAdLicenseFilters;
