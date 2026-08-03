import tenantConstants from '@constants';
import tenantTheme from '@theme';
import set from 'lodash/set';
import React from 'react';
import { Icon } from '../../../components/common';
import { PERMISSIONS_TYPE } from '../../../constants/permissions';
import { strings } from '../../../constants/strings';
import store from '@store';
import { getVariousDates } from '../../../utility/date';
import { products } from '../data/products';
import { platformList, purposeList } from '../data/staticLists';
import { convertQueryObjToString } from '../../../utility/urlQuery';
import { convertArrayToQueryString } from '../../../utility/utility';

export const generateProductData = (productsArr) => {
  const productList = [];
  productsArr.forEach((product, i) => {
    const found = products.find((item) => item?.slug === product.slug);
    if (found) {
      productList.push({
        id: i,
        ...found,
        value: '',
        title: found.name,
        iconProps: { size: '1.2em', color: found.color, ...product.iconProps },
      });
    }
  });

  return productList;
};

export const calculateTotalChangePercentage = (finalClicks, finalViews, percentChangeClicks, percentChangeViews) => {
  if (!Number(percentChangeClicks) || !Number(percentChangeViews)) {
    return null;
  }
  const initialClicks = Number(finalClicks) / (1 + Number(percentChangeClicks) / 100);
  const initialViews = Number(finalViews) / (1 + Number(percentChangeViews) / 100);

  const totalInitialValue = initialClicks + initialViews;
  const totalFinalValue = Number(finalClicks) + Number(finalViews);

  const totalChange = totalFinalValue - totalInitialValue;
  const totalChangePercentage = (totalChange / totalInitialValue) * 100;

  return totalChangePercentage;
};

export const calculateTotalChangePercentageLeads = (
  finalCalls,
  finalSms,
  finalChat,
  percentChangeCalls,
  percentChangeSms,
  percentChangeChat,
) => {
  const arr = [
    { key: 'percentChangeCalls', percentage: Number(percentChangeCalls), value: Number(finalCalls) },
    { key: 'percentChangeSms', percentage: Number(percentChangeSms), value: Number(finalSms) },
    { key: 'percentChangeChat', percentage: Number(percentChangeChat), value: Number(finalChat) },
  ];

  const availablePercentages = arr.filter((e) => !!e.percentage);
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
  }
  return null;
};

export const calculateCTRPercentageChange = (finalClicks, finalViews, percentChangeClicks, percentChangeViews) => {
  if (!Number(percentChangeClicks) || !Number(percentChangeViews)) {
    return null;
  }
  const initialClicks = Number(finalClicks) / (1 + Number(percentChangeClicks) / 100);
  const initialViews = Number(finalViews) / (1 + Number(percentChangeViews) / 100);

  const initialCTR = initialClicks / initialViews;

  const finalCTR = Number(finalClicks) / Number(finalViews);
  const ctrPercentageChange = ((finalCTR - initialCTR) / initialCTR) * 100;

  return ctrPercentageChange;
};

