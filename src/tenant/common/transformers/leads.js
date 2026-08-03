import tenantUtils from '@utils';
import tenantTheme from '@theme';
import tenantConstants from '@constants';
import moment from 'moment';
import { t } from 'i18next';
import { listingDetailMapper } from './listings';

const iconMappings = {
  whatsapp: { icon: 'RiWhatsappFill', iconProps: { color: '#25D366', size: '12px' } },
  call: { icon: 'IoCall' },
  email: { icon: 'FaEnvelope' },
  manual: { icon: 'FaHandPointer' },
  sms: { icon: 'MdSms' },
  bayut_match: { icon: 'IconBayutMatch', iconProps: { color: '#28B16D', size: '12px' } },
};

const tabItems = [
  {
    key: 'calls',
    title: 'Calls',
  },
  {
    key: 'whatsapp',
    title: 'WhatsApp',
  },

  {
    key: 'emails',
    title: 'Emails',
  },
  {
    key: 'sms',
    title: 'SMS',
  },
];

const productTypes = [
  {
    key: 'all',
    title: 'All Listings',
    color: tenantTheme['primary-color'],
  },
  {
    key: 'premium',
    title: 'Basic',
    color: tenantTheme['color-basic'],
    icon: 'IconBasic',
    borderColor: tenantTheme['color-basic'],

    iconProps: {
      color: tenantTheme['color-basic'],
    },
  },
  {
    key: 'hot',
    title: 'Hot',
    icon: 'IconSuperHot',
    color: tenantTheme['color-hot'],
    iconProps: {
      color: tenantTheme['color-hot'],
    },
  },
  {
    key: 'superhot',
    title: 'Signature',
    icon: 'BsFillLightningChargeFill',
    color: tenantTheme['color-signature'],
    iconProps: {
      color: tenantTheme['color-signature'],
    },
  },
];

const graphDataMapper = (leadsStats, user, phoneLeadsStats, labels) => {

  const metricMapping = {
    calls: {
      calls_clicked: {
        responseKey: 'sum_phone_view_count',
        borderColor: '#006169',
        label: 'Calls Clicked',
      },
    },
    whatsapp: {
      whatsapp_clicked: {
        responseKey: 'sum_whatsapp_view_count',
        borderColor: '#006169',
        label: 'WhatsApp Clicked',
      },
      ...(user?.is_lms_enabled &&
        user?.is_whatsapp_tracking_enabled &&
        tenantConstants.IS_LMS_ENABLED && {
          whatsapp_sent: {
            responseKey: 'sum_whatsapp_lead_count',
            borderColor: '#28B16D',
            label: 'WhatsApp Sent',
          },
          chats_initiated: {
            responseKey: 'chats_initiated',
            borderColor: '#F7ADA0',
            label: 'Chats Initiated',
          },
        }),
    },
    emails: {
      emails_clicked: {
        responseKey: 'sum_email_view_count',
        label: 'Emails Clicked',
        borderColor: '#006169',
      },
      emails_received: {
        responseKey: 'sum_email_lead_count',
        label: 'Emails Received',
        borderColor: '#009f48',
      },
    },
    sms: {
      sms_clicked: {
        responseKey: 'sum_sms_view_count',
        label: 'SMS Clicked',
        borderColor: '#006169',
      },
    },
  };

  const graphData = {};

  Object.keys(metricMapping).forEach((category) => {
    graphData[category] = {};
    Object.keys(metricMapping[category]).forEach((key) => {
      graphData[category][key] = {
        label: metricMapping?.[category]?.[key]?.label,
        borderColor: metricMapping?.[category]?.[key]?.borderColor,
        ...productTypes.reduce((acc, { key: productKey }) => {
          acc[productKey] = [];
          return acc;
        }, {}),
      };
    });
  });

  labels.forEach((dateKey) => {
    Object.keys(metricMapping).forEach((category) => {
      Object.entries(metricMapping[category]).forEach(([subCategoryKey, subCategoryObj]) => {
        graphData[category][subCategoryKey].total = leadsStats?.[subCategoryObj?.responseKey];
        productTypes?.forEach((productType) => {
          if (productType?.key == 'all') {
            const value = leadsStats?.items?.[dateKey]?.[subCategoryObj?.responseKey] || 0;
            graphData[category]?.[subCategoryKey]?.[productType?.key]?.push(value);
          } else {
            const value =
              leadsStats?.items?.[dateKey]?.product_wise?.find((product) => product?.ad_product == productType?.key)?.[
                subCategoryObj?.responseKey
              ] || 0;
            graphData[category]?.[subCategoryKey]?.[productType?.key]?.push(value);
          }
        });
      });
    });
  });

  Object.keys(graphData).forEach((key) => {
    if (key == 'calls' && phoneLeadsStats) {
      graphData[key] = { ...graphData?.[key], ...phoneLeadsStats };
    }
  });

  return {
    labels: labels?.map((d) => moment(d)?.locale('en')?.format('MMM DD')),
    data: graphData,
    productTypes,
    tabItems,
  };
};

