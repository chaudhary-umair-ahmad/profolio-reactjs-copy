import tenantUtils from '@utils';
import tenantConstants from '@constants';
import tenantData from '@data';
import moment from 'moment';
import { getDateLabels } from '../../../utility/date';

const COLORS_ARRAY = ['#20C997', '#FA8B0C', '#5F63F2', '#1ce383', '#14449f'];

const limit = 10;

const getPageData = (pageNumber, last_page, data) => {
  let start_index = (pageNumber - 1) * limit;
  let end_index = pageNumber == last_page ? data?.length : pageNumber * limit;

  return data.slice(start_index, end_index);
};

const findProductSum = (grouped_stats, dateKey, filteredProducts) => {
  const sum = filteredProducts.reduce((acc, item) => {
    if (grouped_stats?.[dateKey]?.[item]) {
      return acc + grouped_stats[dateKey][item];
    } else {
      return acc;
    }
  }, 0);

  return sum;
};

const setLeadsData = (key, allStats, productWise) => {
  let leadsData;
  if (productWise && key != 'all') {
    leadsData =
      productWise?.sum_phone_view_count + productWise?.sum_sms_view_count + productWise?.sum_chat_lead_count || 0;
  } else if (!productWise && key != 'all') {
    leadsData = 0;
  } else if (key == 'all') {
    leadsData = allStats?.sum_phone_view_count + allStats?.sum_sms_view_count + allStats?.sum_chat_lead_count || 0;
  }
  return leadsData;
};

const reportsGraphDataMapper = (responseData, dataSummary, params) => {
  const data = {
    id: 'zameen',
    slug: 'zameen',
    icon: 'IconZameen',
    title: 'Analytics',
    data_summary: tenantUtils.generateDataSummaryFor('zameen', ['calls', 'whatsapp', 'sms', 'emails']),
    data_breakdown: tenantUtils.generateSecondChartDataBreakdownFor('zameen', ['views', 'clicks', 'leads']),
    reach_data: [
      {
        key: 'views',
        value: dataSummary?.views,
        percentage: dataSummary?.leads_data?.views,
        label: 'Views',
        title: 'Views',
        icon: 'IoMdEye',
        iconProps: { color: '#28b16d' },
        hit: true,
        id: 0,
        growth: dataSummary?.leads_data?.views > 0,
        since_when: '',
      },
      {
        key: 'clicks',
        value: dataSummary?.clicks,
        percentage: dataSummary?.leads_data?.clicks,
        label: 'Clicks',
        title: 'Clicks',
        icon: 'HiCursorClick',
        iconProps: { color: '#f0a742' },
        hit: true,
        id: 0,
        growth: dataSummary?.leads_data?.clicks > 0,
        since_when: '',
      },
      {
        key: 'leads',
        value: dataSummary?.leads,
        percentage: dataSummary?.leads_data?.leads,
        label: 'Leads',
        title: 'Leads',
        icon: 'MdPhone',
        iconProps: { color: '#479eeb' },
        hit: true,
        growth: dataSummary?.leads_data?.leads > 0,
        since_when: '',
      },
    ],
  };

  if (!responseData && !dataSummary) {
    return data;
  }

  const { result_group, purpose } = params;
  let grouped_stats = responseData;
  const summarydata = data.data_summary;
  const breakdowndata = data.data_breakdown;
  summarydata.forEach((performanceMetric, i) => {
    summarydata[i].value = dataSummary?.[performanceMetric?.key] || 0;
    summarydata[i].percentage = dataSummary?.leads_data?.[performanceMetric?.key];
    summarydata[i].growth = dataSummary?.leads_data?.[performanceMetric.key] > 0;
  });
  const purposeTypes = breakdowndata.purposes.map((e) => e.key);
  const performanceBy = breakdowndata.performanceBy.map((e) => {
    return e.key;
  });
  const marked = breakdowndata.types.map((e) => e.key);
  const dateKeys = Object.keys(grouped_stats);
  const labels = dateKeys.map((e) => {
    if (result_group === 'dd') {
      return moment(e).format('MMM-DD');
    }
    if (result_group === 'ww' || result_group === 'mm') {
      return moment(grouped_stats[e].start_date).format('MMM-DD');
    }
    if (result_group === 'yy') {
      return moment(grouped_stats[e].start_date).format('MMM-DD, YY');
    } else return moment(e).format('MMM-DD');
  });
  breakdowndata['labels'] = labels;
  const filteredProducts = marked.filter((item) => item != 'all');
  const dataKeysInitialData = {};
  marked.forEach((tab) => {
    dataKeysInitialData[tab] = [];
  });
  // purposeTypes.forEach(purposeKey => {
  performanceBy.forEach((performanceMetricKey) => {
    if (performanceMetricKey == 'leads') {
      let tabularData = {};
      summarydata.forEach((e) => {
        tabularData[e?.key] = { ...dataKeysInitialData };
      });
      dateKeys.forEach((dateKey) => {
        Object.keys(tabularData)?.forEach((tabKey) => {
          Object.keys(tabularData[tabKey]).forEach((key) => {
            if (key != 'all') {
              tabularData[tabKey][key] = [...(tabularData[tabKey][key] || []), grouped_stats?.[dateKey]?.[key] || 0];
            } else if (key == 'all') {
              tabularData[tabKey]['all'] = [
                ...(tabularData[tabKey]['all'] || []),
                findProductSum(grouped_stats, dateKey, filteredProducts) || 0,
              ];
            }
          });
        });
      });
      breakdowndata.data[performanceMetricKey] = tabularData;
    } else {
      marked.forEach((productKey) => {
        dateKeys.forEach((dateKey) => {
          breakdowndata.data[performanceMetricKey][productKey].push(
            productKey == 'all'
              ? findProductSum(grouped_stats, dateKey, filteredProducts) || 0
              : grouped_stats?.[dateKey]?.[productKey] || 0,
          );
        });
      });
    }
  });
  // });

  return data;
};

