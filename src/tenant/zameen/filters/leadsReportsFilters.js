import tenantData from '@data';
import { t } from 'i18next';
import { PERMISSIONS_TYPE } from '../../../constants/permissions';
import { getTimeDateString } from '../../../utility/date';
const getLeadsReportsFilters = (userList, user) => {
  return [
    {
      label: 'Date',
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

    ...(user?.permissions?.[PERMISSIONS_TYPE.STATS]
      ? [
          {
            label: 'Users',
            list: userList,
            type: 'select',
            key: 'user_id',
            placeholder: 'Select Users',
            box_title: 'All Users',
            labelProps: { muted: true },
            singleValue: true,
            showTag: true,
            getOptionValue: (op) => op.id.toString(),
            getOptionLabel: (op) => {
              return `${op.name} ${op.id === user?.id ? ' (Me)' : ''}`;
            },
          },
        ]
      : []),

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
      queryParamKey: 'purpose_id[]',
      getOptionValue: (e) => e?.id?.toString(),
      getOptionLabel: (e) => (
        <div>
          {/* <Icon icon={e.icon} /> */}
          {t(e.title)}
        </div>
      ),
    },
  ];
};
export default getLeadsReportsFilters;
