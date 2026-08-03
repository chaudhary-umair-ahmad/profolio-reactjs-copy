import store from '@store';
import tenantData from '@data';
import tenantConstants from '@constants';
import { t } from 'i18next';
import set from 'lodash/set';
import { PERMISSIONS_TYPE } from '../../../constants/permissions';
import { strings } from '../../../constants/strings';
import { getVariousDates } from '../../../utility/date';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import { convertArrayToQueryString } from '../../../utility/utility';

export const generateProductData = (productsArr) => {
  const allProducts = tenantData.products; //TODO Rtkq
  let productList = [];
  productsArr.forEach((product, i) => {
    const found = !!allProducts?.length && allProducts.find((item) => item.slug === product.slug);
    if (found) {
      productList.push({
        id: i,
        ...found,
        value: '',
        title: found.name,
      });
    }
  });
  return productList;
};

export const calculateTotalChangePercentage = (finalClicks, finalViews, percentChangeClicks, percentChangeViews) => {
  if (!Number(percentChangeClicks) || !Number(percentChangeViews)) {
    return null;
  } else {
    const initialClicks = Number(finalClicks) / (1 + Number(percentChangeClicks) / 100);
    const initialViews = Number(finalViews) / (1 + Number(percentChangeViews) / 100);

    const totalInitialValue = initialClicks + initialViews;
    const totalFinalValue = Number(finalClicks) + Number(finalViews);

    const totalChange = totalFinalValue - totalInitialValue;
    const totalChangePercentage = (totalChange / totalInitialValue) * 100;

    return totalChangePercentage;
  }
};

export const calculateTotalChangePercentageLeads = (
  finalCalls,
  finalSms,
  finalChat,
  percentChangeCalls,
  percentChangeSms,
  percentChangeChat,
) => {
  let arr = [
    { key: 'percentChangeCalls', percentage: Number(percentChangeCalls), value: Number(finalCalls) },
    { key: 'percentChangeSms', percentage: Number(percentChangeSms), value: Number(finalSms) },
    { key: 'percentChangeChat', percentage: Number(percentChangeChat), value: Number(finalChat) },
  ];

  let availablePercentages = arr.filter((e) => !!e.percentage);
  if (availablePercentages?.length) {
    let totalInitialValue = 0;
    availablePercentages.forEach((e) => {
      totalInitialValue += e.value / (1 + e.percentage / 100);
    });
    let totalFinalValue = 0;
    availablePercentages.forEach((e) => {
      totalFinalValue += e.value;
    });
    const totalChange = totalFinalValue - totalInitialValue;
    const totalChangePercentage = (totalChange / totalInitialValue) * 100;
    return totalChangePercentage;
  } else {
    return null;
  }
};

export const calculateCTRPercentageChange = (finalClicks, finalViews, percentChangeClicks, percentChangeViews) => {
  if (!Number(percentChangeClicks) || !Number(percentChangeViews)) {
    return null;
  } else {
    const initialClicks = Number(finalClicks) / (1 + Number(percentChangeClicks) / 100);
    const initialViews = Number(finalViews) / (1 + Number(percentChangeViews) / 100);

    const initialCTR = initialClicks / initialViews;

    const finalCTR = Number(finalClicks) / Number(finalViews);
    const ctrPercentageChange = ((finalCTR - initialCTR) / initialCTR) * 100;

    return ctrPercentageChange;
  }
};