const reportsGraphDataMapperOlx = (responseData, summaryData, params) => {
  const olxData = {
    id: 'olx',
    slug: 'olx',
    icon: 'IconOLX',
    title: 'Analytics',
    reach_data: [
      {
        key: 'views',
        value: summaryData?.aggregates?.sum_search_count,
        percentage: summaryData?.trends?.sum_search_count,
        label: 'Views',
        title: 'Views',
        icon: 'IoMdEye',
        iconProps: { color: '#28b16d' },
        hit: true,
        id: 0,
        growth: summaryData?.trends?.sum_search_count > 0,
        since_when: '',
      },
      {
        key: 'clicks',
        value: summaryData?.aggregates?.sum_view_count,
        percentage: summaryData?.trends?.sum_view_count,
        label: 'Clicks',
        title: 'Clicks',
        icon: 'HiCursorClick',
        iconProps: { color: '#f0a742' },
        hit: true,
        id: 0,
        growth: summaryData?.trends?.sum_view_count > 0,
        since_when: '',
      },
      {
        key: 'leads',
        value: summaryData?.aggregates?.sum_lead_count,
        // percentage: summaryData?.trends?.sum_lead_count,
        label: 'Leads',
        title: 'Leads',
        icon: 'MdPhone',
        iconProps: { color: '#479eeb' },
        hit: true,
        //growth: summaryData?.trends?.sum_lead_count > 0,
        since_when: '',
      },
    ],
    data_summary: tenantUtils.generateDataSummaryFor('olx', [
      'leads',
      'sum_phone_view_count',
      'sum_sms_view_count',
      'sum_chat_lead_count',
    ]),
    data_breakdown: tenantUtils.generateSecondChartDataBreakdownFor('olx', ['leads', 'views', 'clicks']),
  };

  if (!summaryData || !responseData) {
    return olxData;
  }

  const lead_data = olxData.data_summary;
  const lead_breakdown_data = olxData.data_breakdown;
  const { items: grouped_stats, total } = responseData;
  const purposeTypes = lead_breakdown_data.purposes.map((e) => e.key);
  const performanceBy = lead_breakdown_data.performanceBy.map((e) => e.key);
  const marked = lead_breakdown_data.types.map((e) => e.key);
  const dataKeysInitialData = {};
  marked.forEach((tab) => {
    dataKeysInitialData[tab] = [];
  });
  let labels;
  if (total === 0) {
    labels = getDateLabels(params?.start_date, params?.end_date).map((date) => moment(date).format('MMM-DD'));
    lead_breakdown_data['labels'] = labels;
    // purposeTypes.forEach(purposeType => {
    performanceBy.forEach((performanceMetricKey) => {
      if (performanceMetricKey == 'leads') {
        let tabularData = {};
        lead_data.forEach((e) => {
          tabularData[e?.key] = { ...dataKeysInitialData };
        });
        labels.forEach((dateKey) => {
          Object.keys(tabularData)?.forEach((tabKey) => {
            Object.keys(tabularData[tabKey]).forEach((key) => {
              tabularData[tabKey][key] = [...tabularData[tabKey][key], 0];
            });
          });
        });
        lead_breakdown_data.data[performanceMetricKey] = tabularData;
      } else {
        marked.forEach((product) => {
          labels.forEach((dateKey) => {
            lead_breakdown_data.data[performanceMetricKey][product].push(0);
          });
        });
      }
    });
    // });
    return olxData;
  }

  const dateKeys = grouped_stats ? Object.keys(grouped_stats) : [];
  labels = dateKeys.map((e) => {
    return moment(e).format('MMM-DD');
  });
  lead_data.forEach((performanceMetric, i) => {
    let totalValue = 0;
    Object.keys(summaryData)
      .filter((key) => key !== 'trends')
      .forEach((productId) => {
        totalValue += summaryData?.[productId]?.[performanceMetric?.key] || 0;
      });

    lead_data[i].value = totalValue || 0;
    lead_data[i].percentage = summaryData?.['trends']?.[performanceMetric?.key];
    lead_data[i].growth = summaryData?.['trends']?.[performanceMetric?.key] > 0;
  });

  //TODO - Hard code set total lead key to sum to all leads values sum
  lead_data.forEach((performanceMetric, i) => {
    lead_data[0].value = Number(lead_data[0].value) + Number(lead_data[i].value) || 0;
  });

  //Setting Leads percentage as it will not be available in API
  let leadsPercentage = tenantUtils.calculateTotalChangePercentageLeads(
    lead_data[1].value,
    lead_data[2].value,
    lead_data[3].value,
    lead_data[1].percentage,
    lead_data[2].percentage,
    lead_data[3].percentage,
  );
  lead_data[0].percentage = leadsPercentage;
  lead_data[0].growth = leadsPercentage > 0;

  lead_breakdown_data['labels'] = labels;

  // purposeTypes.forEach(purposeType => {
  performanceBy?.forEach((performanceMetricKey) => {
    if (performanceMetricKey == 'leads') {
      let tabularData = {};
      lead_data.forEach((e) => {
        tabularData[e?.key] = { ...dataKeysInitialData };
      });
      grouped_stats &&
        Object.values(grouped_stats)?.forEach((value) => {
          Object.keys(tabularData)?.forEach((tabKey) => {
            Object.keys(tabularData[tabKey]).forEach((key) => {
              const obj = value?.product_wise?.find((productType) => {
                return productType?.ad_product === key;
              });
              if (tabKey == 'leads') {
                tabularData[tabKey][key] = [...(tabularData[tabKey][key] || []), setLeadsData(key, value, obj)];
              } else {
                const leadStatType = lead_data.find((e) => e.key == tabKey);
                if (obj && key != 'all') {
                  tabularData[tabKey][key] = [
                    ...(tabularData[tabKey][key] || []),
                    obj?.[leadStatType?.responseKey] || 0,
                  ];
                } else if (!obj && key != 'all') {
                  tabularData[tabKey][key] = [...(tabularData[tabKey][key] || []), 0];
                } else if (key == 'all') {
                  tabularData[tabKey]['all'] = [
                    ...(tabularData[tabKey]['all'] || []),
                    value?.[leadStatType?.responseKey] || 0,
                  ];
                }
              }
            });
          });
        });
      lead_breakdown_data.data[performanceMetricKey] = tabularData;
    } else {
      marked.forEach((product) => {
        dateKeys.forEach((dateKey) => {
          const statType = lead_breakdown_data.performanceBy.find((e) => e.key == performanceMetricKey);
          const olxProduct = grouped_stats[dateKey]?.product_wise?.find((item) => item.ad_product === product);
          lead_breakdown_data.data[performanceMetricKey][product].push(
            product == 'all'
              ? grouped_stats[dateKey]?.[statType?.responseKey] || 0
              : olxProduct?.[statType?.responseKey] || 0,
          );
        });
      });
    }
  });
  // });
  return olxData;
};