export const reportsData = {
  zameen: {
    initialFilter: {
      lead: {
        purpose: 'all',
        stat: 'views',
        date_between: getVariousDates(29),
        date_placeholder: null,
      },
      traffic: {
        purpose: 'all',
        stat: 'views',
        date_between: getVariousDates(29),
      },
    },
    purposeTabs: [
      { key: 'all', value: 'All', label: 'All', hit: true },
      { key: 'sale', value: 'Sale', label: 'For Sale', hit: true },
      { key: 'rent', value: 'Rent', label: 'For Rent', hit: true },
    ],
    statTabs: [
      { key: 'reach', value: 'Reach', label: 'Reach', title: 'Reach', icon: 'MdVisibility', hit: true },
      { key: 'views', value: 'Views', label: 'Views', title: 'Views', icon: 'MdVisibility', hit: true },
      { key: 'clicks', value: 'Clicks', label: 'Clicks', title: 'Clicks', icon: 'MdAdsClick', hit: true },
      { key: 'leads', value: 'Leads', label: 'Leads', title: 'Leads', icon: 'MdPermPhoneMsg', hit: true },

      {
        key: 'ctr',
        value: 'CTR',
        label: 'Click through Rate (CTR)',
        title: 'Click through Rate (CTR)',
        icon: 'MdVisibility',
        hit: true,
        unit: '%',
      },
      {
        key: 'emails',
        value: 'Emails',
        label: 'Emails',
        title: 'Emails',
        icon: 'MdEmail',
        iconProps: {
          hasBackground: false,
          size: '1.1em',
          color: tenantTheme.gray700,
          style: { marginBlockStart: 4 },
        },
        hit: true,
      },
      {
        key: 'calls',
        value: 'Calls',
        label: 'Calls',
        title: 'Calls',
        icon: 'MdPhone',
        iconProps: {
          hasBackground: false,
          size: '1.1em',
          color: tenantTheme.gray700,
          style: { marginBlockStart: 4 },
        },
        hit: true,
      },
      {
        key: 'whatsapp',
        value: 'WhatsApp',
        label: 'WhatsApp',
        title: 'WhatsApp',
        icon: 'RiWhatsappLine',
        iconProps: {
          hasBackground: false,
          size: '1.1em',
          color: tenantTheme.gray700,
          style: { marginBlockStart: 4 },
        },
        hit: true,
      },
      {
        key: 'sms',
        value: 'SMS',
        label: 'SMS',
        title: 'SMS',
        icon: 'MdSms',
        iconProps: {
          hasBackground: false,
          size: '1.1em',
          color: tenantTheme.gray700,
          style: { marginBlockStart: 4 },
        },
        hit: true,
      },
    ],
    productTabs: [
      {
        key: 'all',
        value: 'all',
        label: 'All',
        backgroundColor: tenantTheme['primary-light'],
        borderColor: tenantTheme['primary-color'],
      },
      {
        key: 'super_hot',
        value: 'super_hot',
        label: 'Super Hot',
        borderColor: '#00ace6',
        backgroundColor: '#80dfff',
      },
      {
        key: 'hot',
        value: 'hot',
        label: 'Hot',
        borderColor: '#fe6a01',
        backgroundColor: '#fe9a52',
      },
      {
        key: 'paid',
        value: 'paid',
        label: 'Paid',
        borderColor: '#4747d1',
        backgroundColor: '#7070db',
      },
      {
        key: 'free',
        value: 'free',
        label: 'Free',
        borderColor: '#ffcc66',
        backgroundColor: ' #ffd480',
      },
    ],

    trafficTable() {
      const userList = store.getState().userGroup.list;
      const { user } = store.getState().app.loginUser;

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
                      return `${op.name} ${op.id === user?.id ? ' (Me)' : ''}`;
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
        stat: 'views',
        date_between: getVariousDates(29),
        date_placeholder: null,
      },
      traffic: {
        purpose: 'all',
        stat: 'views',
        date_between: getVariousDates(29),
      },
    },
    purposeTabs: [
      { key: 'all', value: 'All', label: 'All', hit: true },
      { key: 'sale', value: 'Sale', label: 'For Sale', hit: true },
      { key: 'rent', value: 'Rent', label: 'For Rent', hit: true },
    ],
    statTabs: [
      {
        key: 'views',
        value: 'Views',
        label: 'Views',
        title: 'Views',
        icon: 'MdVisibility',
        hit: true,
        responseKey: 'sum_search_count',
      },
      {
        key: 'clicks',
        value: 'Clicks',
        label: 'Clicks',
        title: 'Clicks',
        icon: 'MdVisibility',
        hit: true,
        responseKey: 'sum_view_count',
      },
      {
        key: 'leads',
        value: 'Leads',
        label: 'Leads',
        title: 'Leads',
        icon: 'MdVisibility',
        hit: true,
        responseKey: 'sum_lead_count',
      },
      { key: 'traffic', value: 'Reach', label: 'Reach', title: 'Reach', icon: 'MdVisibility' },
      { key: 'sum_search_count', value: 'Views', label: 'Views', title: 'Views', icon: 'MdVisibility', hit: true },
      { key: 'sum_view_count', value: 'Clicks', label: 'Clicks', title: 'Clicks', icon: 'MdAdsClick', hit: true },
      {
        key: 'ctr',
        value: 'CTR',
        label: 'Click through Rate (CTR)',
        title: 'Click through Rate (CTR)',
        icon: 'MdVisibility',
        unit: '%',
      },
      { key: 'leads', value: 'Leads', label: 'Leads', title: 'Leads', icon: 'MdPermPhoneMsg' },
      {
        key: 'sum_phone_view_count',
        value: 'Calls',
        label: 'Calls',
        title: 'Calls',
        icon: 'MdPhone',
        iconProps: {
          hasBackground: false,
          size: '1.1em',
          color: tenantTheme.gray700,
          style: { marginBlockStart: 4 },
        },
        responseKey: 'sum_phone_view_count',
      },
      {
        key: 'sum_sms_view_count',
        value: 'SMS',
        label: 'SMS',
        title: 'SMS',
        icon: 'MdSms',
        iconProps: {
          hasBackground: false,
          size: '1.1em',
          color: tenantTheme.gray700,
          style: { marginBlockStart: 4 },
        },
        responseKey: 'sum_sms_view_count',
      },
      {
        key: 'sum_chat_lead_count',
        value: 'Chat',
        label: 'Chat',
        title: 'Chat',
        icon: 'MdChat',
        iconProps: {
          hasBackground: false,
          size: '1.1em',
          color: tenantTheme.gray700,
          style: { marginBlockStart: 4 },
        },
        responseKey: 'sum_chat_lead_count',
      },
      {
        key: 'sum_email_lead_count',
        value: 'Emails',
        label: 'Emails',
        title: 'Emails',
        icon: 'MdEmail',
        iconProps: {
          hasBackground: false,
          size: '1.1em',
          color: tenantTheme.gray700,
          style: { marginBlockStart: 4 },
        },
      },
      {
        key: 'sum_whatsapp_view_count',
        value: 'WhatsApp',
        label: 'WhatsApp',
        title: 'WhatsApp',
        icon: 'RiWhatsappLine',
        iconProps: {
          hasBackground: false,
          size: '1.1em',
          color: tenantTheme.gray700,
          style: { marginBlockStart: 4 },
        },
      },
    ],
    productTabs: [
      {
        key: 'all',
        value: 'all',
        label: 'All',
        backgroundColor: tenantTheme['primary-light'],
        borderColor: platformList.find((item) => item.slug === 'olx').brandColor,
      },
      {
        key: 'featured',
        value: 'featured',
        label: 'Featured',
        borderColor: '#fe6a01',
        backgroundColor: '#fe9a52',
      },
      {
        key: 'standard',
        value: 'standard',
        label: 'Standard',
        borderColor: '#00ace6',
        backgroundColor: '#80dfff',
      },
    ],
    leadTable() {
      const userList = store.getState().app.userGroup.list;
      const { user } = store.getState().app.loginUser;
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
            component: 'Date',
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
          {
            title: 'Total Leads',
            dataIndex: 'leads',
            key: 'leads',
            component: 'Number',
          },
        ],
      };
    },
    trafficTable() {
      const userList = store.getState().app.userGroup.list;
      const { user } = store.getState().app.loginUser;

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
  const { purposeTabs, productTabs } = reportsData[platform];
  const statTabs = [];
  statsArr.forEach((statKey) => {
    const pushStat = reportsData[platform].statTabs.find((item) => item.key === statKey);
    if (pushStat) {
      statTabs.push(pushStat);
    }
  });

  const dataSet = {};

  statTabs.forEach((stat) => {
    productTabs.forEach((product) => {
      set(dataSet, `[${stat.key}][${product.key}]`, []);
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

export const generateSecondChartDataBreakdownFor = (platform, statsArr) => {
  const { purposeTabs, productTabs } = reportsData[platform];
  const statTabs = [];
  statsArr.forEach((statKey) => {
    const pushStat = reportsData[platform].statTabs.find((item) => item.key === statKey);
    if (pushStat) {
      statTabs.push(pushStat);
    }
  });

  const dataSet = {};
  statTabs.forEach((stat) => {
    productTabs.forEach((product) => {
      set(dataSet, `[${stat.key}][${product.key}]`, []);
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
  {
    start_date = getVariousDates(30)?.[0],
    purpose = 'all',
    end_date = getVariousDates(30)?.[1],
    group_by,
    include,
    user,
  },
  asObj,
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
    start_date,
    end_date,
    ...(user?.is_agency_admin
      ? { [`agency_external_ids[]`]: user?.agency?.id }
      : { [`user_external_ids[]`]: tenantConstants.KC_ENABLED ? user?.external_id : user?.id }),
    ...(group_by && { group_by }),
    ...(include && { include }),
  };

  if (asObj) {
    return {
      ...params,
    };
  }

  return `${convertQueryObjToString(params)}&${convertArrayToQueryString(category_ids, 'purpose_id')}${group_by ? `${convertArrayToQueryString(group_by, 'group_by')}` : ''}`;
};

export default {
  getInitialPayload,
  generateProductData,
  calculateTotalChangePercentage,
  calculateTotalChangePercentageLeads,
  reportsData,
  generateChartDataBreakdownFor,
  generateDataSummaryFor,
  generateSecondChartDataBreakdownFor,
};