const widgetDataMapper = (leadsStats) => {
  return [
    {
      key: 'leads',
      title: 'Total Leads',
      value: leadsStats?.sum_lead_count,
      icon: 'TotalLeads',
      iconProps: { size: '24px' },
    },
    {
      key: 'calls',
      title: 'Calls',
      value: leadsStats?.sum_phone_view_count,
      popoverContent: `${t('Calls Clicked')} ${leadsStats?.sum_phone_view_count}`,
      icon: 'IoCall',
      iconColor: '#479eeb',
    },
    {
      key: 'whatsapp',
      title: 'WhatsApp',
      value: leadsStats?.sum_whatsapp_view_count,
      popoverContent: `${t('WhatsApp Clicked')} ${leadsStats?.sum_whatsapp_view_count}`,
      icon: 'RiWhatsappFill',
      iconColor: '#4CAF50',
    },
    {
      key: 'emails',
      title: 'Emails',
      value: leadsStats?.sum_email_lead_count,
      icon: 'MdMail',
    },
    {
      key: 'sms',
      title: 'SMS',
      value: leadsStats?.sum_sms_view_count,
      icon: 'MdSms',
    },
  ];
};

const leadsDataMapper = (data) => {
  return data?.map((item) => ({
    client_info: {
      id: item?.client.id,
      leadId: item?.id,
      email: item?.client.email,
      phone: item?.client.mobile,
      whatsapp: item?.client.whatsapp,
      name: tenantUtils.getLocalisedString(item, 'name'),
      created_at: item?.created_at,
      createdAt: item?.created_at,
      managedBy: item?.user?.name,
      isViewed: item?.is_viewed,
      source: item?.interest?.source,
    },

    last_interaction: {
      ...iconMappings?.[item?.interest?.source],
      sourceTitle: tenantUtils.getLocalisedString(item?.interest, 'source_title'),
      type: item?.interest?.source,
      content: tenantUtils.getLocalisedString(item?.interest, 'message_body'),
      date: item?.interest?.recorded_at,
      recording_uuid: item?.interest?.recording_url,
      callStatus: item?.interest?.call_status,
      callAnalysisScore: !!item?.interest?.recording_url ? item?.interest?.call_analysis_score : null,
      interestId: item?.interest?.id,
      leadId: item?.id,
      client_info: {
        id: item?.client.id,
        leadId: item?.id,
        email: item?.client.email,
        phone: item?.client.mobile,
        whatsapp: item?.client.whatsapp,
        name: tenantUtils.getLocalisedString(item, 'name'),
        createdAt: item?.created_at,
        managedBy: item?.user?.name,
        isViewed: item?.is_viewed,
        source: item?.interest?.source,
      },
    },

    listing_detail: {
      ...listingDetailMapper(item?.interest?.listing),
      clientId: item?.client.id,
      leadId: item?.id,
      interests_count: item?.listings_count,
      interestId: item?.interest?.id,
      interest: item?.interest,
      userId: item?.user?.id,
    },
    actions: {
      id: item?.id,
      buttonProps: { size: 'small', iconSize: '1em' },
    },
    tasks_detail: {
      parentTask: {
        title: item?.task?.task_purpose?.name,
        title_l1: item?.task?.task_purpose?.name_l1,
        date: item?.task?.completed_at,
        agent_name: item?.task?.assignee?.name,
        agent_name_l1: item?.task?.assignee?.name_l1,
      },
      childTask: item?.task?.child?.id && {
        title: item?.task?.child?.task_purpose?.name,
        title_l1: item?.task?.child?.task_purpose?.name_l1,
        date: item?.task?.child?.created_at,
        isOverdue: item?.task?.child?.due_date ? moment(item.task.child.due_date).isBefore(moment()) : false,
      },
    },
  }));
};

