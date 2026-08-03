import tenantConstants from '@constants';
import { t } from 'i18next';
import set from 'lodash/set';
import React from 'react';
import { Icon } from '../../../components/common';
import { PERMISSIONS_TYPE } from '../../../constants/permissions';
import { strings } from '../../../constants/strings';
import store from '@store';
import { getVariousDates } from '../../../utility/date';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import { convertArrayToQueryString } from '../../../utility/utility';
import { products } from '../data/products';
import { purposeList } from '../data/staticLists';
import tenantTheme from '@theme';
export const generateProductData = (productsArr) => {
  const allProducts = products; //TODO Rtkq
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
  ksa: {
    initialFilter: {
      lead: {
        purpose: 'all',
        stat: 'views',
        date_between: getVariousDates(29),
        date_placeholder: null,
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
      { key: 'dailyrental', value: 'DailyRental', label: 'Daily Rentals', hit: true },
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
    productTabs(isCurrencyUser) {
      return [
        {
          key: 'premium',
          value: 'premium',
          label: 'Basic',
          icon: 'IconBasic',
          color: tenantTheme['color-basic'],
          iconProps: {
            color: tenantTheme['color-basic'],
          },
          borderColor: '#28b16d',
          backgroundColor: '#80dfff',
        },
        {
          key: 'hot',
          value: 'hot',
          label: 'Hot',
          icon: 'IconSuperHot',
          color: tenantTheme['color-hot'],
          iconProps: {
            color: tenantTheme['color-hot'],
          },
          borderColor: '#f73131',
          backgroundColor: '#f73131',
        },
        ...(isCurrencyUser
          ? [
              {
                key: 'superhot',
                value: 'superhot',
                label: 'Signature',
                icon: 'BsFillLightningChargeFill',
                borderColor: '#af6fff',
                backgroundColor: '#af6fff',
                color: tenantTheme['color-signature'],
                iconProps: {
                  color: tenantTheme['color-signature'],
                },
              },
            ]
          : []),
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
              list: purposeList,
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
  olx: {
    initialFilter: {
      lead: {
        purpose: 'all',
        stat: 'sum_phone_view_count',
        date_between: getVariousDates(29),
      },
      traffic: {
        purpose: 'all',
        stat: 'sum_search_count',
        date_between: getVariousDates(29),
      },
    },
    purposeTabs: [
      { key: 'all', value: 'All', label: 'All', hit: true },
      { key: 'sale', value: 'Sale', label: 'For Sale', hit: true },
      { key: 'rent', value: 'Rent', label: 'To Rent', hit: true },
    ],
    statTabs: [
      { key: 'traffic', value: 'Reach', label: 'Reach', title: 'Reach', icon: 'MdVisibility' },
      { key: 'sum_search_count', value: 'Views', label: 'Views', title: 'Views', icon: 'MdVisibility' },
      { key: 'sum_view_count', value: 'Clicks', label: 'Clicks', title: 'Clicks', icon: 'MdAdsClick' },
      {
        key: 'ctr',
        value: 'CTR',
        label: 'Click through Rate (CTR)',
        title: 'Click through Rate (CTR)',
        icon: 'MdVisibility',
        unit: '%',
      },
      { key: 'leads', value: 'Leads', label: 'Leads', title: 'Leads', icon: 'MdPermPhoneMsg' },
      { key: 'sum_phone_view_count', value: 'Calls', label: 'Calls', title: 'Calls', icon: 'MdPhone' },
      { key: 'sum_sms_view_count', value: 'SMS', label: 'SMS', title: 'SMS', icon: 'MdSms' },
      { key: 'sum_chat_lead_count', value: 'Chat', label: 'Chat', title: 'Chat', icon: 'MdChat' },
      { key: 'sum_email_lead_count', value: 'Emails', label: 'Emails', title: 'Emails', icon: 'MdEmail' },
      {
        key: 'sum_whatsapp_view_count',
        value: 'WhatsApp',
        label: 'WhatsApp',
        title: 'WhatsApp',
        icon: 'RiWhatsappLine',
      },
    ],
    productTabs(isCurrencyUser) {
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
        ...(isCurrencyUser
          ? [
              {
                key: 'signature',
                value: 'signature',
                label: 'Signature',
                borderColor: '#ff8518',
                backgroundColor: '#ff8518',
              },
            ]
          : []),
      ];
    },
    leadTable() {
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
                    labelProps: { muted: true },
                    showTag: true,
                    singleValue: true,
                    box_title: 'All Users',
                  },
                ]
              : []),
            {
              label: strings.purpose,
              list: purposeList,
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
            title: 'Views',
            dataIndex: 'views',
            key: 'views',
            component: 'Number',
          },
          {
            title: 'Clicks',
            dataIndex: 'clicks',
            key: 'clicks',
            component: 'Number',
          },
          {
            title: 'Leads',
            dataIndex: 'leads',
            key: 'leads',
            component: 'Number',
          },
          {
            title: 'Calls',
            dataIndex: 'calls',
            key: 'sum_phone_view_count',
            component: 'Number',
          },
          {
            title: 'Chats',
            dataIndex: 'chats',
            key: 'sum_chat_lead_count',
            component: 'Number',
          },
          {
            title: 'SMS',
            dataIndex: 'sms',
            key: 'sum_sms_view_count',
            component: 'Number',
          },
        ],
      };
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
                    showTag: true,
                    singleValue: true,
                  },
                ]
              : []),
            {
              label: strings.purpose,
              list: purposeList,
              type: 'select',
              key: 'purpose',
              placeholder: strings.placeholders.purpose,
              box_title: 'Purpose',
              singleValue: true,
              labelProps: { muted: true },
              showTag: true,
              getOptionLabel: (e) => (
                <div>
                  <Icon icon={e.icon} />
                  {e.title}
                </div>
              ),
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
  let params = {
    [dateKeys[0]]: start_date,
    [dateKeys[1]]: end_date,
    ...(user?.is_agency_admin
      ? { [`agency_external_ids[]`]: user?.agency?.id }
      : { [`user_external_ids[]`]: tenantConstants.KC_ENABLED ? user?.external_id : user?.id }),
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
};