let data = {
  zameen: {
    id: 'zameen',
    slug: 'zameen',
    icon: 'IconZameen',
    title: 'Listings',
    listing_breakdown: {
      title: 'Listings',
      total_title: 'Total',
      total_title_icon: 'ActiveListingIcon',
      total_value: '',
      purposes: [
        {
          id: 1,
          icon: 'IconPropertyBuy',
          iconProps: { size: '1.2em', color: '#28b16d' },
          title: 'For Sale',
          value: '',
        },
        {
          id: 2,
          icon: 'IconPropertyRent',
          iconProps: { size: '1.2em', color: '#479eeb' },
          title: 'For Rent',
          value: '',
        },
      ],
      products: [
        { id: 1, icon: 'IconSuperHot', iconProps: { size: '1.2em', color: '#c00' }, title: 'Super Hot', value: '' },
        { id: 2, icon: 'IconHot', iconProps: { size: '1.2em', color: '#ffa900' }, title: 'Hot', value: '' },
      ],
    },
    area_breakdown: {
      title: 'Breakdown By Area',
      icon_data: {
        icon_props: {
          hasBackground: true,
          iconBackgroundColor: '#fff',
        },
      },
      types: [
        { id: 1, key: 'sale_breakdown_by_area', label: 'For Sale' },
        { id: 2, key: 'rent_breakdown_by_area', label: 'For Rent' },
      ],
      data: {
        sale_breakdown_by_area: {
          total: '',
          chart: { labels: [], dataset: [] },
          locations: [],
          backgroundColor: COLORS_ARRAY,
        },
        rent_breakdown_by_area: {
          total: '',
          chart: { labels: [], dataset: [] },
          locations: [],
          backgroundColor: COLORS_ARRAY,
        },
      },
    },
  },
  olx: {
    id: 'olx',
    slug: 'olx',
    icon: 'IconOLX',
    title: 'Listings',
    listing_breakdown: {
      title: 'Listings',
      total_title: 'Total',
      total_title_icon: 'ActiveListingIcon',
      total_value: '',
      purposes: [
        {
          id: 1,
          icon: 'IconPropertyBuy',
          iconProps: { size: '1.2em', color: '#28B16D' },
          title: 'For Sale',
          value: '',
        },
        {
          id: 2,
          icon: 'IconPropertyRent',
          iconProps: { size: '1.2em', color: '#479EEB' },
          title: 'For Rent',
          value: '',
        },
      ],
      products: [
        {
          id: 1,
          icon: 'IconF',
          iconProps: {
            hasBackground: true,
            color: '#1f1f1f',
            size: '1em',
            style: {
              '--icon-bg-color': '#ffec74',
              padding: 4,
            },
          },
          title: 'Featured',
          value: '',
        },
        {
          id: 2,
          icon: 'IconS',
          iconProps: {
            hasBackground: true,
            color: '#1f1f1f',
            size: '1em',
            style: {
              '--icon-bg-color': '#f0f0f0',
              padding: 4,
            },
          },
          title: 'Standard',
          value: '',
        },
      ],
    },
    area_breakdown: {
      title: 'Breakdown By Area',
      icon_data: {
        icon_props: {
          hasBackground: true,
          iconBackgroundColor: '#fff',
        },
      },
      types: [
        { id: 1, key: 'sale_breakdown_by_area', label: 'For Sale' },
        { id: 2, key: 'rent_breakdown_by_area', label: 'For Rent' },
      ],
      data: {
        sale_breakdown_by_area: {
          total: '',
          chart: { labels: [], dataset: [] },
          locations: [],
          backgroundColor: COLORS_ARRAY,
        },
        rent_breakdown_by_area: {
          total: '',
          chart: { labels: [], dataset: [] },
          locations: [],
          backgroundColor: COLORS_ARRAY,
        },
      },
    },
  },
};

