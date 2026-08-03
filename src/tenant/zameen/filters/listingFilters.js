import tenantData from '@data';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { t } from 'i18next';
import { getTimeDateString } from '../../../utility/date';
import { Icon } from '../../../components/common';
const getMyListingsFilters = (user, agencyUsersList) => {
  const getZameenCategroyList = () => {
    return tenantData.products?.filter((e) => {
      return (
        e?.platform === 'zameen' &&
        e?.slug !== 'story_ad' &&
        e?.slug !== 'property_videography' &&
        e?.slug !== 'property_photography' &&
        e?.slug !== 'hot_listing' &&
        e?.slug !== 'shot_listing' &&
        e?.slug !== 'refresh_listing' && { ...e, slug: e?.filerValue }
      );
    });
  };

  const getOlxCategroyList = () => {
    // const products = user.products.platforms['olx'];
    // const categoryList = [];
    // products?.forEach((e) => {
    //   if (e?.slug !== 'olx_feature' && e?.slug !== 'olx_refresh_listing' && e?.slug !== 'olx_premium_listing') {
    //     categoryList.push({ ...e, slug: tenantData.categoryProductsMapping[e.slug]?.value });
    //   }
    // });
    // return categoryList;

    return tenantData.products?.filter((e) => {
      return (
        e?.platform === 'olx' &&
        e?.slug !== 'olx_feature' &&
        e?.slug !== 'olx_refresh_listing' &&
        e?.slug !== 'olx_premium_listing' && { ...e, slug: e?.filerValue }
      );
    });
  };

  return [
    {
      label: 'ID',
      type: 'input',
      key: 'listing_id',
      queryParamKey: 'q[listing_id_eq]',
      placeholder: 'Enter Listing ID',
      labelProps: { muted: true },
      inputType: 'number',
      limit: 8,
    },

    {
      label: 'Property Type',
      key: 'type_id',
      queryParamKey: 'q[type_id_in][]',
      allowClear: true,
      labelProps: { muted: true },
      list: tenantData.listingTypes([])?.map((e) => ({
        label: t(e?.title),
        options: e.sub_types.map((it) => ({
          label: t(it?.title),
          value: it.id?.toString(),
          icon: it?.icon,
          key: `${e?.id}-${it?.id}`,
        })),
      })),
      type: 'select',
      mode: 'multiple',
      placeholder: 'Select Property Types',
      getOptionLabel: (e) => <div>{t(e.label)}</div>,
    },
    {
      label: 'Purpose',
      list: tenantData.purposeList,
      type: 'select',
      key: 'purpose_id',
      queryParamKey: 'q[purpose_id_eq]',
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
      label: 'Listed Date',
      key: 'date_between',
      queryParamKey: ['q[created_at_gteq]', 'q[created_at_lteq]'],
      placeholder: 'Select Date Range',
      type: 'dateRange',
      labelProps: { muted: true },
      getOptionLabel: (value) => {
        return value
          .split(',')
          .map((e) => getTimeDateString(e, false, true, false, false))
          .join(' - ');
      },
      allowClear: true,
    },
    ...(!user?.is_single_platform
      ? [
          {
            label: 'Platform',
            list:
              user?.olx_user_id !== null
                ? tenantData.platformList
                : tenantData.platformList.filter((e) => e.slug !== 'olx'),
            type: 'select',
            key: 'platform',
            placeholder: 'Select Platform',
            box_title: 'All Platforms',
            queryParamKey: (value) => `q[posted_on_${value}_true]=true`,
            labelProps: { muted: true },
            getValueKey: (item) => item.slug,
            getOptionValue: (item) => item.slug,
            getOptionLabel: (e) => (
              <div>
                <Icon icon={e.icon} />
                {t(e.title)}
              </div>
            ),
            dependents: ['category'],
          },
        ]
      : []),

    {
      label: 'Category',
      list: user?.is_single_platform
        ? getZameenCategroyList()
        : { ['zameen']: getZameenCategroyList(), ['olx']: getOlxCategroyList() },
      type: 'select',
      queryParamKey: 'q[flag_eq]',
      key: 'category',
      placeholder: 'Select Category',
      labelProps: { muted: true },
      ...(!user?.is_single_platform && {
        dependsOn: 'platform',
      }),
      getValueKey: (item) => item?.filterValue,
      getOptionValue: (item) => item.filterValue,
      getOptionLabel: (e) => (
        <div>
          <Icon icon={e.icon} color={e.iconColor} />
          {t(e.listingType)}
        </div>
      ),
    },

    {
      type: 'locationFilter',
      mode: 'multiple',
      subList: [
        {
          key: 'city_id',
          queryParamKey: 'q[location_city_id_in][]',
          placeholder: `Select ${tenantConstants.LISTING_LOCATIONS.label}`,
          getOptionValue: (item) => item.location_id.toString(),
        },
        {
          key: 'location_id',
          queryParamKey: 'q[location_id_in][]',
          placeholder: 'Select Location',
          getOptionValue: (item) => item.location_id.toString(),
        },
      ],
    },
    {
      list: [0, 1000000000],
      type: 'rangeSlider',
      isCurrency: true,
      defaultValues: [0, 1],
      label: 'Price Range',
      key: 'price_between',
      queryParamKey: ['q[price_gteq]', 'q[price_lteq]'],
      labelProps: { muted: true },
    },

    {
      list: tenantData?.areaUnitList?.map((e) => ({ ...e, key: e?.slug, value: [0, 10000] })),
      defaultUnitKey: 'square_meters',
      label: 'Area Range',
      type: 'unitRangeSlider',
      key: 'area_between',
      unitKey: 'areaUnitKey',
      queryParamKey: ['q[area_unit_value_gteq]', 'q[area_unit_value_lteq]', 'areaUnitKey'],
      labelProps: { muted: true },
      unitList: tenantData?.areaUnitList.map((e) => ({ ...e, key: e?.slug })),
      disabledUnit: !tenantData?.areaUnitList?.length || tenantData?.areaUnitList?.length == 1,
      onValuesConvert: tenantUtils.areaUnitConvert(tenantData.AREA_UNIT.SQUARE_FEET),
      onUnitChange: (option) => {
        store.dispatch(setUnit({ area_unit: option?.slug }));
      },
    },
    ...(!!(agencyUsersList?.length > 1)
      ? [
          {
            label: 'Users',
            list: agencyUsersList,
            type: 'select',
            key: 'user_id',
            queryParamKey: 'q[user_id_eq]',
            getOptionValue: (e) => e?.id?.toString(),
            placeholder: 'Select Users',
            box_title: 'All Users',
            labelProps: { muted: true },
            singleValue: true,
            getOptionLabel: (e) => {
              return `${e.name} ${e.id === user?.id ? ' (Me)' : ''}`;
            },
          },
        ]
      : []),
  ];
};

export default getMyListingsFilters;
