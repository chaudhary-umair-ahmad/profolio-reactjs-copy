import { getTimeDateString } from '../../../utility/date';
const getQuotaCreditsFilters = () => {
  return [
    {
      label: 'Purchase Date',
      placeholder: 'Select Date',
      type: 'dateRange',
      key: 'date_between',
      showInSingleTag: true,
      labelProps: { muted: true },
      queryParamKey: ['q[transaction_date_gteq]', 'q[transaction_date_lteq]'],
      getOptionLabel: (value) => {
        return value
          .split(',')
          .map((e) => getTimeDateString(e, false, true, false, false))
          .join(' - ');
      },
    },
  ];
};
export default getQuotaCreditsFilters;