const ITEMS_COUNT = COLORS_ARRAY.length;

const pushPropertyTypeByBreakdown = (key, listings, currentPlatform, currentPlatformData, keyValue) => {
  let dataset = [];
  const others = { label: 'Others', data: 0 };
  const locations = listings?.[currentPlatform]?.[key];
  const locationsDataList = [];
  Object?.keys(listings?.[currentPlatform]?.[key])?.length &&
    Object?.keys(listings?.[currentPlatform]?.[key])?.forEach((e) =>
      locationsDataList.push({ title: e, count: locations?.[e]?.count, percentage: locations?.[e]?.percentage }),
    );
  locationsDataList.sort((a, b) => b.count - a.count);
  locationsDataList.forEach((location, index) => {
    if (index < ITEMS_COUNT) {
      dataset.push({ label: location?.title, data: location?.count });
    } else {
      others.data = others.data + location?.count;
    }
  });
  others.data && dataset.push(others);
  currentPlatformData.area_breakdown.data[key].locations = dataset;
  currentPlatformData.area_breakdown.data[key].chart.labels = dataset.map((e) => e.label);
  currentPlatformData.area_breakdown.data[key].chart.dataset = dataset.map((e) => e.data);
  currentPlatformData.area_breakdown.data[key].total = listings[currentPlatform]?.[keyValue];
};

