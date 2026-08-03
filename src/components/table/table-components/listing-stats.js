import tenantTheme from '@theme';
import tenantConstants from '@constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Flex, Icon, Number, Popover, Skeleton, TextWithIcon } from '../../common';
import Group from '../../common/group/group';
import { useSelector } from 'react-redux';

export const ListingStats = (props) => {
  const { t } = useTranslation();
  const { data = [] } = props;
  const user = useSelector((state) => state?.app?.loginUser?.user);

  const renderLeadsStatsContent = (data) => {
    const fieldMapping = [
      {
        title: 'Calls',
        icon: 'IoCall',
        value: null,
        fields: [
          { title: 'Calls Clicked', value: data?.calls || 0 },
          // ...(user?.is_lms_enabled && user?.is_call_tracking_enabled && tenantConstants.IS_LMS_ENABLED
          //   ? [
          //       { title: 'Calls Received', value: data?.calls_received || 0 },
          //       { title: 'Calls Answered', value: data?.calls_answered || 0 },
          //       { title: 'Calls Missed', value: data?.calls_missed || 0 },
          //     ]
          //   : []),
        ],
      },
      {
        title: 'Whatsapp',
        value: null,
        icon: 'RiWhatsappFill',
        fields: [
          { title: 'WhatsApp Clicked', value: data?.whatsapp || 0 },
          ...(user?.is_lms_enabled && user?.is_whatsapp_tracking_enabled && tenantConstants.IS_LMS_ENABLED
            ? [
                { title: 'WhatsApp Sent', value: data?.whatsapp_sent || 0 },
                { title: 'Chats Initiated', value: data?.whatsapp_chats || 0 },
              ]
            : []),
        ],
      },
      {
        title: 'Emails',
        icon: 'FaEnvelope',
        value: null,
        fields: [
          { title: 'Emails Clicked', value: data?.emails_clicked || 0 },
          { title: 'Emails Received', value: data?.emails_received || 0 },
        ],
      },
      { title: 'SMS', icon: 'MdSms', value: data?.sms || 0, fields: [] },
    ];
    return (
      <>
        {fieldMapping?.map((item, index) => (
          <React.Fragment key={index}>
            <Flex justify="space-between">
              <TextWithIcon
                textColor={tenantTheme['primary-color']}
                iconProps={{
                  size: '14px',
                  color: tenantTheme['primary-color'],
                }}
                title={t(item?.title)}
                icon={item.icon}
              />
              <strong>{item.value}</strong>
            </Flex>
            {!!item?.fields?.length &&
              item?.fields?.map((e, index) => (
                <Flex key={index} gap="60px" justify="space-between">
                  <span>{t(e.title)}</span>
                  <strong>{e.value}</strong>
                </Flex>
              ))}

            {index < fieldMapping?.length - 1 && <Divider dashed style={{ marginBlock: 4 }} />}
          </React.Fragment>
        ))}
      </>
    );
  };

  const renderStats = (label, stat, data) => {
    return (
      <Flex align="center" gap="8px">
        <div className="text-muted fz-12">{t(label)}</div>
        {stat === 'loading' ? <Skeleton size="small" /> : stat ? <Number value={stat} compact={false} /> : '0'}
        {label === 'Leads' && (
          <Popover
            content={
              user?.is_lms_enabled && tenantConstants.IS_LMS_ENABLED ? (
                renderLeadsStatsContent(data)
              ) : (
                <div style={{ width: 120 }}>
                  <Flex justify="space-between">
                    <span>{t('Calls')}</span>
                    <span>{data?.calls ? data?.calls : 0}</span>
                  </Flex>
                  <Flex justify="space-between">
                    <span>{t('Whatsapp')}</span>
                    <span>{data?.whatsapp ? data?.whatsapp : 0}</span>
                  </Flex>
                  <Flex justify="space-between">
                    <span>{t('SMS')}</span>
                    <span>{data?.sms ? data?.sms : 0}</span>
                  </Flex>
                  <Flex justify="space-between">
                    <span>{t('Email')}</span>
                    <span>{data?.emails_clicked ? data?.emails_clicked : 0}</span>
                  </Flex>
                </div>
              )
            }
            action="hover"
            getPopupContainer={() => document.body}
          >
            <>
              <Icon icon="AiOutlineInfoCircle" size="1em" color={tenantTheme['primary-color']} />
            </>
          </Popover>
        )}
      </Flex>
    );
  };

  return (
    <Group gap="8px">
      {data.map((item) => (
        <div key={item.slug}>
          {renderStats('Views', item?.views)}
          {renderStats('Clicks', item?.clicks)}
          {renderStats('Leads', item?.leads, item)}
        </div>
      ))}
    </Group>
  );
};
