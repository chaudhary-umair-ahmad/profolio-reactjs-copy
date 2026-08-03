import tenantRoutes from '@routes';
import { Typography } from 'antd';
import React, { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Drawer, Flex, Heading, Icon } from '../../../../components/common';
import { CreditIcon } from '../../../../components/svg';
import useRouteNavigate from '../../../../hooks/useRouteNavigate';

const { Title, Text } = Typography;

const CreditInfoDrawer = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { isMobile, isMemberArea, locale } = useSelector((state) => state.app.AppConfig);
  const navigate = useRouteNavigate();

  const creditDrawerContent = useMemo(
    () => [
      {
        id: 1,
        backgroundColor: '#FCF7F1',
        icon: 'CreditAvailableIcon',
        heading: 'Available Credits',
        content: () => (
          <Text type="secondary" className={isMobile && 'fz-12'}>
            {t('The available credits for your agency can be found in the')}{' '}
            {isMemberArea ? (
              t('Dashboard')
            ) : (
              <Typography.Text
                onClick={() => {
                  navigate(tenantRoutes.app().dashboard.path);
                  ref.current.closeDrawer(true);
                }}
                style={{ textDecoration: 'underline', color: '#1890ff', cursor: 'pointer' }}
              >
                {t('Dashboard')}
              </Typography.Text>
            )}{' '}
            {t('and')}{' '}
            {isMemberArea ? (
              t('Credits Usage')
            ) : (
              <Link style={{ textDecoration: 'underline' }} to={tenantRoutes.app().credits_usage.path}>
                {t('Credits Usage')}
              </Link>
            )}
            .
          </Text>
        ),
      },
      {
        id: 2,
        backgroundColor: '#EBF5FF',
        icon: 'CreditUsedIcon',
        heading: 'Using Credits',
        content: () => (
          <Text type="secondary" className={isMobile && 'fz-12'}>
            {t(
              'Credits are used when a listing is published or when a listing is upgraded such as Hot or Featured. Credit usage can be viewed in detail in the ',
            )}{' '}
            {isMemberArea ? (
              t('Credits Usage')
            ) : (
              <Link style={{ textDecoration: 'underline' }} to={tenantRoutes.app().credits_usage.path}>
                {t('Credits Usage')}
              </Link>
            )}
            .
          </Text>
        ),
      },
    ],
    [],
  );

  return (
    <Drawer
      ref={ref}
      title={<div className="fw-700"> {t('Credits')}</div>}
      width={isMobile ? '100vw' : '40vw'}
      placement={locale === 'ar' ? 'left' : 'right'}
      onCloseDrawer={() => {}}
      hideButton="true"
      footer={null}
    >
      <Flex gap="8px">
        <Heading as="h4" style={{ fontSize: isMobile && '16px' }}>
          {t('What are Credits?')}
        </Heading>
        <CreditIcon size={24} />
      </Flex>
      <Text type="secondary" className={isMobile && 'fz-12 color-gray-dark'}>
        {t(
          'Credits are the currency. This credits system makes it easier and more flexible for you to advertise your properties. When you sign a contract with us, you will receive credits that you can use to post property listings or upgrade them to increase your listings visibility.',
        )}
      </Text>
      <Title level={isMobile ? 5 : 4}>{t('Here’s some information to help you get started:')}</Title>
      <Flex vertical gap={isMobile ? '10px' : '16px'}>
        {creditDrawerContent.map((item) => (
          <Card
            bodyStyle={{ padding: isMobile ? '12px' : '20px' }}
            style={{ backgroundColor: item.backgroundColor, border: 0, borderRadius: isMobile && '6px' }}
            key={item.id}
            title={item.title ? t(item.title) : undefined}
          >
            <Flex vertical align="start" gap={isMobile ? '10px' : '16px'}>
              <Icon icon={item.icon} size={isMobile ? 24 : 32} />
              <Title className="mb-0" level={isMobile ? 5 : 4}>
                {t(item.heading)}
              </Title>
              {item.content()}
            </Flex>
          </Card>
        ))}
      </Flex>
    </Drawer>
  );
});

export default CreditInfoDrawer;
