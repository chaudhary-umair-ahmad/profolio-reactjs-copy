import tenantTheme from '@theme';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { Col, Divider, Row, Space } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { HistoryDot, HistoryPackage, HistoryPackageDate } from '../../container/pages/credits-usage/styled';
import { getBaseURL } from '../../utility/env';
import { Card, Group, Icon, Image, Number, ProductTag, Tag, TextWithIcon } from '../common';
import { Text } from '../common/textWithIcon/styled';
import { Thumbnail } from '../styled';
import { DATE_BEFORE_TIME_FORMAT } from '../../constants/formats';
import { getTimeDateString } from '../../utility/date';

export const HistoryBreakdown = ({ item, style, singleItemHeight, setSingleItemHeight, loading }) => {
  const li = useRef(null);
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const isSidebarResponsiveModeEnabled = !!tenantConstants.PUSH_CONTENT_ON_SIDEBAR_EXPAND;

  useEffect(() => {
    const curElHeight = singleItemHeight;
    if (li?.current) {
      if (curElHeight < li?.current.offsetHeight) {
        setSingleItemHeight(li?.current.offsetHeight);
      }
    }
  }, [li]);

  const getLocationTitle = useCallback(
    (item) => {
      const filteredTitles = item?.location?.breadcrumb
        .filter((e) => e.level > 1)
        .map((e) => tenantUtils.getLocalisedString(e, 'title'));
      return filteredTitles?.reverse().join(', ');
    },
    [item],
  );

  const renderCreditsTag = (item) => {
    switch (item?.action_performed) {
      case 'consumed':
        return (
          <>
            <Tag shape="round" bordered style={{ alignSelf: 'center', fontSize: 14 }}>
              <Space.Compact style={{ gap: 4 }}>
                <Icon icon="GiTwoCoins" color="#FE9923" />
                <span className="base-color semiBold">{item?.credits_quantity}</span> {t('Used')}
              </Space.Compact>
            </Tag>
          </>
        );
      case 'reverted':
        return (
          <>
            <Tag
              shape="round"
              style={{
                alignSelf: 'center',
                fontSize: 12,
                backgroundColor: tenantTheme['success-color'] + 10,
                borderColor: tenantTheme['success-color'] + 70,
              }}
            >
              <Space.Compact style={{ gap: 4 }}>
                <Icon icon="GiTwoCoins" color="#FE9923" />
                <span className="base-color semiBold">{item?.credits_quantity}</span> {t('Refunded')}
              </Space.Compact>
            </Tag>
          </>
        );
      default:
        break;
    }
  };

  const renderListingLog = (item) => {
    switch (item?.action_performed) {
      case 'consumed':
        return (
          <>
            <div className="mb-8 flex align-items-center" style={{ gap: 5, flexWrap: 'wrap' }}>
              <ProductTag icon={item?.icon} iconProps={item?.iconProps} name={item?.product?.name} />
              <span className={isMobile ? 'fz-12' : null}>{t('applied to listing')}</span>{' '}
              <strong>{item?.listing?.id}</strong>
              {!!Object.keys(item?.performed_by).length &&
                `${t(' by ')} ${tenantUtils.getLocalisedString(item?.performed_by, 'name')}`}
            </div>
          </>
        );
      case 'reverted':
        return (
          <div className="mb-8">
            <Text type="success" className="fw-700">
              {item?.credits_quantity} {t('Credits ')}
            </Text>
            {t('have been refunded due to unsuccessful posting of ')} {item?.product?.name}
            <span>
              {t(' ID')} <strong>{item?.listing?.id}</strong>
            </span>
          </div>
        );

      default:
        break;
    }
  };

  return (
    <Row gutter={isMobile ? 8 : 16} wrap={false} style={{ ...style, paddingBlockEnd: 24 }} ref={li}>
      <Col flex={isMobile ? '32px' : '38px'}>
        <HistoryPackage>
          <HistoryDot />
          <Divider type="vertical" orientation="center" />
        </HistoryPackage>
      </Col>
      <Col flex="auto">
        <Card style={{ borderWidth: 1 }} bodyStyle={{ padding: isMobile ? 12 : 24 }}>
          <Row justify="space-between" wrap={!(isSidebarResponsiveModeEnabled && !isMobile)}>
            <Col flex={isSidebarResponsiveModeEnabled && !isMobile ? 'auto' : undefined} style={{ minWidth: 0 }}>
              {renderListingLog(item)}
              <Card
                style={{
                  width: isMobile ? 'auto' : isSidebarResponsiveModeEnabled ? '100%' : 500,
                  maxWidth: isMobile ? undefined : 500,
                  backgroundColor: tenantTheme['primary-light-4'],
                  borderColor: tenantTheme['primary-light-3'],
                  borderWidth: 1,
                }}
              >
                <Row gutter={12} wrap={false}>
                  <Col flex="none" style={{ width: isMobile ? 86 : 106 }}>
                    <Thumbnail>
                      <Image
                        src={item?.listing?.image?.thumbnail}
                        fallback={`${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
                      />
                    </Thumbnail>
                  </Col>
                  <Col flex="auto">
                    <Group template="initial" gap={isMobile ? '0px' : '2px'} className={isMobile ? 'fs12' : null}>
                      <Number
                        type="price"
                        compact={false}
                        value={item?.listing?.price}
                        style={{ color: tenantTheme['primary-color'], fontWeight: 700 }}
                      />

                      <div>{getLocationTitle(item)}</div>

                      <Tag
                        color={tenantTheme['primary-light-3']}
                        style={{ '--tag-color': tenantTheme['primary-color'], fontWeight: '700', width: 'max-content' }}
                      >
                        {tenantUtils.getLocalisedString(item?.listing?.type, 'title')}{' '}
                        {t('for ' + item?.listing?.purpose?.title)}
                      </Tag>

                      <Space size={isMobile ? 12 : 30} className="color-gray-dark">
                        <TextWithIcon
                          icon="IconBedroom"
                          title={`${item?.listing?.beds > 0 ? item?.listing?.beds : 0} ${t('Rooms')}`}
                          textColor={tenantTheme['text-color-secondary']}
                        />
                        <TextWithIcon
                          icon="IconAreaSize"
                          title={`${item?.listing?.area_unit?.value} ${t('Sq. M.')}`}
                          textColor={tenantTheme['text-color-secondary']}
                        />
                      </Space>
                    </Group>
                  </Col>
                </Row>
              </Card>
            </Col>
            <HistoryPackageDate
              flex={isSidebarResponsiveModeEnabled && !isMobile ? 'none' : undefined}
              style={isSidebarResponsiveModeEnabled && !isMobile ? { marginInlineStart: 16 } : {}}
            >
              <div className="color-gray-dark" style={{ whiteSpace: 'nowrap' }}>
                {getTimeDateString(item.appliedDate, DATE_BEFORE_TIME_FORMAT)}
              </div>
              {renderCreditsTag(item)}
            </HistoryPackageDate>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