export const reportsData = {
  bayut: {
    initialFilter: {
      lead: {
        purpose: 'all',
        stat: 'views',
        date_between: getVariousDates(29),
      },
      traffic: {
        date_between: getVariousDates(29),
        purpose: 'all',
        // stat: 'views',
      },
    },
    purposeTabs: [
      { key: 'all', value: 'All', label: 'All', hit: true },
      { key: 'sale', value: 'Sale', label: 'For Sale', hit: true },
      { key: 'rent', value: 'Rent', label: 'To Rent', hit: true },
    ],
    performanceBy: [
      {
        key: 'views',
        value: 'Views',
        label: 'Views',
        title: 'Views',
        icon: 'RiWhatsappLine',
        responseKey: 'sum_search_count',
      },
      {
        key: 'clicks',
        value: 'Clicks',
        label: 'Clicks',
        title: 'Clicks',
        icon: 'MdPhone',
        responseKey: 'sum_view_count',
      },
      {
        key: 'leads',
        value: 'Leads',
        label: 'Leads',
        title: 'Leads',
        icon: 'MdSms',
        responseKey: 'sum_lead_count',
        hasSourceBifurcation: true,
      },
    ],
    statTabs: [
      { key: 'reach', value: 'Reach', label: 'Reach', title: 'Reach', icon: 'MdVisibility' },
      { key: 'views', value: 'Views', label: 'Views', title: 'Views', icon: 'MdVisibility' },
      { key: 'clicks', value: 'Clicks', label: 'Clicks', title: 'Clicks', icon: 'MdAdsClick' },
      { key: 'leads', value: 'Leads', label: 'Leads', title: 'Leads', icon: 'MdPermPhoneMsg' },

      {
        key: 'ctr',
        value: 'CTR',
        label: 'Click through Rate (CTR)',
        title: 'Click through Rate (CTR)',
        icon: 'MdVisibility',
        hit: true,
        unit: '%',
      },
      { key: 'emails', value: 'Emails', label: 'Emails', title: 'Emails', icon: 'MdEmail', hit: true },
      { key: 'calls', value: 'Calls', label: 'Calls', title: 'Calls', icon: 'MdPhone', hit: true },
      {
        key: 'whatsapp',
        value: 'WhatsApp',
        label: 'WhatsApp',
        title: 'WhatsApp',
        icon: 'RiWhatsappLine',
        hit: true,
      },
      { key: 'sms', value: 'SMS', label: 'SMS', title: 'SMS', icon: 'MdSms', hit: true },
    ],
    productTabs() {
      return [
        {
          key: 'premium',
          value: 'premium',
          label: 'Basic',
          borderColor: '#00ace6',
          backgroundColor: '#80dfff',
        },
        {
          key: 'hot',
          value: 'hot',
          label: 'Hot',
          borderColor: '#f73131',
          backgroundColor: '#f73131',
        },
      ];
    },
    trafficTable() {
      const userList = store.getState().app.userGroup.list;
      const user = store.getState().app.loginUser.user;

      return {
        filtersData: {
          list: [
            {
              label: strings.reports_listed_date,
              key: 'date_between',
              placeholder: strings.placeholders.listed_date,
              type: 'dateRange',
              showInSingleTag: true,
              labelProps: { muted: true },
              minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
              reportsStaticRanges: true,
            },
            ...(user?.permissions?.[PERMISSIONS_TYPE.STATS]
              ? [
                  {
                    label: strings.users,
                    list: userList,
                    type: 'select',
                    key: tenantConstants.VALUE_IN_ARRAY_KEY('user_id'),
                    placeholder: strings.placeholders.users,
                    box_title: 'All Users',
                    labelProps: { muted: true },
                    singleValue: true,
                    showTag: true,
                    getOptionLabel: (op) => {
                      return `${op.name} ${op.id === user?.id ? t('(Me)') : ''}`;
                    },
                  },
                ]
              : []),
            {
              label: strings.purpose,
              list: tenantData.purposeList,
              type: 'select',
              key: 'purpose',
              placeholder: strings.placeholders.purpose,
              box_title: 'Purpose',
              singleValue: true,
              labelProps: { muted: true },
              showTag: true,
            },
          ],
        },
        table: [
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            component: 'String',
          },
          {
            title: 'Property Views',
            dataIndex: 'views',
            key: 'views',
            component: 'Number',
          },
          {
            title: 'Property Clicks',
            dataIndex: 'traffic',
            key: 'traffic',
            component: 'Number',
          },
          {
            title: 'CTR',
            dataIndex: 'ctr',
            key: 'ctr',
            component: 'Number',
          },
        ],
      };
    },
    leadTable() {
      return {
        table: [
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            component: 'Date',
          },
          {
            title: 'Calls',
            dataIndex: 'calls',
            key: 'calls',
            component: 'Number',
          },
          {
            title: 'Emails',
            dataIndex: 'emails',
            key: 'emails',
            component: 'Number',
          },
          {
            title: 'SMS',
            dataIndex: 'sms',
            key: 'sms',
            component: 'Number',
          },
          {
            title: 'WhatsApp',
            dataIndex: 'whatsapp',
            key: 'hot',
            component: 'Number',
          },
          {
            title: 'Total Leads',
            dataIndex: 'leads',
            key: 'leads',
            component: 'Number',
          },
        ],
      };
    },
  },
  dubizzle: {
    initialFilter: {
      lead: {
        purpose: 'all',
        stat: 'views',
        date_between: getVariousDates(29),
      },
      traffic: {
        date_between: getVariousDates(29),
        purpose: 'all',
        // stat: 'views',
      },
    },
    purposeTabs: [
      { key: 'all', value: 'All', label: 'All', hit: true },
      { key: 'sale', value: 'Sale', label: 'For Sale', hit: true },
      { key: 'rent', value: 'Rent', label: 'To Rent', hit: true },
    ],
    performanceBy: [
      {
        key: 'views',
        value: 'Views',
        label: 'Views',
        title: 'Views',
        icon: 'RiWhatsappLine',
        responseKey: 'sum_search_count',
      },
      {
        key: 'clicks',
        value: 'Clicks',
        label: 'Clicks',
        title: 'Clicks',
        icon: 'MdPhone',
        responseKey: 'sum_view_count',
      },
      {
        key: 'leads',
        value: 'Leads',
        label: 'Leads',
        title: 'Leads',
        icon: 'MdSms',
        responseKey: 'sum_lead_count',
        hasSourceBifurcation: true,
      },
    ],
    statTabs: [
      { key: 'reach', value: 'Reach', label: 'Reach', title: 'Reach', icon: 'MdVisibility' },
      { key: 'views', value: 'Views', label: 'Views', title: 'Views', icon: 'MdVisibility' },
      { key: 'clicks', value: 'Clicks', label: 'Clicks', title: 'Clicks', icon: 'MdAdsClick' },
      { key: 'leads', value: 'Leads', label: 'Leads', title: 'Leads', icon: 'MdPermPhoneMsg' },

      {
        key: 'ctr',
        value: 'CTR',
        label: 'Click through Rate (CTR)',
        title: 'Click through Rate (CTR)',
        icon: 'MdVisibility',
        hit: true,
        unit: '%',
      },
      { key: 'emails', value: 'Emails', label: 'Emails', title: 'Emails', icon: 'MdEmail', hit: true },
      { key: 'calls', value: 'Calls', label: 'Calls', title: 'Calls', icon: 'MdPhone', hit: true },
      {
        key: 'whatsapp',
        value: 'WhatsApp',
        label: 'WhatsApp',
        title: 'WhatsApp',
        icon: 'RiWhatsappLine',
        hit: true,
      },
      { key: 'sms', value: 'SMS', label: 'SMS', title: 'SMS', icon: 'MdSms', hit: true },
    ],
    productTabs() {
      return [
        {
          key: 'premium',
          value: 'premium',
          label: 'Basic',
          borderColor: '#00ace6',
          backgroundColor: '#80dfff',
        },
        {
          key: 'featured',
          value: 'featured',
          label: 'Featured',
          borderColor: '#FFBA3C',
          backgroundColor: '#FFBA3C',
        },
      ];
    },
    trafficTable() {
      const userList = store.getState().app.userGroup.list;
      const user = store.getState().app.loginUser.user;

      return {
        filtersData: {
          list: [
            {
              label: strings.reports_listed_date,
              key: 'date_between',
              placeholder: strings.placeholders.listed_date,
              type: 'dateRange',
              showInSingleTag: true,
              labelProps: { muted: true },
              minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
              reportsStaticRanges: true,
            },
            ...(user?.permissions?.[PERMISSIONS_TYPE.STATS]
              ? [
                  {
                    label: strings.users,
                    list: userList,
                    type: 'select',
                    key: tenantConstants.VALUE_IN_ARRAY_KEY('user_id'),
                    placeholder: strings.placeholders.users,
                    box_title: 'All Users',
                    labelProps: { muted: true },
                    singleValue: true,
                    showTag: true,
                    getOptionLabel: (op) => {
                      return `${op.name} ${op.id === user?.id ? t('(Me)') : ''}`;
                    },
                  },
                ]
              : []),
            {
              label: strings.purpose,
              list: tenantData.purposeList,
              type: 'select',
              key: 'purpose',
              placeholder: strings.placeholders.purpose,
              box_title: 'Purpose',
              singleValue: true,
              labelProps: { muted: true },
              showTag: true,
            },
          ],
        },
        table: [
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            component: 'String',
          },
          {
            title: 'Property Views',
            dataIndex: 'views',
            key: 'views',
            component: 'Number',
          },
          {
            title: 'Property Clicks',
            dataIndex: 'traffic',
            key: 'traffic',
            component: 'Number',
          },
          {
            title: 'CTR',
            dataIndex: 'ctr',
            key: 'ctr',
            component: 'Number',
          },
        ],
      };
    },
    leadTable() {
      return {
        table: [
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            component: 'Date',
          },
          {
            title: 'Calls',
            dataIndex: 'calls',
            key: 'calls',
            component: 'Number',
          },
          {
            title: 'Emails',
            dataIndex: 'emails',
            key: 'emails',
            component: 'Number',
          },
          {
            title: 'SMS',
            dataIndex: 'sms',
            key: 'sms',
            component: 'Number',
          },
          {
            title: 'WhatsApp',
            dataIndex: 'whatsapp',
            key: 'hot',
            component: 'Number',
          },
          {
            title: 'Total Leads',
            dataIndex: 'leads',
            key: 'leads',
            component: 'Number',
          },
        ],
      };
    },
  },
};

