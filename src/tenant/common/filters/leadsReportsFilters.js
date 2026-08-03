import tenantData from '@data';
import { t } from 'i18next';
import { getTimeDateString } from '../../../utility/date';
import { Icon } from '../../../components/common';

const getLeadsReportsFilters = () => [
  {
    label: 'Listed Date',
    key: 'date_between',
    placeholder: 'Select Date Range',
    type: 'dateRange',
    showInSingleTag: true,
    labelProps: { muted: true },
    minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
    reportsStaticRanges: true,
    queryParamKey: ['start_date', 'end_date'],
    getOptionLabel: (value) => {
      return value
        .split(',')
        .map((e) => getTimeDateString(e, false, true, false, false))
        .join(' - ');
    },
  },

  {
    label: 'Purpose',
    list: tenantData.purposeList,
    type: 'select',
    placeholder: 'Select Purpose',
    box_title: 'Purpose',
    singleValue: true,
    labelProps: { muted: true },
    showTag: true,
    key: 'purpose',
    queryParamKey: 'category_ids[]',
    getOptionValue: (e) => e?.id?.toString(),
    getOptionLabel: (e) => (
      <div>
        <Icon icon={e.icon} />
        {t(e.title)}
      </div>
    ),
  },
];
export default getLeadsReportsFilters;
