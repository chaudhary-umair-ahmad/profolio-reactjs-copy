import React from 'react';
import { formatNumberString } from '../../../utility/utility';
import { Flex, Icon, Text } from '../../../components/common';
import { Popover as PopoverAntd } from 'antd';
import tenantTheme from '@theme';
import { t } from 'i18next';
import { getBaseURL } from '../../../utility/env';

const timeStatsTemplate = [
  {
    title: 'Average Duration',
    slug: 'avg_call_duration',
    icon: 'AvgDuration',
  },
  {
    title: 'Average Response Time',
    slug: 'avg_call_response_time',
    icon: 'AvgResponseTimeIcon',
  },
];

const whatsappTimeStatsTemplate = [
  {
    title: 'Average Response Time',
    slug: 'avg_whatsapp_response_time',
    icon: 'AvgResponseTimeIcon',
  },
];

export const formatCallTimeStats = (data) => {
  if (!data?.metrics) {
    return timeStatsTemplate.map((item) => ({
      ...item,
      value: '-',
    }));
  }

  return timeStatsTemplate.map((item) => ({
    ...item,
    value: data.metrics[item.slug] ?? '0',
  }));
};

export const formatWhatsappTimeStats = (data) => {
  if (!data?.metrics) {
    return whatsappTimeStatsTemplate.map((item) => ({
      ...item,
      value: '-',
    }));
  }

  return whatsappTimeStatsTemplate.map((item) => ({
    ...item,
    value: data.metrics[item.slug] ?? '0',
  }));
};
export const whatsappTitleStats = {
  title: 'Whatsapp Insights',
  icon: 'WhatsappIcon',
};

export const callInsightsTitleStats = {
  title: 'Call Insights',
  icon: 'PhoneIcon',
};

export const totalLeadsTitleStats = {
  title: 'Total Leads',
  icon: 'TotalLeadsIcon',
};

const callInsights = [
  {
    title: 'Call Received',
    icon: 'CallRecieved',
    slug: 'received_calls',
  },
  {
    title: 'Answered',
    icon: 'Answered',
    slug: 'answered_calls',
  },
  {
    title: 'Missed',
    icon: 'Missed',
    slug: 'missed_calls',
  },
  {
    title: 'Response Rate',
    icon: 'ResponseRate',
    slug: 'response_rate',
  },
];

export const formatCallData = (data) => {
  if (!data) {
    return callInsights?.map((item) => ({
      ...item,
      value: '-',
    }));
  }

  const updatedCallInsights = callInsights?.map((item) => {
    let value = data[item?.slug] ?? '';
    let suffix = '';

    if (item?.slug === 'response_rate' && value !== '') {
      value = Math.round(value);
      suffix = '%';
    } else if (value !== '') {
      value = formatNumberString(value, { maximumFractionDigits: 0 });
    }

    return {
      ...item,
      value,
      suffix,
    };
  });

  return updatedCallInsights;
};

const whatsappInsights = [
  {
    title: 'Whatsapp Received',
    icon: 'WhatsappRecieved',
    slug: 'sum_whatsapp_lead_count',
  },
  {
    title: 'Chat Initiated',
    icon: 'ChatsInitiated',
    slug: 'chats_initiated',
  },
  {
    title: 'Response Rate',
    icon: 'ResponseRate',
    slug: 'whatsapp_response_rate',
  },
];

export const formatWhatsappData = (data) => {
  if (!data) {
    return whatsappInsights.map((item) => ({
      ...item,
      value: '-',
    }));
  }

  const updatedWhatsappInsights = whatsappInsights.map((item) => {
    let value = data[item?.slug] ?? '';
    let suffix = '';

    if (item?.slug === 'whatsapp_response_rate' && value !== '') {
      value = Math.round(value);
      suffix = '%';
    } else if (value !== '') {
      value = formatNumberString(value, { maximumFractionDigits: 0 });
    }

    return {
      ...item,
      value,
      suffix,
    };
  });

  return updatedWhatsappInsights;
};

const formatKeyToTitle = (key) => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getWhatsappIconBasedOnkey = (key) => {
  switch (key) {
    case 'received':
      return 'WhatsappRecieved';
    case 'chat_initiated':
      return 'ChatsInitiated';
    case 'response_rate':
      return 'ResponseRate';
    default:
      return 'ResponseRate';
  }
};