export const generateDataSummaryFor = (platform, statsArr = reportsData[platform]) => {
  const { statTabs } = reportsData[platform];
  const stats = [];
  statsArr.forEach((stat, index) => {
    const pushStat = statTabs.find((item) => item.key === stat);
    if (pushStat) {
      stats.push({ ...pushStat, id: index, value: 0, percentage: null, growth: false, since_when: '' });
    }
  });
  return stats;
};

export const generateChartDataBreakdownFor = (platform, statsArr) => {
  const user = store.getState().app.loginUser?.user;
  const { purposeTabs } = reportsData[platform];
  const productTabs = reportsData[platform]?.productTabs(user?.isCurrencyUser);

  const statTabs = [];
  statsArr.forEach((statKey) => {
    const pushStat = reportsData[platform].statTabs.find((item) => item.key === statKey);
    if (pushStat) {
      statTabs.push(pushStat);
    }
  });

  const dataSet = {};
  purposeTabs.forEach((purpose) => {
    statTabs.forEach((stat) => {
      productTabs.forEach((product) => {
        set(dataSet, `[${purpose.key}][${stat.key}][${product.key}]`, []);
      });
    });
  });
  return {
    labels: [],
    purposes: purposeTabs,
    performanceBy: statTabs,
    types: productTabs,
    data: dataSet,
  };
};

