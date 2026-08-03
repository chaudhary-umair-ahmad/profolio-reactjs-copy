import tenantData from '@data';
import tenantRoutes from '@routes';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Card, Col, Row, Typography } from 'antd';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { formatPrice } from '../../utility/utility';
import { Flex, Icon, LinkWithIcon } from '../common';

import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useGetLocation } from '../../hooks';
import { isKeycloakDisabledForPath } from '@/utility/helpers';

const { Text } = Typography;

const AvailableCredit = styled((props) => <Card {...props} />)`
  &.available-credit-card {
    background-color: ${tenantTheme['primary-light-4']};
    border-color: #f2fafa;
    border-radius: 6px;
  }
`;

const CreditInfo = (props) => {
  const { isMobile, offset, cardStyle, className, style } = props;
  const { user } = useSelector((state) => state.app.loginUser);

  const location = useGetLocation();

  const { t } = useTranslation();

  const activePackage = useMemo(
    () =>
      user?.package && {
        ...tenantData.getPackageBySlug(user?.package?.slug),
        name: tenantUtils.getLocalisedString(user?.package, 'name'),
      },
    [user],
  );

  return (
    <Row style={{ width: !isMobile && '640px', ...cardStyle }} className={className}>
      <Col offset={offset} className="w-100">
        <AvailableCredit className=" available-credit-card" styles={{ body: { padding: '8px 12px' } }}>
          <Flex justify="space-between" align="center" gap="10px">
            {activePackage ? (
              <Flex gap="10px" align="center">
                <Icon
                  icon={activePackage?.icon || 'MdOutlineCircle'}
                  styled
                  iconProps={{ iconContainerSize: '24px', bgOpacity: 0.14, ...activePackage?.iconProps }}
                  size={16}
                />
                <Text className="fw-700" style={{ color: activePackage?.textColor || '#000' }}>
                  {activePackage?.name}
                </Text>
              </Flex>
            ) : (
              <div>
                {!isKeycloakDisabledForPath() &&
                  <LinkWithIcon
                    linkTitle={t('Get a Package')}
                    link={`${tenantRoutes.app('', false, user).prop_shop.path}?redirectUrl=${location.pathname}`}
                    iconColor="var(--primary-color)"
                    color="var(--primary-color)"
                    fontWeight="700"
                  />}
                <Text type="secondary" className="mb-0 fz-12" style={{ display: 'block' }}>
                  <Trans
                    i18nKey="Avail discounted credits, access to ProfolioTM, lead & staff management, reports and much more"
                    components={{ sup: <sup /> }}
                  />
                </Text>
              </div>
            )}

            <Text className={'fz-12 fw-600'} type="secondary" style={{ whiteSpace: 'nowrap' }}>
              {t('Available Credits')}
              {': '}
              <span className="fw-700 fz-14" style={{ color: '#222', paddingInlineStart: '6px' }}>
                {formatPrice(
                  Math.round(
                    Number(user?.credits?.ksa?.available ?? user?.credits?.bayut?.available ?? 0) || 0,
                  ),
                )}
              </span>
            </Text>
          </Flex>
        </AvailableCredit>
      </Col>
    </Row>
  );
};

export default CreditInfo;