export const interestDetailMapper = (response) => {
  const interest = response?.interest;
  if (!interest) return null;
  return {
    ...interest,
    listing_detail: interest.listing
      ? {
          ...listingDetailMapper(interest.listing),
          interestId: interest.id,
          interest,
        }
      : undefined,
  };
};

export const leadInterestsMapper = (response) => {
  return {
    list: response?.interests.map((item) => ({
      date: { value: item?.recorded_at, showTime: true, showPopover: false },
      listing_detail: { ...listingDetailMapper(item?.listing), interestId: item?.id, interest: item },
      lead_source: {
        ...iconMappings?.[item?.source],
        sourceTitle: tenantUtils.getLocalisedString(item, 'source_title'),
        type: item?.source,
        content: tenantUtils.getLocalisedString(item, 'message_body'),
        date: item?.recorded_at,
        recording_uuid: item?.recording_url,
        callStatus: item?.call_status,
        callAnalysisScore: !!item?.recording_url ? item?.call_analysis_score : null,
        interestId: item?.id,
        leadId: item?.lead_id,
      },
    })),
    pagination: tenantUtils.getPaginationObject(response?.pagination),
  };
};

export const tasksMapper = (response) => {
  return {
    table: [
      {
        title: 'Date Added',
        dataIndex: 'dateAdded',
        key: 'dateAdded',
        component: 'Date',
      },
      {
        title: 'Completed Task',
        dataIndex: 'completedTask',
        key: 'completedTask',
        component: 'TaskDetail',
      },
      {
        title: 'Planned Task',
        dataIndex: 'plannedTask',
        key: 'plannedTask',
        component: 'TaskDetail',
      },
      {
        title: 'Notes',
        dataIndex: 'notes',
        key: 'notes',
        component: 'TaskNotes',
      },
    ],
    list: response?.lead_tasks.map((task) => ({
      id: task?.id,
      dateAdded: { value: task?.created_at, showTime: true, showPopover: false },
      completedTask: {
        childTask: {
          date: task?.completed_at,
          showTime: true,
          showPopover: false,
          title: task?.task_purpose?.name,
          title_l1: task?.task_purpose?.name_l1,
        },
      },
      plannedTask: {
        childTask: {
          date: task?.child?.due_date,
          showTime: true,
          showPopover: false,
          title: task?.child?.task_purpose?.name,
          title_l1: task?.child?.task_purpose?.name_l1,
          isOverdue: task?.child?.due_date ? moment(task.child.due_date).isBefore(moment()) : false,
        },
      },
      taskType: task?.task_type,
      notes: {
        value: task?.notes,
        imageUrl: task?.images?.[0]?.full || null,
        imageName: task?.images?.[0]?.filename,
      },
    })),
    pagination: tenantUtils.getPaginationObject(response?.pagination),
  };
};

export const getLeadsMapper = (response) => {
  return {
    list: leadsDataMapper(response?.leads),
    pagination: tenantUtils.getPaginationObject(response?.pagination),
    totalLeads: response?.pagination?.total_count ?? 0,
  };
};