const getInitialPayload = (
  { start_date = getVariousDates(30)?.[0], purpose = 'all', end_date = getVariousDates(30)?.[1], group_by, user },
  asObj,
  platformSlug,
) => {
  const loggedInUser = store.getState().app.loginUser.user;
  const getCategory = (pur) => {
    switch (pur) {
      case 'all':
        return [1, 2];
      case 'sale':
        return [1];
      case 'rent':
        return [2];
      case 'dailyrental':
        return [4];
    }
  };
  let category_ids = getCategory(purpose);
  const key = user?.id == -1 ? loggedInUser : user;
  let params = {
    start_date,
    end_date,
    ...(user?.is_agency_admin && platformSlug == 'bayut'
      ? { [`agency_external_ids[]`]: user?.agency?.id }
      : {
          [`user_external_ids[]`]: tenantConstants.KC_ENABLED
            ? key?.platform_mapping?.[platformSlug]?.external_id
            : key?.id,
        }),
  };

  if (asObj) {
    return {
      ...params,
    };
  }

  return `${convertQueryObjToString(params)}&${convertArrayToQueryString(category_ids, 'category_ids')}${group_by ? `&${convertArrayToQueryString(group_by, 'group_by')}` : ''}`;
};

const getLmsInitialPayload = (
  { start_date = getVariousDates(30)?.[0], purpose = 'all', end_date = getVariousDates(30)?.[1], group_by, user },
  asObj,
  dateKeys = ['start_date', 'end_date'],
) => {
  const getCategory = (pur) => {
    switch (pur) {
      case 'all':
        return [1, 2];
      case 'sale':
        return [1];
      case 'rent':
        return [2];
      case 'dailyrental':
        return [4];
    }
  };
  let category_ids = getCategory(purpose);

  const isAgencyScope = user?.id == -1;
  const userExternalIdForLms = () => {
    if (!tenantConstants.KC_ENABLED) {
      return user?.id;
    }
    return (
      user?.external_id ??
      user?.platform_mapping?.bayut?.external_id ??
      user?.platform_mapping?.dubizzle?.external_id ??
      user?.id
    );
  };
  let params = {
    [dateKeys[0]]: start_date,
    [dateKeys[1]]: end_date,
    ...(isAgencyScope
      ? { [`agency_external_ids[]`]: user?.agency?.id }
      : { [`user_external_ids[]`]: userExternalIdForLms() }),
  };

  if (asObj) {
    return {
      ...params,
    };
  }

  return `${convertQueryObjToString(params)}&${convertArrayToQueryString(category_ids, 'category_ids')}&${group_by ? `${convertArrayToQueryString(group_by, 'group_by')}` : ''}`;
};

export default {
  reportsData,
  generateProductData,
  calculateTotalChangePercentage,
  calculateTotalChangePercentageLeads,
  generateChartDataBreakdownFor,
  generateDataSummaryFor,
  getInitialPayload,
  getLmsInitialPayload,
};
