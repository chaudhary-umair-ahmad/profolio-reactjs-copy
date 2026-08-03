import { Col, Row, Skeleton } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import tenantConstants from '@constants';
import tenantTheme from '@theme';
import { Flex, Icon, Number, Tag } from '../../../../components/common';
import { formatPrice } from '../../../../utility/utility';

const Package = ({
  title,
  description,
  alertMessage,
  icon,
  iconColor,
  iconProps,
  iconBackgroundColor,
  hasVerifiedCheck,
  isRecommended,
  price,
  iconSize,
  discountedPrice,
  monthlyCredits,
  yearlyCredits,
  extraCredits,
  loading,
  packageColor,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Row align="middle" gutter={12}>
        {(icon || loading) && (
          <Col>
            {loading ? (
              <Skeleton.Avatar size={40} type="circle" />
            ) : (
              <Icon
                icon={icon || 'MdOutlineCircle'}
                styled
                iconProps={{ iconContainerSize: '2.8571em', bgOpacity: 0.14, ...iconProps }}
                size={iconProps?.size || '2em'}
              />
            )}
          </Col>
        )}
        <Col flex="1">
          {loading ? (
            <Skeleton paragraph={{ rows: 2 }} />
          ) : (
            <Row align="middle" gutter={12}>
              <Col flex="1">
                <div className="fw-600 mb-2" style={{ color: packageColor }}>
                  {t(title)}
                </div>
                {yearlyCredits && (
                  <div className="mb-2">
                    <strong className="fw-700 fs16">
                      <Number value={yearlyCredits} compact={false} />
                    </strong>{' '}
                    {t('Credits')}
                  </div>
                )}

                <Flex className="color-gray-dark" gap="12px">
                  {monthlyCredits && (
                    <div>
                      <strong>
                        <Number value={monthlyCredits} compact={false} />
                      </strong>
                      <span className="fs12">
                        {' '}
                        {t('Credits')}/{t('month')}
                      </span>
                    </div>
                  )}
                  {extraCredits && (
                    <Tag color="blue" shape="round" size="12px" style={{ lineHeight: 1.6 }}>
                      {t('Limited Offer!')} +{extraCredits} {t('Extra')}
                    </Tag>
                  )}
                </Flex>
              </Col>
              {alertMessage && <div className="color-gray-lightest mb-8">{alertMessage}</div>}
              <Col align="right" style={{ lineHeight: 'normal' }}>
                {price && (
                  <Flex gap="6px" className="color-primary fs18">
                    {tenantConstants.CURRENCY_SYMBOL()} <strong className="fw-700">{formatPrice(price)}</strong>
                  </Flex>
                )}
                {discountedPrice && (
                  <Flex gap="6px" className="color-gray-dark" justify="end">
                    <span
                      style={{
                        textDecoration: `line-through${tenantTheme['danger-color']}`,
                      }}
                    >
                      {tenantConstants.CURRENCY_SYMBOL()} {formatPrice(discountedPrice)}
                    </span>
                  </Flex>
                )}
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
};

export default Package;
