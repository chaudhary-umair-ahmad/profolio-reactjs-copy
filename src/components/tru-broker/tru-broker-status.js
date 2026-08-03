import tenantTheme from '@theme';
import { Typography } from 'antd';
import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Avatar, Button, Card, Flex, TextWithIcon } from '../../components/common';
import { CardGradient } from '../../components/common/cards/styled';
import { CardMetaStyled } from '../../container/pages/user-settings/style';
import TruBrokerDrawer from './tru-broker-drawer';
import TruBrokerTag from './tru-broker-tag';
const { Text } = Typography;

import cx from 'clsx';
import TruBrokerCriteriaList from './tru-broker-criteria-list';

const TruBrokerStatus = ({ user }) => {
  const { t } = useTranslation();
  const truBrokerDrawerRef = useRef();

  const { isMobile } = useSelector((state) => state.app.AppConfig);

  return (
    <Card style={{ height: !isMobile && '220px', '--ant-padding-lg': '16px 24px' }}>
      <Flex gap="6px" align="center" justify="space-between" className="mb-12">
        <div className={cx('fw-500', isMobile ? 'fz-14' : 'fz-18')}>
          <Trans
            i18nKey={'truBroker'}
            components={{ div: <div className={'fw-500 fz-18'} />, span: <span className="fw-700" />, sup: <sup /> }}
          />
        </div>
        <Button
          size={isMobile && 'small'}
          type={'link'}
          style={{ paddingRight: 0 }}
          onClick={() => {
            truBrokerDrawerRef?.current && truBrokerDrawerRef?.current?.openDrawer();
          }}
        >
          {t('Learn More')}
        </Button>
      </Flex>

      <Card
        as={CardGradient}
        style={{
          '--gradient-val': '-14.6%',
          '--gradient-val1': '65.6%',
          background: !user?.is_tru_broker && `color-mix(in srgb, ${tenantTheme['danger-color']} 5%, #fff)`,
          borderWidth: 0,
        }}
        className="mb-16"
      >
        <Flex gap={isMobile ? '20px' : '50px'} align="center" justify="space-between" style={{ height: '100%' }}>
          <CardMetaStyled
            style={{ padding: user?.is_tru_broker ? 16 : 0 }}
            titleWhiteSpace="normal"
            avatar={!isMobile && <Avatar src={user?.profile_image} size={35} iconSize={30} />}
            title={
              <div className="fw-700" style={{ fontSize: isMobile ? '12px' : '14px' }}>
                {user?.is_tru_broker ? (
                  t("You're an active TruBroker™ this month")
                ) : (
                  <Trans i18nKey={'truBrokerBadgeMissed'} components={{ sup: <sup /> }} />
                )}
              </div>
            }
            description={
              user?.tru_broker_streak >= 1 && (
                <Flex align="center" gap="6px">
                  <Text type="secondary" className="fw-500 fz-12">
                    {t('TruBroker™ Streak')}
                  </Text>
                  <TextWithIcon
                    style={{ flexDirection: 'row-reverse' }}
                    icon={'SvgThunderGradient'}
                    gap="4px"
                    title={user?.tru_broker_streak + ' ' + t('Months')}
                    textSize="12px"
                  ></TextWithIcon>
                </Flex>
              )
            }
          />
          {user?.is_tru_broker && (
            <TruBrokerTag
              size={isMobile && '10px'}
              tagText={<Trans i18nKey={'truBroker'} components={{ sup: <sup />, span: <span className="fw-700" /> }} />}
            />
          )}
        </Flex>
        {!user?.is_tru_broker && (
          <div style={{ marginTop: '16px' }}>
            <TruBrokerCriteriaList
              cardPadding="12px"
              cardStyle={{
                '--ant-font-size': '12px',
              }}
              showCarousel
              user={user}
            />
          </div>
        )}
      </Card>
      <TruBrokerDrawer ref={truBrokerDrawerRef} user={user} />
    </Card>
  );
};
export default TruBrokerStatus;