const widgetParser = (listings, platformKey) => {
  let platformWidgetData = JSON.parse(JSON.stringify(data[platformKey]));

  platformWidgetData.listing_breakdown.total_value = listings?.[platformKey].total;
  platformWidgetData.listing_breakdown.purposes[0].value = listings?.[platformKey]?.sale;
  platformWidgetData.listing_breakdown.purposes[1].value = listings?.[platformKey]?.rent;
  platformWidgetData.listing_breakdown.products[0].value =
    platformKey === 'zameen' ? listings?.[platformKey]?.superhot : listings?.[platformKey]?.featured;
  platformWidgetData.listing_breakdown.products[1].value =
    platformKey === 'zameen'
      ? listings?.[platformKey]?.hot
      : listings?.[platformKey]?.sale + listings?.[platformKey]?.rent;
  pushPropertyTypeByBreakdown('rent_breakdown_by_area', listings, platformKey, platformWidgetData, 'rent');
  pushPropertyTypeByBreakdown('sale_breakdown_by_area', listings, platformKey, platformWidgetData, 'sale');
  return platformWidgetData;
};

const listingBreakdownByDateTableMapper = (listings, params) => {
  const list = Object?.keys(listings)?.map((item) => ({
    date: { value: item },
    zameen_listings: { value: listings?.[item]?.zameen_listings || 0, dashForNone: true },
    olx_listings: { value: listings?.[item].olx_listings || 0, dashForNone: true },
    sale: {
      value: listings?.[item]?.sale || 0,
      dashForNone: true,
    },
    rent: {
      value: listings?.[item]?.rent || 0,
      dashForNone: true,
    },
    super_hot: {
      value: listings?.[item]?.super_hot || 0,
      dashForNone: true,
    },
    hot: {
      value: listings?.[item]?.hot || 0,
      dashForNone: true,
    },
    featured: {
      value: listings?.[item]?.featured || 0,
      dashForNone: true,
    },
    total_listings: {
      value: (listings?.[item]?.zameen_listings || 0) + (listings?.[item]?.olx_listings || 0),
      dashForNone: true,
    },
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
    list: getPageData(pagination?.current_page, pagination?.last_page, list.reverse()),
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
        title: 'Zameen Listings',
        dataIndex: 'zameen_listings',
        key: 'zameen_listings',
        component: 'Number',
      },
      {
        title: 'OLX Listings',
        dataIndex: 'olx_listings',
        key: 'olx_listings',
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
      {
        title: 'Super Hot',
        dataIndex: 'super_hot',
        key: 'super_hot',
        component: 'Number',
      },
      {
        title: 'Hot',
        dataIndex: 'hot',
        key: 'hot',
        component: 'Number',
      },
      {
        title: 'Featured',
        dataIndex: 'featured',
        key: 'featured',
        component: 'Number',
      },
      {
        title: 'Total Listings',
        dataIndex: 'total_listings',
        key: 'total_listings',
        component: 'Number',
      },
    ],
  };

  return tableData;
};

const tableMapper = (e, stats, user) => {
  const listingStats = stats?.find(
    (it) => it?.ad_external_id == e?.id || it?.ad_external_id == e?.platform?.['olx']?.platform_listing_id,
  );
  return {
    ...e,
    id: e.id,
    type: e?.listing_type?.title,
    location: e?.location?.title,
    property: {
      id: e?.id,
      ...(e?.listing_purpose && { purpose: { title: e?.listing_purpose?.title } }),
      type: { title: e?.listing_type?.title },
      area: { value: e?.area_unit_value, unit: e?.area_unit },
      location: {
        ...e?.location,
        breadcrumb: e?.location?.breadcrumb
          ?.filter((e) => e?.level > 1)
          ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
          ?.join(', '),
      },
      details: {
        listingSpecs: tenantData?.getListingSpecs(e),
      },
      image: e?.images?.find((e) => e?.is_main_image === 1),
      imageCount: e?.images_count,
      price: { value: e.price, currency: e?.currency },
      ...(e?.listing_health && {
        health: e?.listing_health,
      }),
    },
    platforms: {
      property_id: e?.id,
      ...(e?.listing_purpose && { purpose: e.listing_purpose }),
      ...(e?.listing_type && { type: e.listing_type }),
      price: { value: e?.price, currency: e?.currency },
      location: e.location,
      stories: e?.stories,
      stats: e?.listing_stats,
      data: [
        ...(!!user.products.platforms['zameen']
          ? [
              {
                id: e.id,
                property_id: e?.id,
                slug: 'zameen',
                posted_on: e?.created_at,
                expiry_date: e?.expiry_date,
                status: tenantUtils.listingStatusMapper(e?.platform?.zameen?.status),
                statusKey: 'status',
                posted: tenantUtils.postedToZameen(e?.platform?.['zameen']),
                views: e?.listing_stats?.imp_total,
                leads:
                  e?.listing_stats?.whatsapp_total +
                  e?.listing_stats?.sms_total +
                  e?.listing_stats?.email_total +
                  e?.listing_stats?.phone_total,
                clicks: e?.listing_stats?.views_count,
                ctr: (e?.listing_stats?.views_count / e?.listing_stats?.imp_total) * 100,
                calls: e?.listing_stats?.phone_total,
                emails: e?.listing_stats?.email_total,
                sms: e?.listing_stats?.sms_total,
                whatsapp: e?.listing_stats?.whatsapp_total,
                category: e?.platform?.['zameen']?.mark?.title,
                icon: 'IconZameen',
                public_url: e?.platform?.['zameen']?.public_url,
              },
            ]
          : []),
        ...(!!user.products.platforms['olx']
          ? [
              {
                id: e?.olx?.id,
                property_id: e?.id,
                slug: 'olx',
                posted: tenantUtils.postedToOLX(e?.platform?.olx?.status),
                status: tenantUtils.listingStatusMapper(e?.platform?.olx?.status),
                statusKey: 'status',
                posted_on: e?.platform?.olx?.date_added,
                views: listingStats?.sum_search_count,
                leads:
                  listingStats?.sum_phone_view_count +
                  listingStats?.sum_sms_view_count +
                  listingStats?.sum_chat_lead_count,
                clicks: listingStats?.sum_view_count,
                ctr: (listingStats?.sum_view_count / listingStats?.sum_search_count) * 100,
                calls: listingStats?.sum_phone_view_count,
                emails: listingStats?.sum_email_view_count,
                sms: listingStats?.sum_sms_view_count,
                whatsapp: listingStats?.sum_whatsapp_view_count,
                chat: listingStats?.sum_chat_lead_count,

                statsError: false,
                category: e?.platform?.olx?.mark?.title,
                public_url: e?.platform?.olx?.public_url,
                icon: 'IconOLX',
              },
            ]
          : []),
      ],
    },
  };
};

const listingPerformanceBreakdownTableMapper = (listings, listingStats, user) => {
  return {
    list: listings?.data?.listings?.map((e) => tableMapper(e, listingStats?.data?.stats?.items, user)),
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
        title: 'Platform',
        dataIndex: 'platforms',
        key: 'platform',
        component: 'Platform',
      },
      {
        title: 'Status',
        dataIndex: 'platforms',
        key: 'status',
        component: 'PlatformStatus',
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
        title: 'Calls',
        dataIndex: 'platforms',
        key: 'calls',
        component: 'Stats',
      },
      {
        title: 'Whatsapp',
        dataIndex: 'platforms',
        key: 'whatsapp',
        component: 'Stats',
      },
      {
        title: 'Emails',
        dataIndex: 'platforms',
        key: 'emails',
        component: 'Stats',
      },
      {
        title: 'SMS',
        dataIndex: 'platforms',
        key: 'sms',
        component: 'Stats',
      },
      {
        title: 'Chat',
        dataIndex: 'platforms',
        key: 'chat',
        component: 'Stats',
      },
    ],
  };
};