export const leadDetailMapper = (data) => {
  const { client } = data;

  return {
    name: tenantUtils.getLocalisedString(data, 'name'),
    email: client?.email,
    phone: client?.mobile,
    whatsapp: client?.whatsapp,
    createdAt: data?.created_at,
    id: client?.id,
    managedBy: tenantUtils.getLocalisedString(data?.user, 'name'),
    userId: data?.user?.id,
    isViewed: data?.is_viewed,
    leadSources: [
      {
        title: 'Call',
        value: data?.call_leads_count,
        icon: 'IoCall',
        backgroundColor: '#E5EEF8',
        iconColor: '#28609F',
      },
      {
        title: 'Whatsapp',
        value: data?.whatsapp_leads_count,
        icon: 'RiWhatsappFill',
        backgroundColor: '#F0FAF6',
        iconColor: '#4CAF50',
      },
      {
        title: 'Email',
        value: data?.email_leads_count,
        icon: 'FaEnvelope',
        backgroundColor: '#E8F5F6',
        iconColor: '#388B91',
      },
      {
        title: 'Manual',
        value: data?.manual_leads_count,
        icon: 'FaHandPointer',
        backgroundColor: '#EAF9F3',
        iconColor: '#2CB270',
      },
    ],
  };
};

export const phoneStatsMapper = (data, dateArray) => {
  const mappedData = {
    calls_received: {
      responseKey: 'received_calls',
      borderColor: '#55969B',
      label: 'Calls Received',
      total: data?.received_calls,
    },
    calls_answered: {
      responseKey: 'answered_calls',
      borderColor: '#28B16D',
      label: 'Calls Answered',
      total: data?.answered_calls,
    },
    calls_missed: {
      responseKey: 'missed_calls',
      borderColor: '#F73131',
      label: 'Calls Missed',
      total: data?.missed_calls,
    },
  };

  Object.keys(mappedData).forEach((categoryKey) => {
    mappedData[categoryKey] = {
      ...mappedData[categoryKey],

      ...productTypes.reduce((acc, { key: productKey }) => {
        acc[productKey] = [];
        return acc;
      }, {}),
    };
  });

  dateArray.map((dateKey) => {
    Object.keys(mappedData).forEach((categoryKey) => {
      productTypes?.forEach((productType) => {
        if (productType?.key == 'all') {
          const value = data?.items?.[dateKey]?.[mappedData?.[categoryKey]?.responseKey] || 0;
          mappedData[categoryKey]['all'].push(value);
        } else {
          const value =
            data?.items?.[dateKey]?.product_wise?.find((product) => product?.ad_product == productType?.key)?.[
              mappedData?.[categoryKey]?.responseKey
            ] || 0;
          mappedData[categoryKey]?.[productType?.key].push(value);
        }
      });
    });
  });

  return mappedData;
};

export const productStatsMapper = (response, selectedUser, phoneStats, dateArray) => {
  return {
    widgetData: widgetDataMapper(response?.data?.stats),
    graphData: graphDataMapper(response?.data?.stats, selectedUser, phoneStats, dateArray),
  };
};

export const transformResponseTimeGraphData = (apiResponse) => {
  if (!apiResponse?.daily_response_rates?.daily_data) {
    return {
      callResponseRates: [],
      whatsappResponseRates: [],
      callAvgResponseTime: [],
      whatsappAvgResponseTime: [],
      labels: [],
      summary: null
    };
  }

  const dailyData = apiResponse?.daily_response_rates?.daily_data;

  return {
    callResponseRates: dailyData?.map(day => day?.calls?.response_rate ?? 0) || [],
    whatsappResponseRates: dailyData?.map(day => day?.whatsapp?.response_rate ?? 0) || [],
    callAvgResponseTime: dailyData?.map(day => day?.calls?.avg_response_time ?? 0) || [],
    whatsappAvgResponseTime: dailyData?.map(day => day?.whatsapp?.avg_response_time ?? 0) || [],
    labels: dailyData?.map(day => day?.date ?? '') || [],
    summary: apiResponse?.daily_response_rates?.summary ?? null
  };
};

export default {
  getLeadsMapper,
  phoneStatsMapper,
  productStatsMapper,
  transformResponseTimeGraphData,
  leadDetailMapper,
  interestDetailMapper,
  leadInterestsMapper,
  tasksMapper,
  leadsDataMapper,
};
