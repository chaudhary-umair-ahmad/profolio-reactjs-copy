import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Icon, Flex, Popover } from '../common';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { ViewTrendsIcon, BackTickIcon, ExclaimationIcon } from '../svg';

const { Text } = Typography;

const LeadsDashboardCard = ({ data = [], stats = [], title = {}, onViewTrendClick, showTooltip = false, tooltipText = '' }) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { locale } = useSelector((state) => state?.app?.AppConfig);

  const { t } = useTranslation();

  const renderMetricItem = (item, index) => (
    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Icon icon={item.icon} size={isMobile ? '14px' : '16px'} />
        <Text style={{ fontSize: isMobile ? '12px' : '14px', color: '#222222', fontWeight: '500' }}>{t(item.title)}</Text>
      </div>
      <Text style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700', color: '#222222' }}>
        {item?.value}
        {item?.suffix || ''}
      </Text>
    </div>
  );

  const renderCardDetails = (data, stats) => {
    return (
      <div
        style={{
          gap: '4px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Flex align="center" gap="8px">
            <Icon icon={title?.icon} size={isMobile ? '24px' : '36px'} style={{ color: '#1890ff' }} />
            <span style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '600' }}>{t(title?.title)}</span>
          </Flex>
          {isMobile && showTooltip && (
            <Popover
              placement="bottom"
              overlayStyle={{ width: '354px', maxWidth: 'calc(100vw - 32px)' }}
              overlayInnerStyle={{ padding: '12px' }}
              getPopupContainer={(triggerNode) => document.body}
              content={
                <div style={{ height: '49px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ExclaimationIcon size={22} />
                  </span>
                  <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                    <span style={{ fontWeight: 500, color: '#222222' }}>
                      {tooltipText}{' '}
                    </span>
                    <span style={{ fontWeight: 700, color: '#00B9FF' }}>+966920066800</span>
                    <span style={{ fontWeight: 500, color: '#222222' }}> {t('or')} </span>
                    <span style={{ fontWeight: 700, color: '#00B9FF' }}>contact-us@bayut.sa</span>
                    {locale === 'en' && (
                      <span style={{ fontWeight: 500, color: '#222222' }}>
                        {' '}
                        {t('to enable it.')}
                      </span>
                    )}
                  </div>
                </div>
              }
              action="hover"
            >
              <span style={{ display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ExclaimationIcon size={22} />
              </span>
            </Popover>
          )}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {showTooltip && (
                <Popover
                  placement="bottom"
                  overlayStyle={{ width: '354px', maxWidth: 'calc(100vw - 32px)' }}
                  overlayInnerStyle={{ padding: '12px' }}
                  getPopupContainer={(triggerNode) => document.body}
                  content={
                    <div style={{ height: '49px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <ExclaimationIcon size={22} />
                      </span>
                      <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                        <span style={{ fontWeight: 500, color: '#222222' }}>
                          {tooltipText}{' '}
                        </span>
                        <span style={{ fontWeight: 700, color: '#00B9FF' }}>+966920066800</span>
                        <span style={{ fontWeight: 500, color: '#222222' }}> {t('or')} </span>
                        <span style={{ fontWeight: 700, color: '#00B9FF' }}>contact-us@bayut.sa</span>
                        {locale === 'en' && (
                          <span style={{ fontWeight: 500, color: '#222222' }}>
                            {' '}
                            {t('to enable it.')}
                          </span>
                        )}
                      </div>
                    </div>
                  }
                  action="hover"
                >
                  <span style={{ display: 'inline-flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ExclaimationIcon size={22} />
                  </span>
                </Popover>
              )}
              <button
                onClick={onViewTrendClick}
                style={{
                  border: '0px',
                  backgroundColor: '#7676760F',
                  color: 'black',
                  fontSize: '12px',
                  height: '28px',
                  padding: '4px 12px',
                  borderRadius: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ViewTrendsIcon />
                {t('View Trend')}
                <span className="flipX" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <BackTickIcon />
                </span>
              </button>
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isMobile ? (
            <>
              {data?.slice(0, 2).map((item, index) => (
                <React.Fragment key={index}>
                  {renderMetricItem(item, index)}
                  {index < data.slice(0, 2).length - 1 && (
                    <div
                      style={{
                        width: '1px',
                        height: '40px',
                        backgroundColor: '#e9ecef',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {data?.map((item, index) => (
                <React.Fragment key={index}>
                  {renderMetricItem(item, index)}
                  {index < data.length - 1 && (
                    <div
                      style={{
                        width: '1px',
                        height: '40px',
                        backgroundColor: '#e9ecef',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
        {isMobile && (
          <div
            onClick={onViewTrendClick}
            style={{
              fontSize: '12px',
              color: '#006169',
              fontWeight: '600',
            }}
          >
            {t('View Details')}
          </div>
        )}

        {!isMobile && (
          <div
            style={{
              borderRadius: '4px',
              gap: '12px',
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            {stats?.map((item, index) => (
              <Flex
                key={index}
                align="center"
                style={{
                  padding: '8px 12px 8px 12px',
                  backgroundColor: '#F7F7F7',
                  display: 'flex',
                  width: '100%',
                  borderRadius: '4px',
                }}
              >
                <div
                  style={{
                    placeContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    flexShrink: 0,
                  }}
                >
                  <Icon icon={item?.icon || 'BsClock'} size="16px" />
                </div>
                <Flex vertical gap="2px">
                  <Text style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>{t(item.title)}</Text>
                  <Text style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{item.value}</Text>
                </Flex>
              </Flex>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card
      headStyle={{
        padding: '0px',
        borderBottom: 'none',
      }}
      bodyStyle={{
        padding: '0px',
        height: '100%',
      }}
      style={{
        width: 'fit-content',
        padding: '16px',
        '--ant-padding': 0,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: isMobile ? '314px' : '450px',
      }}
    >
      {renderCardDetails(data, stats)}
    </Card>
  );
};

export default LeadsDashboardCard;
