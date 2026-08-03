import React from 'react';
import { Flex, Group, Icon, Number, Skeleton } from '../../../../components/common';
import tenantTheme from '@theme';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DrawerPopover from '../../../../components/common/drawerPopover/drawerPopover';

const ListingsStats = ({ disposition, stats, ...props }) => {
  const { t } = useTranslation();

  const { user } = useSelector((state) => state.app.loginUser);
  const isMultiPlatform = user?.isMultiPlatform;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const platformSlug = props?.slug;
  const { views, clicks, leads } = stats;
  const renderStats = (label, stat, data) => {
    return (
      <Flex vertical align="start" gap="0px">
        {stat === 'loading' ? (
          <Skeleton size="small" />
        ) : stat ? (
          <Number value={stat} className="fs16" compact={false} style={{ fontWeight: '700' }} />
        ) : (
          <Number value={'0'} className="fs16" style={{ fontWeight: '700' }} />
        )}
        <Flex align="center" gap="4px">
          <div className="text-muted fs12 fw-500">{t(label)}</div>

          {label === 'Leads' && (
            <DrawerPopover
              getTooltipContainer={null}
              getPopupContainer={null}
              overlayClassName="quality-popupContainer"
              footer={null}
              height={'auto'}
              title={t('Performance')}
              action="hover"
              overlayStyle={{ '--width': '250px', '--spacing': '16px' }}
              content={
                <Flex vertical gap={!isMobile ? '0px' : '12px'}>
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
                    <span>{data?.emails ? data?.emails : 0}</span>
                  </Flex>
                </Flex>
              }
            >
              <>
                <Icon icon="FaCaretDown" size="16px" color={tenantTheme['primary-color']} />
              </>
            </DrawerPopover>
          )}
        </Flex>
      </Flex>
    );
  };
  return (
    <>
      <Group gap="8px">
        <Flex key={props.slug} gap={isMobile ? '14px' : '26px'}>
          {renderStats('Views', views)}
          {renderStats('Clicks', clicks)}
          {renderStats('Leads', leads, props?.[platformSlug])}
        </Flex>
      </Group>
    </>
  );
};

export default ListingsStats;
