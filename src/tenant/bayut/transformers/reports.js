import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { capitalizeFirstLetter } from '../../../utility/utility';
import tenantTransformers from '@transformers';

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
  const othersData = sortedList?.length > COLORS_ARRAY.length ? { label: 'Others', data: othersDataValue } : null;
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

const widgetParser = (data, user) => {
  const { areaStats, listings } = data;
  const [platformKey, platformStats] = Object.entries(listings?.stats || {})?.[0];
  const productsToShow = user?.isCurrencyUser
    ? [{ slug: 'signature-listing' }, { slug: 'hot-listing' }, { slug: 'basic-listing' }]
    : [{ slug: 'hot-listing' }, { slug: 'basic-listing' }];

  const formattedData = {
    id: platformKey,
    slug: platformKey,
    title: 'Listings',
    listing_breakdown: {
      title: 'Listings',
      main_title: capitalizeFirstLetter(platformKey),
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
        sale_breakdown_by_area: getAreaBreakdownData(areaStats?.listings?.[platformKey], 'sale_breakdown_by_area'),
        rent_breakdown_by_area: getAreaBreakdownData(areaStats?.listings?.[platformKey], 'rent_breakdown_by_area'),
      },
    },
  };
  formattedData.listing_breakdown.products.forEach((e) => {
    e.value = platformStats[e.slug_alt];
  });
  return formattedData;
};

const tableMapper = (e, stats, user) => {
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
        permit_number: e?.permit_number,
        listingSpecs: tenantData?.getListingSpecs(e),
      },
      ...(e?.health && {
        health: e?.health,
      }),
      productsInfo: e?.platforms?.ksa?.products_information, //Pending
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
        ...(!!user?.products?.platforms?.['ksa']
          ? [
              {
                id: e.id,
                property_id: e?.id,
                slug: 'ksa',
                posted_on: e?.created_at || 'test',
                expiry_date: e?.expiry_date,
                status: tenantUtils.listingStatusMapper(e?.platform?.zameen?.status),
                posted: tenantTransformers.postedToBayut(e?.platform?.['ksa']),
                views: listingStats?.sum_search_count,
                leads: listingStats?.sum_lead_count,
                clicks: listingStats?.sum_view_count,
                ctr: (listingStats?.sum_view_count / listingStats?.sum_search_count) * 100,
                calls: listingStats?.sum_phone_view_count,
                emails: listingStats?.sum_email_lead_count,
                sms: listingStats?.sum_sms_view_count,
                whatsapp: listingStats?.sum_whatsapp_view_count,
                chat: listingStats?.sum_chat_lead_count,
                category: listingStats?.platform?.['ksa']?.mark?.title,
                icon: 'IconKSA',
                public_url: listingStats?.platform?.['ksa']?.public_url,
              },
            ]
          : []),
      ],
    },
  };
};

const listingPerformanceBreakdownTableMapper = (listings, stats, user) => {
  return {
    list: listings?.data?.listings?.map((e) => tableMapper(e, stats?.data?.stats?.items, user)),
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

const listingBreakdownByDateTableMapper = (listings, paging, params) => {
  const list = Object?.keys(listings)?.map((item) => ({
    date: { value: item },
    active_listings: { value: listings?.[item]?.active || 0, dashForNone: true },
    sale: { value: listings?.[item]?.sale || 0, dashForNone: true },
    rent: { value: listings?.[item]?.rent || 0, dashForNone: true },
    signature: { value: listings?.[item]?.signature || 0, dashForNone: true },
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
    total_pages: paging?.total_pages || parseInt(list?.length / limit) + 1,
    total_records: paging?.total_count || list?.length,
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
      {
        title: 'Signature',
        dataIndex: 'signature',
        key: 'signature',
        component: 'Number',
      },
      {
        title: 'Hot',
        dataIndex: 'hot',
        key: 'hot',
        component: 'Number',
      },
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

export default {
  widgetParser,
  listingPerformanceBreakdownTableMapper,
  listingBreakdownByDateTableMapper,
};
