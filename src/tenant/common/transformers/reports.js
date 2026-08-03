import store from '@store';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import tenantData from '@data';
import tenantTheme from '@theme';
import { t } from 'i18next';
import moment from 'moment';
import { capitalizeFirstLetter } from '../../../utility/utility';
import { getDateLabels } from '../../../utility/date';
import tenantTransformers from '@transformers';

const graphValueData = (productsStatsData, dataKeysInitialData, tabList, statTabs, leadsStatsData) => {
  const result = {};
  tabList?.forEach((t) => {
    if (t?.key == 'leads') {
      let tabularData = {};
      statTabs.forEach((e) => {
        if (e?.subList) {
          tabularData[e?.key] = {};
          e?.subList?.forEach((item) => {
            tabularData[e?.key][item?.key] = { ...dataKeysInitialData };
          });
        } else {
          tabularData[e?.key] = { ...dataKeysInitialData };
        }
      });

      (leadsStatsData || productsStatsData) &&
        Object.values(leadsStatsData ? leadsStatsData : productsStatsData)?.forEach((value, index) => {
          Object.entries(tabularData)?.forEach(([tabKey, tabObj]) => {
            const statType = statTabs.find((e) => e.key == tabKey);
            Object.entries(tabObj).forEach(([key, subObj]) => {
              if (Array.isArray(subObj)) {
                const obj = value.product_wise?.find((productType) => {
                  return productType.ad_product === key;
                });

                if (obj && key != 'all') {
                  tabObj[key] = [...(tabObj[key] || []), obj?.[statType?.responseKey]];
                } else if (!obj && key != 'all') {
                  tabObj[key] = [...(tabObj[key] || []), 0];
                } else if (key == 'all') {
                  tabObj['all'] = [...(tabObj['all'] || []), value?.[statType?.responseKey]];
                }
              } else {
                Object.keys(subObj).forEach((subListKey) => {
                  const obj = value.product_wise?.find((productType) => {
                    return productType.ad_product === subListKey;
                  });
                  if (obj && subListKey != 'all') {
                    subObj[subListKey] = [...(subObj[subListKey] || []), obj?.[statType?.responseKey]];
                  } else if (!obj && subListKey != 'all') {
                    subObj[subListKey] = [...(subObj[subListKey] || []), 0];
                  } else if (subListKey == 'all') {
                    subObj['all'] = [...(subObj['all'] || []), value?.[statType?.responseKey]];
                  }
                });
              }
            });
          });
        });

      statTabs.forEach((e) => {
        if (e?.subList) {
          e?.subList?.forEach((item) => {
            tabularData[e?.key][item?.key] = { ...tabularData[e?.key][item?.key], ...item };
          });
        }
      });
      result[t.key] = tabularData;
    } else {
      let tabularData = { ...dataKeysInitialData };
      productsStatsData &&
        Object.values(productsStatsData)?.forEach((value, index) => {
          Object.keys(tabularData)?.forEach((key) => {
            const obj = value.product_wise?.find((productType) => {
              return productType.ad_product === key;
            });
            if (obj && key != 'all') {
              tabularData[key] = [...(tabularData[key] || []), obj?.[t?.responseKey]];
            } else if (!obj && key != 'all') {
              tabularData[key] = [...(tabularData[key] || []), 0];
            } else {
              tabularData['all'] = [...(tabularData['all'] || []), value?.[t?.responseKey]];
            }
          });
        });
      result[t.key] = tabularData;
    }
  });
  return result;
};