export const formatAgentPerformanceTable = (userPerformanceData) => {
  if (!userPerformanceData?.users) return null;

  return {
    table: [
      {
        title: t('Agent'),
        dataIndex: 'user_detail',
        component: 'String',
        key: 'user_detail',
        width: 220,
        render: (data) => {
          const name = data?.user_name || '-';
          const email = data?.user_email || '';
          const mobile = data?.user_mobile || '';
          const profile_image = data?.user_profile_image ?? `${getBaseURL()}/profolio-assets/images/Rectangle.svg`;

          return (
            <Flex gap="8px">
              <img
                src={profile_image}
                alt={name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  objectFit: 'cover',
                }}
              />
              <Flex align="flex-start" gap="4px" vertical justifyContent="space-between">
                <div>
                  <Flex align="center">
                    <Text style={{ fontSize: '13px', fontWeight: '600' }}>{name}</Text>
                  </Flex>

                  <Flex align="flex-start" vertical justifyContent="space-between" gap="3px">
                    <Flex align="center" gap="4px">
                      <Icon icon="AgentEmailIcon" size="11px" color="#767676" />
                      <Text style={{ fontSize: '11px', color: '#767676', fontWeight: '400', lineHeight: '13px' }}>
                        {email}
                      </Text>
                    </Flex>
                    <Flex align="center" gap="4px">
                      <Icon icon="AgentPhoneIcon" size="11px" color="#767676" />
                      <Text style={{ fontSize: '11px', color: '#767676', fontWeight: '400', lineHeight: '13px' }}>
                        {mobile}
                      </Text>
                    </Flex>
                  </Flex>
                </div>
              </Flex>
            </Flex>
          );
        },
      },
      {
        title: t('Top Active Listings'),
        dataIndex: 'top_active_listing',
        component: 'String',
        key: 'top_active_listing',
        width: 260,
        render: (data, item) => {
          const listing = data;
          if (!listing) return <Text style={{ color: '#707070' }}>0</Text>;

          const listingType = listing?.listing_type?.type_title || '';
          const purpose = listing?.listing_purpose?.purpose_title || '';
          const location = listing?.location?.breadcrumbs?.map((b) => b.title).join(', ') || '';
          const stats = listing?.stats;

          return (
            <Flex vertical gap="8px">
              <Flex gap="6px" align="flex-start">
                <img
                  src={listing?.image?.thumbnail ?? require('../../../static/img/pages/no-data.svg')}
                  alt="listing"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    objectFit: 'cover',
                  }}
                />
                <Flex vertical gap="3px">
                  <Text style={{ fontSize: '13px', fontWeight: '600', color: '#222222' }}>
                    {listing?.title || `${listingType} for ${purpose}`}
                  </Text>
                  <Flex align="center" gap="3px">
                    <Icon icon="IoLocationSharp" size="11px" color="#707070" />
                    <Text style={{ fontSize: '11px', color: '#707070' }}>{location}</Text>
                  </Flex>
                </Flex>
              </Flex>
              <Flex align="center" gap="4px">
                <Text style={{ fontSize: '12px', color: '#006169', fontWeight: '400' }}>{t('Leads info')}</Text>
                <PopoverAntd
                  content={
                    <Flex vertical gap="12px" style={{ width: '380px', minheight: '364px' }}>
                      <div style={{ backgroundColor: '#F5FBFB', padding: '12px', borderRadius: '6px' }}>
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icon icon="LeadsAndTasksIcon" size="16px" color="#006169" />
                            <Text style={{ fontSize: '14px', fontWeight: '600', color: '#006169' }}>{t('Leads')}</Text>
                          </div>
                          <Text style={{ fontSize: '14px', fontWeight: '600', color: '#006169' }}>
                            {formatNumberString(listing?.stats?.total_leads  || 0, { maximumFractionDigits: 0 })}
                          </Text>
                        </div>
                      </div>
                      <div style={{ backgroundColor: '#F5FBFB', padding: '12px', borderRadius: '6px' }}>
                        <Flex align="center" gap="8px" style={{ marginBottom: '8px' }}>
                          <Icon icon="IoCall" size="16px" color="#006169" />
                          <Text style={{ fontSize: '14px', fontWeight: '600', color: '#006169' }}>{t('Calls')}</Text>
                        </Flex>
                        <Flex gap="8px" justify="space-between">
                          <Flex vertical gap="4px">
                            <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>{t('Clicked')}</Text>
                            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                              {formatNumberString(stats?.calls?.clicked || 0, { maximumFractionDigits: 0 })}
                            </Text>
                          </Flex>
                          <Flex vertical gap="4px">
                            <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>{t('Answered')}</Text>
                            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                              {formatNumberString(stats?.calls?.answered || 0, { maximumFractionDigits: 0 })}
                            </Text>
                          </Flex>
                          <Flex vertical gap="4px">
                            <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>{t('Missed')}</Text>
                            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                              {formatNumberString(stats?.calls?.missed || 0, { maximumFractionDigits: 0 })}
                            </Text>
                          </Flex>
                        </Flex>
                      </div>

                      <div style={{ backgroundColor: '#F5FBFB', padding: '12px', borderRadius: '6px' }}>
                        <Flex align="center" gap="8px" style={{ marginBottom: '8px' }}>
                          <Icon icon="RiWhatsappFill" size="16px" color="#25D366" />
                          <Text style={{ fontSize: '14px', fontWeight: '600', color: '#006169' }}>{t('WhatsApp')}</Text>
                        </Flex>
                        <Flex gap="8px" justify="space-between">
                          <Flex vertical gap="4px">
                            <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>{t('Clicked')}</Text>
                            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                              {formatNumberString(stats?.whatsapp?.clicked || 0, { maximumFractionDigits: 0 })}
                            </Text>
                          </Flex>
                          <Flex vertical gap="4px">
                            <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>{t('Sent')}</Text>
                            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                              {formatNumberString(stats?.whatsapp?.sent || 0, { maximumFractionDigits: 0 })}
                            </Text>
                          </Flex>
                          <Flex vertical gap="4px">
                            <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>
                              {t('Chat Initiated')}
                            </Text>
                            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                              {formatNumberString(stats?.whatsapp?.chat_initiated || 0, { maximumFractionDigits: 0 })}
                            </Text>
                          </Flex>
                        </Flex>
                      </div>

                      <div style={{ backgroundColor: '#F5FBFB', padding: '12px', borderRadius: '6px' }}>
                        <Flex align="center" gap="8px" style={{ marginBottom: '8px' }}>
                          <Icon icon="EmailCardIcon" size="16px" color="#25D366" />
                          <Text style={{ fontSize: '14px', fontWeight: '600', color: '#006169' }}>{t('Email')}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Flex vertical gap="4px">
                            <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>{t('Clicked')}</Text>
                            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                              {formatNumberString(stats?.email?.clicked || 0, { maximumFractionDigits: 0 })}
                            </Text>
                          </Flex>

                          <Flex vertical gap="4px">
                            <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>{t('Received')}</Text>
                            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>
                              {formatNumberString(stats?.email?.received || 0, { maximumFractionDigits: 0 })}
                            </Text>
                          </Flex>
                          <Flex vertical gap="4px">
                            <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>{''}</Text>
                            <Text style={{ fontSize: '14px', fontWeight: '700', color: '#006169' }}>{''}</Text>
                          </Flex>
                        </Flex>
                      </div>
                    </Flex>
                  }
                  trigger="hover"
                >
                  <span style={{ display: 'inline-flex', cursor: 'pointer' }}>
                    <Icon icon="TooltipInfoIcon" color={tenantTheme['gray500']} size="14px" />
                  </span>
                </PopoverAntd>
              </Flex>
            </Flex>
          );
        },
      },
      {
        title: t('Total Leads'),
        dataIndex: 'total_leads',
        key: 'total_leads',
        component: 'String',
        width: 110,
        render: (data) => formatNumberString(data || 0, { maximumFractionDigits: 0 }),
      },
      {
        title: (
          <Flex align="center" gap="4px">
            <span>{t('Calls')}</span>
            <PopoverAntd
              content={
                <Flex vertical gap="12px" style={{ minWidth: '280px' }}>
                  <Flex gap="8px" align="center" width="336px" justifyContent="space-between">
                    <Icon
                      icon="PhoneOutgoingIcon"
                      color={tenantTheme['gray500']}
                      size="14px"
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ width: '302px', height: '38px' }}>
                      <Text style={{ fontSize: '12px', fontWeight: '700', color: '#222222' }}>{t('Call Response Rate')}</Text>
                      <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>
                        {t('is calculated by the ratio percentage of answered calls to total calls received.')}
                      </Text>
                    </div>
                  </Flex>

                  <div style={{ height: '1px', backgroundColor: '#F5F5F5', width: '260px' }} />

                  <Flex gap="8px" align="center" width="336px" justifyContent="space-between">
                    <Icon
                      icon="AvgCallResponse"
                      color={tenantTheme['gray500']}
                      size="14px"
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ width: '302px', height: '38px' }}>
                      <Text style={{ fontSize: '12px', fontWeight: '700', color: '#222222' }}>
                        {t('Average Call Response Time')}
                      </Text>
                      <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>
                        {t('is the average amount of time it takes to answer a call after it is routed to agent.')}
                      </Text>
                    </div>
                  </Flex>

                  <div style={{ height: '1px', backgroundColor: '#F5F5F5', width: '260px' }} />

                  <Flex gap="8px" align="center" width="336px" justifyContent="space-between">
                    <Icon
                      icon="AvgCallDuration"
                      color={tenantTheme['gray500']}
                      size="14px"
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ width: '302px', height: '38px' }}>
                      <Text style={{ fontSize: '12px', fontWeight: '700', color: '#222222' }}>
                        {t('Average Call Duration')}
                      </Text>
                      <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>
                        {t('is the average time spent on a call, from start to finish, including any hold or wait times.')}
                      </Text>
                    </div>
                  </Flex>
                </Flex>
              }
              trigger="hover"
            >
              <span style={{ display: 'inline-flex', cursor: 'pointer' }}>
                <Icon icon="TooltipInfoIcon" color={tenantTheme['gray500']} size="12px" />
              </span>
            </PopoverAntd>
          </Flex>
        ),
        dataIndex: 'call_insights',
        key: 'call_insights',
        component: 'String',
        width: 190,
        render: (data) => (
          <Flex align="flex-start" gap="5px" vertical justifyContent="space-between">
            <Flex gap="4px" align="center">
              <div style={{ fontSize: '12px', color: '#707070', fontWeight: '500' }}>{t('Response Rate')}</div>
              <div style={{ fontSize: '12px', color: '#222222', fontWeight: '600' }}>{data?.response_rate || 0}%</div>
              <PopoverAntd
                content={
                  <Flex vertical gap="8px" style={{ minWidth: '180px' }}>
                    <Flex justify="space-between" align="center">
                      <Text style={{ fontSize: '12px', color: '#222222' }}>{t('Total Calls')}</Text>
                      <Text style={{ fontSize: '12px', color: '#222222', fontWeight: '600' }}>
                        {formatNumberString(data?.total_calls || 0, { maximumFractionDigits: 0 })}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text style={{ fontSize: '12px', color: '#222222' }}>{t('Answered Calls')}</Text>
                      <Text style={{ fontSize: '12px', color: '#222222', fontWeight: '600' }}>
                        {formatNumberString(data?.answered_calls || 0, { maximumFractionDigits: 0 })}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text style={{ fontSize: '12px', color: '#222222' }}>{t('Missed Calls')}</Text>
                      <Text style={{ fontSize: '12px', color: '#222222', fontWeight: '600' }}>
                        {formatNumberString(data?.missed_calls || 0, { maximumFractionDigits: 0 })}
                      </Text>
                    </Flex>
                  </Flex>
                }
                trigger="hover"
              >
                <span style={{ display: 'inline-flex', cursor: 'pointer' }}>
                  <Icon icon="TooltipInfoIcon" color={tenantTheme['gray500']} size="11px" />
                </span>
              </PopoverAntd>
            </Flex>
            <Flex gap="4px">
              <div style={{ fontSize: '12px', color: '#707070', fontWeight: '500' }}>{t('Avg Call Duration')}</div>
              <div style={{ fontSize: '12px', color: '#222222', fontWeight: '600' }}>
                {data?.avg_call_duration || 0}
              </div>
            </Flex>
            <Flex gap="4px">
              <div style={{ fontSize: '12px', color: '#707070', fontWeight: '500' }}>{t('Avg Response Time')}</div>
              <div style={{ fontSize: '12px', color: '#222222', fontWeight: '600' }}>
                {data?.avg_response_time || 0}
              </div>
            </Flex>
          </Flex>
        ),
      },
      {
        title: (
          <Flex align="center" gap="4px">
            <span>{t('WhatsApp')}</span>
            <PopoverAntd
              content={
                <Flex vertical gap="12px" style={{ minWidth: '280px' }}>
                  <Flex gap="8px" align="center" width="336px" justifyContent="space-between">
                    <Icon
                      icon="WhatsappResponseRate"
                      color={tenantTheme['gray500']}
                      size="14px"
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ width: '302px', minheight: '38px' }}>
                      <Text style={{ fontSize: '12px', fontWeight: '700', color: '#222222' }}>
                        {t('WhatsApp Response Rate')}
                      </Text>
                      <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>
                        {t('is calculated by the ratio percentage of total number of chats initiated to the total number of messages received.')}
                      </Text>
                    </div>
                  </Flex>

                  <div style={{ height: '1px', backgroundColor: '#E0E0E0', width: '260px' }} />

                  <Flex gap="8px" align="center" width="336px" justifyContent="space-between">
                    <Icon
                      icon="AvgWhatsappResponseRate"
                      color={tenantTheme['gray500']}
                      size="14px"
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ width: '302px', height: '38px' }}>
                      <Text style={{ fontSize: '12px', fontWeight: '700', color: '#222222' }}>
                        {t('Average WhatsApp Response Time')}
                      </Text>
                      <Text style={{ fontSize: '12px', fontWeight: '400', color: '#222222' }}>
                        {t('is the time taken to initiate a chat after the WhatsApp message is sent.')}
                      </Text>
                    </div>
                  </Flex>
                </Flex>
              }
              trigger="hover"
            >
              <span style={{ display: 'inline-flex', cursor: 'pointer' }}>
                <Icon icon="TooltipInfoIcon" color={tenantTheme['gray500']} size="12px" />
              </span>
            </PopoverAntd>
          </Flex>
        ),
        dataIndex: 'whatsapp_insights',
        key: 'whatsapp_insights',
        component: 'String',
        width: 190,
        render: (data) => (
          <Flex align="flex-start" gap="5px" vertical justifyContent="space-between">
            <Flex gap="4px" align="center">
              <div style={{ fontSize: '12px', color: '#707070', fontWeight: '500' }}>{t('Response Rate')}</div>
              <div style={{ fontSize: '12px', color: '#222222', fontWeight: '600' }}>{data?.response_rate || 0}%</div>
              <PopoverAntd
                content={
                  <Flex vertical gap="8px" style={{ minWidth: '180px' }}>
                    <Flex justify="space-between" align="center">
                      <Text style={{ fontSize: '12px', color: '#222222' }}>{t('Total WhatsApp')}</Text>
                      <Text style={{ fontSize: '12px', color: '#222222', fontWeight: '600' }}>
                        {formatNumberString(data?.total_whatsapp || 0, { maximumFractionDigits: 0 })}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text style={{ fontSize: '12px', color: '#222222' }}>{t('Chat Initiated')}</Text>
                      <Text style={{ fontSize: '12px', color: '#222222', fontWeight: '600' }}>
                        {formatNumberString(data?.chat_initiated || 0, { maximumFractionDigits: 0 })}
                      </Text>
                    </Flex>
                  </Flex>
                }
                trigger="hover"
              >
                <span style={{ display: 'inline-flex', cursor: 'pointer' }}>
                  <Icon icon="TooltipInfoIcon" color={tenantTheme['gray500']} size="11px" />
                </span>
              </PopoverAntd>
            </Flex>
            <Flex gap="4px">
              <div style={{ fontSize: '12px', color: '#707070', fontWeight: '500' }}>{t('Avg Response Time')}</div>
              <div style={{ fontSize: '12px', color: '#222222', fontWeight: '600' }}>
                {data?.avg_response_time || 0}
              </div>
            </Flex>
          </Flex>
        ),
      },
      {
        title: t('Total Tasks'),
        dataIndex: 'total_tasks',
        key: 'total_tasks',
        component: 'String',
        width: 110,
        render: (data) => formatNumberString(data || 0, { maximumFractionDigits: 0 }),
      },
    ],
    list: userPerformanceData.users,
    pagination: userPerformanceData?.pagination,
  };
};