const listingStatsByDataTableTransformer = (responseData, params) => {
  const tableData = tenantUtils.reportsData['zameen'].leadTable();

  const dateKeys = Object.keys(responseData);

  const list = dateKeys.map((dateKey, i) => {
    const { leads, calls, emails, whatsapp, sms } = responseData?.[dateKey];
    return {
      key: `leads-${i}`,
      date: { value: dateKey },
      leads: { value: leads || 0 },
      calls: { value: calls || 0 },
      emails: { value: emails || 0 },
      whatsapp: { value: whatsapp || 0 },
      sms: { value: sms || 0 },
    };
  });
  const pagination = {
    from: params?.page ? (params?.page - 1) * limit + 1 : 1,
    to: params?.page ? params?.page * limit : 10,
    current_page: parseInt(params?.page ? params?.page : 1),
    per_page: limit,
    last_page: parseInt(list?.length / limit) + 1,
    total_pages: parseInt(list?.length / limit) + 1,
    total_records: list?.length,
  };

  return {
    list: getPageData(pagination?.current_page, pagination?.last_page, list?.reverse()),
    ...tableData,
    pagination: tenantUtils.getPaginationObject(pagination),
  };
};

const listingStatsByDataTableTransformerForOlx = (responseData, params) => {
  const tableDataOlx = tenantUtils.reportsData['olx'].leadTable();
  if (!responseData) {
    return { list: [], ...tableDataOlx };
  }
  const { items: grouped_stats, total } = responseData;
  if (!grouped_stats || grouped_stats?.length == 0) {
    const labels = getDateLabels(params?.start_date, params?.end_date);
    const list = labels.map((dateKey) => {
      return {
        key: `traffic-${dateKey}`,
        date: { value: dateKey },
        calls: { value: 0 },
        chats: { value: 0 },
        sms: { value: 0 },
        leads: { value: 0 },
      };
    });
    return { list, ...tableDataOlx };
  }
  const dateKeys = Object.keys(grouped_stats);
  const list = dateKeys.map((dateKey) => {
    const { sum_chat_lead_count, sum_phone_view_count, sum_sms_view_count } = grouped_stats[dateKey];
    return {
      key: `traffic-${dateKey}`,
      date: { value: dateKey },
      calls: { value: sum_phone_view_count || 0 },
      chats: { value: sum_chat_lead_count || 0 },
      sms: { value: sum_sms_view_count || 0 },
      leads: { value: sum_sms_view_count + sum_chat_lead_count + sum_phone_view_count || 0 },
    };
  });
  const pagination = {
    from: params?.page ? (params?.page - 1) * limit + 1 : 1,
    to: params?.page ? params?.page * limit : 10,
    current_page: parseInt(params.page ? params?.page : 1),
    per_page: limit,
    last_page: list?.length % limit > 0 ? parseInt(list?.length / limit) + 1 : parseInt(list?.length / limit),
    total_pages: list?.length % limit > 0 ? parseInt(list?.length / limit) + 1 : parseInt(list?.length / limit),
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
  reportsGraphDataMapperOlx,
  widgetParser,
  listingBreakdownByDateTableMapper,
  listingPerformanceBreakdownTableMapper,
  listingStatsByDataTableTransformer,
  listingStatsByDataTableTransformerForOlx,
};
