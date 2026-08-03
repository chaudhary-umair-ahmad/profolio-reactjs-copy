import tenantUtils from '@utils';
import tenantConstants from '@constants';
import tenantData from '@data';
import { t } from 'i18next';
import { Icon } from '../../../components/common';
import { getTimeDateString } from '../../../utility/date';

const getMyListingsFilters = (user, agencyUsersList, locale, truCheckStatus, projects) => [
  {
    label: 'Listing ID',
    type: 'input',
    key: 'listing_id',
    queryParamKey: 'f[listing_id]',
    placeholder: 'Enter Listing ID',
    labelProps: { muted: true },
    inputType: 'number',
    limit: 8,
  },
  ...(tenantConstants.SHOW_REGA_DETAIL
    ? [
        {
          label: 'REGA Ad License Number',
          type: 'input',
          key: 'ad_license',
          queryParamKey: 'f[ad_license_number]',
          placeholder: 'Enter REGA Ad License Number',
          labelProps: { muted: true },
          inputType: 'number',
          limit: 9,
        },
      ]
    : []),
  {
    label: 'Purpose',
    list: tenantData.purposeList,
    type: 'select',
    key: 'purpose_id',
    queryParamKey: 'f[purpose_id]',
    placeholder: 'Select Purpose',
    labelProps: { muted: false },
    getOptionValue: (e) => e?.id?.toString(),
    getOptionLabel: (e) => (
      <div>
        <Icon icon={e.icon} />
        {t(e.title)}
      </div>
    ),
  },
  {
    label: 'Property Type',
    key: 'type_id',
    queryParamKey: 'f[type_id]',
    type: 'select',
    mode: 'multiple',
    placeholder: 'Select Property Types',
    allowClear: true,
    labelProps: { muted: true },
    list: tenantData.listingTypes([], locale)?.map((e, i) => ({
      key: i,
      label: t(e?.title?.[locale]),
      options: e.sub_types.map((it) => ({
        label: t(it?.title?.[locale]),
        value: it.id?.toString(),
        icon: it?.icon,
        key: `${e?.id}-${it?.id}`,
      })),
    })),
    getOptionLabel: (e, i) => <div key={i}>{t(e.label)}</div>,
  },
  {
    label: 'Posted On',
    key: 'date_between',
    queryParamKey: ['f[primary_platform_listing.posted_at][gteq]', 'f[primary_platform_listing.posted_at][lteq]'],
    placeholder: 'Select Date Range',
    type: 'dateRange',
    labelProps: { muted: true },
    getOptionLabel: (value) => {
      return value
        .split(',')
        .map((e) => getTimeDateString(e, false, true, false, false))
        .join(' - ');
    },
  },
  {
    type: 'locationFilter',
    mode: 'multiple',
    subList: [
      {
        key: 'city_id',
        queryParamKey: 'f[city_id]',
        getOptionValue: (item) => item.location_id.toString(),
      },
      {
        key: 'location_id',
        queryParamKey: 'f[location_id]',
        getOptionValue: (item) => item.location_id.toString(),
      },
    ],
  },
  ...(!!(agencyUsersList?.length > 1)
    ? [
        {
          label: 'Posted By',
          list: agencyUsersList,
          type: 'select',
          key: 'user_id',
          queryParamKey: 'f[primary_platform_listing_user_id]',
          placeholder: 'Select Users',
          box_title: 'All Users',
          labelProps: { muted: true },
          singleValue: true,
          getOptionValue: (e) => e?.id?.toString(),
          getOptionLabel: (e) => `${tenantUtils.getLocalisedString(e, 'name') || e?.name_l1} ${e.id === user?.id ? t('(Me)') : ''}`,
        },
      ]
    : []),
  ...(tenantConstants?.TRUE_CHECK_ENABLED
    ? [
        {
          label: t('TruCheck Status'),
          list: truCheckStatus,
          type: 'select',
          key: 'trucheck_status_id',
          queryParamKey: 'f[trucheck_status_id]',
          placeholder: t('Select TruCheck Status'),
          labelProps: { muted: false },
          getOptionValue: (e) => e?.id?.toString(),
          getOptionLabel: (e) => t(e?.name),
        },
      ]
    : []),
  ...(tenantConstants.SHOW_LISTING_DISCOUNT_TAG
    ? [
        {
          label: t('Show Discounted Listings Only'),
          type: 'toggle',
          key: 'has_discount',
          queryParamKey: 'q[discount_applied_eq]',
          labelProps: { muted: true },
        },
      ]
    : []),
  {
    list: [0, 1000000000],
    type: 'rangeSlider',
    isCurrency: true,
    defaultValues: [0, 1],
    label: 'Price Range',
    key: 'price_between',
    queryParamKey: ['f[price][gteq]', 'f[price][lteq]'],
    labelProps: { muted: true },
  },
  {
    list: tenantData?.areaUnitList?.map((e) => ({ ...e, key: e?.slug, value: [0, 10000] })),
    defaultUnitKey: 'square_meters',
    label: 'Area Range',
    type: 'unitRangeSlider',
    key: 'area_between',
    unitKey: 'areaUnitKey',
    queryParamKey: ['f[area_in_sqft][gteq]', 'f[area_in_sqft][lteq]', 'areaUnitKey'],
    labelProps: { muted: true },
    unitList: tenantData?.areaUnitList.map((e) => ({ ...e, key: e?.slug })),
    disabledUnit: !tenantData?.areaUnitList?.length || tenantData?.areaUnitList?.length == 1,
  },
  ...(tenantConstants?.OFFPLAN_ENABLED
    ? [
        {
          label: t('Projects'),
          list: projects,
          type: 'select',
          key: 'div_id',
          queryParamKey: 'f[dev_id]',
          placeholder: t('Select Project'),
          labelProps: { muted: false },
          getOptionValue: (e) => e?.id?.toString(),
          getOptionLabel: (e) => `${tenantUtils.getLocalisedString(e, 'title')}`,
        },
        {
          label: t('Completion Status'),
          list: tenantData.completionStatus,
          type: 'select',
          key: 'completion_status_id',
          queryParamKey: 'f[completion_status_id]',
          placeholder: t('Select Completion Status'),
          labelProps: { muted: false },
          getOptionValue: (e) => e?.id?.toString(),
          getOptionLabel: (e) => t(e.title),
        },
      ]
    : []),
];

export default getMyListingsFilters;