const fillMissingDates = (apiResponse, start_date, end_date) => {
  start_date = new Date(start_date);
  end_date = new Date(end_date);

  let filledEntries = {};

  let currentDate = new Date(start_date);
  while (currentDate <= end_date) {
    let formattedDate = currentDate.toISOString().slice(0, 10);

    if (apiResponse.hasOwnProperty(formattedDate)) {
      filledEntries[formattedDate] = apiResponse[formattedDate];
    } else {
      filledEntries[formattedDate] = {
        product_wise: [],
        sum_chat_lead_count: 0,
        sum_chat_view_count: 0,
        sum_confirmed_sms: 0,
        sum_confirmed_whatsapp: 0,
        sum_email_lead_count: 0,
        sum_email_view_count: 0,
        sum_lead_count: 0,
        sum_phone_lead: 0,
        sum_phone_view_count: 0,
        sum_search_count: 0,
        sum_sms_lead_count: 0,
        sum_sms_view_count: 0,
        sum_view_count: 0,
        sum_whatsapp_lead_count: 0,
        sum_whatsapp_view_count: 0,
      };
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledEntries;
};

const getAreaGraphData = (data, paramsObj, statTabs, leadsStats, platformSlug) => {
  const { start_date, end_date, purpose } = paramsObj;
  const user = store.getState().app.loginUser.user;
  const { purposeTabs, productTabs: tabs, performanceBy } = tenantUtils.reportsData[platformSlug];
  const productTabs = tabs(user?.isCurrencyUser);
  const productStatsItems = fillMissingDates(data?.stats?.items, start_date, end_date);
  const leadsStatsItems = leadsStats
    ? Object.keys(leadsStats?.items)?.length
      ? fillMissingDates(leadsStats?.items, start_date, end_date)
      : []
    : null;

  const dataKeysInitialData = { all: [] };
  productTabs.forEach((t) => {
    dataKeysInitialData[t.key] = [];
  });
  const finalProductTabs = [
    {
      key: 'all',
      value: 'all',
      label: 'All',
      backgroundColor: tenantTheme['primary-light'],
      borderColor: tenantTheme['primary-color'],
    },
    ...productTabs,
  ];
  const graphData = graphValueData(productStatsItems, dataKeysInitialData, performanceBy, statTabs, leadsStatsItems);

  const parsedData = {
    labels: Object.keys(productStatsItems)?.map((d) => moment(d)?.locale('en')?.format('MMM DD')),
    purposes: purposeTabs,
    types: finalProductTabs,
    performanceBy: performanceBy,
    data: graphData,
  };

  return parsedData;
};

const reportsGraphDataMapper = (data, productStats, leadsStatsData, paramsObj, user, phoneLeadsData, platformSlug) => {
  const { aggregates, trends } = data?.data?.stats || {};
  const leadsStats = leadsStatsData?.data?.stats;

  const data_summary = [
    {
      key: 'leads',
      responseKey: 'sum_lead_count',
      value: aggregates?.sum_lead_count,
      percentage: trends?.sum_lead_count,
      label: 'All Leads',
      title: 'All Leads',
      hit: true,
      id: 0,
      growth: trends?.sum_lead_count > 0,
      since_when: '',
    },
    {
      key: 'calls',
      responseKey: 'sum_phone_view_count',
      value: leadsStats ? leadsStats?.sum_phone_view_count : aggregates?.sum_phone_view_count,
      percentage: trends?.sum_phone_view_count,

      subList: [
        {
          total: leadsStats ? leadsStats?.sum_phone_view_count : aggregates?.sum_phone_view_count,
          key: 'calls_clicked',
          responseKey: 'sum_phone_view_count',
          label: 'Calls Clicked',
          title: 'Calls Clicked',
          borderColor: '#006169',
        },
      ],
      label: 'Calls',
      title: 'Calls',
      icon: 'MdPhone',
      iconProps: {
        hasBackground: false,
        size: '1.1em',
        color: tenantTheme.gray600,
        style: { marginBlockStart: 4 },
      },
      hit: true,
      id: 0,
      growth: trends?.sum_phone_view_count > 0,
      since_when: '',
      inline: true,
      popoverContent: `${t('Calls Clicked')} ${leadsStats ? leadsStats?.sum_phone_view_count : aggregates?.sum_phone_view_count} `,
    },
    {
      key: 'whatsapp',
      responseKey: 'sum_whatsapp_view_count',
      icon: 'RiWhatsappLine',
      iconProps: {
        hasBackground: false,
        size: '1.1em',
        color: tenantTheme.gray600,
        style: { marginBlockStart: 4 },
      },
      subList: [
        {
          total: leadsStats ? leadsStats?.sum_whatsapp_view_count : aggregates?.sum_whatsapp_view_count,
          key: 'whatsapp_clicked',
          responseKey: 'sum_whatsapp_view_count',
          label: 'WhatsApp Clicked',
          title: 'WhatsApp Clicked',
          borderColor: '#006169',
        },
        ...(user?.is_lms_enabled && user?.is_whatsapp_tracking_enabled && tenantConstants.IS_LMS_ENABLED
          ? [
              {
                key: 'whatsapp_sent',
                responseKey: 'sum_whatsapp_lead_count',
                borderColor: '#28B16D',
                label: 'WhatsApp Sent',
                title: 'WhatsApp Sent',
                total: leadsStats?.sum_whatsapp_lead_count,
              },
              {
                key: 'chats_initiated',
                responseKey: 'chats_initiated', //TODO : Update Key
                borderColor: '#F7ADA0',
                label: 'Chats Initiated',
                title: 'Chats Initiated',
                total: leadsStats?.chats_initiated, //TODO : Update Key
              },
            ]
          : []),
      ],
      value: leadsStats ? leadsStats?.sum_whatsapp_view_count : aggregates?.sum_whatsapp_view_count,
      percentage: trends?.sum_whatsapp_view_count,
      label: 'WhatsApp',
      title: 'WhatsApp',
      hit: true,
      id: 0,
      growth: trends?.sum_whatsapp_view_count > 0,
      since_when: '',
      inline: true,
      popoverContent: `${t('WhatsApp Clicked')} ${leadsStats ? leadsStats?.sum_whatsapp_view_count : aggregates?.sum_whatsapp_view_count}`,
    },
    {
      key: 'sms',
      responseKey: 'sum_sms_view_count',
      value: leadsStats ? leadsStats?.sum_sms_view_count : aggregates?.sum_sms_view_count,
      percentage: trends?.sum_sms_view_count,
      label: 'SMS',
      title: 'SMS',
      icon: 'MdSms',
      iconProps: {
        hasBackground: false,
        size: '1.1em',
        color: tenantTheme.gray600,
        style: { marginBlockStart: 4 },
      },
      hit: true,
      id: 0,
      growth: trends?.sum_sms_view_count > 0,
      since_when: '',
      inline: true,
    },
    {
      key: 'emails',
      responseKey: 'sum_email_lead_count',
      value: leadsStats ? leadsStats?.sum_email_lead_count : aggregates?.sum_email_lead_count,
      percentage: trends?.sum_email_lead_count,
      label: 'Emails',
      title: 'Emails',
      icon: 'MdEmail',
      iconProps: {
        hasBackground: false,
        size: '1.1em',
        color: tenantTheme.gray600,
        style: { marginBlockStart: 4 },
      },
      hit: true,
      id: 0,
      growth: trends?.sum_email_lead_count > 0,
      since_when: '',
      inline: true,
    },
  ];

  const graphData = getAreaGraphData(productStats.data, paramsObj, data_summary, leadsStats, platformSlug);

  const parsedData = {
    id: platformSlug,
    slug: platformSlug,
    icon: 'IconBayut',
    title: 'Performance',
    reach_data: [
      {
        key: 'views',
        value: aggregates?.sum_search_count,
        percentage: trends?.sum_search_count,
        label: 'Views',
        title: 'Views',
        icon: 'IoMdEye',
        iconProps: { color: '#28b16d' },
        hit: true,
        id: 0,
        growth: trends?.sum_search_count > 0,
        since_when: '',
        lead: true,
      },
      {
        key: 'clicks',
        value: aggregates?.sum_view_count,
        percentage: trends?.sum_view_count,
        label: 'Clicks',
        title: 'Clicks',
        icon: 'HiCursorClick',
        iconProps: { color: '#f0a742' },
        hit: true,
        id: 0,
        growth: trends?.sum_view_count > 0,
        since_when: '',
        lead: true,
      },
      {
        key: 'leads',
        value: leadsStats ? leadsStats?.sum_lead_count : aggregates?.sum_lead_count,
        percentage: trends?.sum_lead_count,
        label: 'Leads',
        title: 'Leads',
        icon: 'MdPhone',
        iconProps: { color: '#479eeb' },
        hit: true,
        id: 0,
        growth: trends?.sum_lead_count > 0,
        since_when: '',
        lead: true,
      },
    ],
    data_summary: data_summary,
    data_breakdown: phoneLeadsData
      ? {
          ...graphData,
          data: {
            ...graphData?.data,
            leads: { ...graphData?.data?.leads, calls: { ...graphData?.data?.leads?.calls, ...phoneLeadsData } },
          },
        }
      : graphData,
  };
  return parsedData;
};

const COLORS_ARRAY = ['#20C997', '#FA8B0C', '#5F63F2', '#1ce383', '#14449f'];

const limit = 10;

const getAreaBreakdownData = (statsData, dataKey) => {
  const arrayList = statsData?.[dataKey]?.length
    ? statsData?.[dataKey]?.map((e) => ({ ...e, label: tenantUtils.getLocalisedString(e, 'title') }))
    : [];
  const sortedList = arrayList?.sort((a, b) => b?.count - a?.count) || [];
  const othersDataValue = sortedList
    ?.map((entry) => entry?.['count'])
    .slice(COLORS_ARRAY.length)
    .reduce((a, b) => a + b, 0);
  const othersData = sortedList?.length > COLORS_ARRAY.length ? { label: t('Others'), data: othersDataValue } : null;
  const total = sortedList?.map((kl) => kl?.['count'])?.reduce((a, b) => a + b, 0);
  return {
    total: total,
    chart: {
      labels: [
        ...sortedList?.map((entry) => entry?.label).slice(0, COLORS_ARRAY.length),
        ...(othersData ? [othersData?.label] : []),
      ],
      dataset: [
        ...sortedList?.map((entry) => entry?.['count']).slice(0, COLORS_ARRAY.length),
        ...(othersData ? [othersData?.data] : []),
      ],
    },
    locations: [
      ...sortedList
        ?.map((loc) => ({
          label: loc?.label,
          data: loc?.['count'],
        }))
        .slice(0, COLORS_ARRAY.length),
      ...(othersData ? [othersData] : []),
    ],
    backgroundColor: COLORS_ARRAY,
  };
};

const widgetParser = (data, user, platformSlug) => {
  const { areaStats, listings } = data;

  const [_, platformStats] = Object.entries(listings?.stats || {})?.[0];

  const productsToShow = user?.isCurrencyUser
    ? [{ slug: 'signature-listing' }, { slug: 'hot-listing' }, { slug: 'basic-listing' }]
    : [{ slug: 'hot-listing' }, { slug: 'basic-listing' }];

  const formattedData = {
    id: platformSlug,
    slug: platformSlug,
    title: 'Listings',
    listing_breakdown: {
      title: 'Listings',
      main_title: capitalizeFirstLetter(platformSlug),
      total_title: 'Active',
      total_value: platformStats.active,
      purposes: [
        {
          icon: 'IconPropertyBuy',
          title: 'For Sale',
          iconProps: { size: '1.2em', color: '#28B16D' },
          value: platformStats?.sale || 0,
        },
        {
          id: 2,
          icon: 'IconPropertyRent',
          title: 'To Rent',
          iconProps: { size: '1.2em', color: '#479EEB' },
          value: platformStats?.rent || 0,
        },
        {
          id: 4,
          icon: 'IconRental',
          iconProps: { color: tenantTheme['color-for-rent'], hasBackground: true },
          title: 'Daily Rentals',
          value: platformStats?.daily_rental || 0,
        },
      ],
      products: tenantUtils.generateProductData(productsToShow),
    },
    area_breakdown: {
      title: 'Breakdown By Location',
      types: [
        { key: 'sale_breakdown_by_area', label: 'For Sale' },
        { key: 'rent_breakdown_by_area', label: 'To Rent' },
      ],
      data: {
        sale_breakdown_by_area: getAreaBreakdownData(
          areaStats?.listings?.platforms?.[platformSlug],
          'sale_breakdown_by_area',
        ),
        rent_breakdown_by_area: getAreaBreakdownData(
          areaStats?.listings?.platforms?.[platformSlug],
          'rent_breakdown_by_area',
        ),
      },
    },
  };
  formattedData.listing_breakdown.products.forEach((e) => {
    e.value = platformStats[e.slug_alt];
  });
  return formattedData;
};

const tableMapper = (e, stats, user, platform) => {
  const listingStats = stats?.find((it) => it?.ad_external_id == e?.id);
  return {
    ...e,
    id: e.id,
    type: e?.listing_type?.title,
    location: e?.location?.title,
    property: {
      id: e?.id,
      ...(e?.listing_purpose && {
        purpose: { title: e?.listing_purpose?.title, title_l1: e?.listing_purpose?.title_l1 },
      }),
      type: { title: e?.listing_type?.title, title_l1: e?.listing_type?.title_l1 },
      area: { value: e?.area_unit?.value, unit: e?.area_unit?.name },
      location: {
        ...e?.location,
        breadcrumb: e?.location?.breadcrumb
          ?.reverse()
          ?.filter((e) => e?.level > 1)
          ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
          ?.join(', '),
      },
      image: e?.image,
      price: { value: e.price, currency: tenantConstants.CURRENCY },
      details: {
        ...e?.rega_details?.property_specs,
        regaId: e?.ad_license,
        listingSpecs: tenantData?.getListingSpecs(e),
      },
      ...(e?.health && {
        health: e?.health,
      }),
      productsInfo: e?.platforms?.[platform]?.products_information,
    },
    platforms: {
      property_id: e?.id,
      ...(e?.listing_purpose && { purpose: e.listing_purpose }),
      ...(e?.listing_type && { type: e.listing_type }),
      price: { value: e?.price, currency: e?.currency },
      location: e.location,
      stories: e?.stories,
      stats: stats?.find((it) => it?.ad_external_id == e?.id),
      data: [
        ...(!!user?.products?.platforms?.[platform]
          ? [
              {
                id: e.id,
                property_id: e?.id,
                slug: platform,
                posted_on: e?.created_at || 'test',
                expiry_date: e?.expiry_date,
                status: tenantUtils.listingStatusMapper(e?.platform?.zameen?.status),
                posted: tenantTransformers.postedToBayut(e?.platform?.[platform]),
                views: listingStats?.sum_search_count,
                leads: listingStats?.sum_lead_count,
                clicks: listingStats?.sum_view_count,
                ctr: (listingStats?.sum_view_count / listingStats?.sum_search_count) * 100,
                calls: listingStats?.sum_phone_view_count,
                emails: listingStats?.sum_email_lead_count,
                sms: listingStats?.sum_sms_view_count,
                whatsapp: listingStats?.sum_whatsapp_view_count,
                chat: listingStats?.sum_chat_lead_count,
                category: listingStats?.platform?.[platform]?.mark?.title,
                icon: 'IconKSA',
                public_url: listingStats?.platform?.[platform]?.public_url,
              },
            ]
          : []),
      ],
    },
  };
};

const listingPerformanceBreakdownTableMapper = (listings, stats, user, platform) => {
  return {
    list: listings?.data?.listings?.map((e) => tableMapper(e, stats?.data?.stats?.items, user, platform)),
    pagination: tenantUtils.getPaginationObject(listings?.data?.pagination),
    table: [
      {
        title: 'Property',
        dataIndex: 'property',
        key: 'property',
        component: 'ListingPurpose',
        className: 'col-property',
      },

      {
        title: 'Posted On',
        dataIndex: 'platforms',
        key: 'posted_on',
        component: 'Date',
      },
      {
        title: 'Views',
        dataIndex: 'platforms',
        key: 'views',
        component: 'Stats',
      },
      {
        title: 'Clicks',
        dataIndex: 'platforms',
        key: 'clicks',
        component: 'Stats',
      },
      {
        title: 'All Leads',
        dataIndex: 'platforms',
        key: 'leads',
        component: 'Stats',
      },
      {
        title: 'Whatsapp',
        dataIndex: 'platforms',
        key: 'whatsapp',
        component: 'Stats',
      },
      {
        title: 'Calls',
        dataIndex: 'platforms',
        key: 'calls',
        component: 'Stats',
      },
      {
        title: 'SMS',
        dataIndex: 'platforms',
        key: 'sms',
        component: 'Stats',
      },
      {
        title: 'Emails',
        dataIndex: 'platforms',
        key: 'emails',
        component: 'Stats',
      },
    ],
  };
};

const listingBreakdownByDateTableMapper = (listings, params, platform) => {
  const list = Object?.keys(listings)?.map((item) => ({
    date: { value: item },
    active_listings: { value: listings?.[item]?.active || 0, dashForNone: true },
    sale: { value: listings?.[item]?.sale || 0, dashForNone: true },
    rent: { value: listings?.[item]?.rent || 0, dashForNone: true },
    featured: { value: listings?.[item]?.featured || 0, dashForNone: true },
    hot: { value: listings?.[item]?.hot || 0, dashForNone: true },
    basic: { value: listings?.[item]?.basic || 0, dashForNone: true },
    total: { value: listings?.[item]?.total || 0, dashForNone: true },
    photography: { value: listings?.[item]?.photography || 0, dashForNone: true },
    videography: { value: listings?.[item]?.videography || 0, dashForNone: true },
    refresh: { value: listings?.[item]?.refresh || 0, dashForNone: true },
  }));

  const pagination = {
    from: params?.page ? (params?.page - 1) * limit + 1 : 1,
    to: params?.page ? params?.page * limit : limit,
    current_page: parseInt(params.page ? params?.page : 1),
    per_page: limit,
    last_page: parseInt(list?.length / limit) + 1,
    total_pages: parseInt(list?.length / limit) + 1,
    total_records: list?.length,
  };

  const tableData = {
    list: list,
    pagination: tenantUtils.getPaginationObject(pagination),
    filtersData: {
      list: [
        {
          label: 'Listed Date',
          key: tenantConstants.VALUE_IN_ARRAY_KEY('date_between'),
          placeholder: 'Select Date Range',
          type: 'dateRange',
          showInSingleTag: true,
          labelProps: { muted: true },
          minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
          reportsStaticRanges: true,
          getTagContent: (value) => value,
        },
      ],
    },
    table: [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        component: 'Date',
      },
      {
        title: 'Listings',
        dataIndex: 'active_listings',
        key: 'active_listings',
        component: 'Number',
      },
      {
        title: 'Sale',
        dataIndex: 'sale',
        key: 'sale',
        component: 'Number',
      },
      {
        title: 'Rent',
        dataIndex: 'rent',
        key: 'rent',
        component: 'Number',
      },
      ...(platform == 'dubizzle'
        ? [
            {
              title: 'Featured',
              dataIndex: 'featured',
              key: 'featured',
              component: 'Number',
            },
          ]
        : [
            {
              title: 'Hot',
              dataIndex: 'hot',
              key: 'hot',
              component: 'Number',
            },
          ]),

      {
        title: 'Basic',
        dataIndex: 'basic',
        key: 'basic',
        component: 'Number',
      },
    ],
  };
  return tableData;
};

const getPageData = (pageNumber, last_page, data) => {
  let start_index = (pageNumber - 1) * limit;
  let end_index = pageNumber == last_page ? data?.length : pageNumber * limit;

  return data.slice(start_index, end_index);
};

const listingStatsByDataTableTransformer = (responseData, params, platformSlug) => {
  const tableDataOlx = tenantUtils.reportsData[platformSlug].leadTable();
  if (!responseData) {
    return { list: [], ...tableDataOlx };
  }
  const { items: grouped_stats, total } = responseData;
  if (total === 0) {
    const labels = getDateLabels(params?.start_date, params?.end_date);
    const list = labels.map((dateKey) => {
      return {
        key: `traffic-${dateKey}`,
        date: { value: dateKey },
        views: { value: 0 },
        clicks: { value: 0 },
        leads: { value: 0 },
        calls: { value: 0 },
        chats: { value: 0 },
        sms: { value: 0 },
        whatsapp: { value: 0 },
        email: { value: 0 },
      };
    });
    const paginate = {
      from: params?.page ? (params?.page - 1) * limit + 1 : 1,
      to: params?.page ? params?.page * limit : 10,
      current_page: parseInt(params.page ? params?.page : 1),
      per_page: limit,
      last_page: parseInt(list?.length / limit) + 1,
      total_pages: parseInt(list?.length / limit) + 1,
      total_records: list?.length,
    };

    return {
      list: getPageData(paginate?.current_page, paginate?.last_page, list.reverse()),
      pagination: tenantUtils.getPaginationObject(paginate),
      ...tableDataOlx,
    };
  }
  const dateKeys = Object.keys(grouped_stats);
  const list = dateKeys.map((dateKey) => {
    const {
      sum_chat_lead_count,
      sum_phone_view_count,
      sum_sms_view_count,
      sum_lead_count,
      sum_view_count,
      sum_search_count,
      sum_whatsapp_view_count,
      sum_email_lead_count,
    } = grouped_stats[dateKey];
    return {
      key: `traffic-${dateKey}`,
      date: { value: dateKey },
      views: { value: sum_search_count },
      clicks: { value: sum_view_count },
      leads: { value: sum_sms_view_count + sum_phone_view_count + sum_email_lead_count + sum_whatsapp_view_count || 0 },
      calls: { value: sum_phone_view_count || 0 },
      chats: { value: sum_chat_lead_count || 0 },
      sms: { value: sum_sms_view_count || 0 },
      whatsapp: { value: sum_whatsapp_view_count || 0 },
      emails: { value: sum_email_lead_count || 0 },
    };
  });
  const pagination = {
    from: params?.page ? (params?.page - 1) * limit + 1 : 1,
    to: params?.page ? params?.page * limit : 10,
    current_page: parseInt(params.page ? params?.page : 1),
    per_page: limit,
    last_page: parseInt(list?.length / limit) + 1,
    total_pages: parseInt(list?.length / limit) + 1,
    total_records: list?.length,
  };

  return {
    list: getPageData(pagination?.current_page, pagination?.last_page, list.reverse()),
    ...tableDataOlx,
    pagination: tenantUtils.getPaginationObject(pagination),
  };
};

export default {
  reportsGraphDataMapper,
  widgetParser,
  listingPerformanceBreakdownTableMapper,
  listingBreakdownByDateTableMapper,
  listingStatsByDataTableTransformer,
};
