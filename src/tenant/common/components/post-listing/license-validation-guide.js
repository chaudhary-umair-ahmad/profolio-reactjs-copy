import tenantTheme from '@theme';
import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, Flex, Group, Icon, Modal } from '../../../../components/common';

const { Text, Title } = Typography;

const LicenseValidationGuide = ({ licenseModalVisible, setLicenseModalVisible }) => {
  const { t } = useTranslation();
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const licenseValidationSteps = [
    {
      id: 1,
      icon: 'FalLicenseIcon',
      title: t('FAL License'),
      description: t(
        'REGA issues the FAL License which certifies the agents & the agencies to practice real estate brokerage across the kingdom.',
      ),
    },
    {
      id: 2,
      icon: 'ContractIcon',
      title: t('Brokerage Contract'),
      description: t(
        'Licensed brokers issue a brokerage contract with the property owner through the official REGA website.',
      ),
    },
    {
      id: 3,
      icon: 'AdLicenseIcon',
      title: t('Ad License'),
      description: t(
        'Brokerage contract is used to secure an ad license for the property, allowing brokers to advertise that property',
      ),
    },
  ];
  return (
    <>
      <Modal
        title={t('Steps to Issue Real Estate Advertisement Licenses')}
        visible={licenseModalVisible}
        onCancel={() => setLicenseModalVisible(false)}
        footer={null}
        width={800}
      >
        <>
          <Group template={isMobile ? '1fr' : 'repeat(3, 1fr)'} gap="14px">
            {licenseValidationSteps.map((item) => (
              <Card
                style={{
                  borderWidth: 0,
                  '--ant-padding-lg': isMobile ? '12px' : '24px',
                  backgroundColor: tenantTheme['primary-light-4'],
                }}
                key={item.id}
              >
                <Flex align="start" vertical={true} gap="8px">
                  <Icon icon={item.icon} iconProps={{ size: isMobile ? '24px' : '30px' }} />
                  <div>
                    <Text className="fw-700" style={{ fontSize: isMobile && '12px' }}>
                      {t(`Step ${item?.id}`)}
                    </Text>
                    <Title
                      className="mb-8 mt-0"
                      level={5}
                      style={{
                        '--ant-font-weight-strong': '700',
                        '--ant-color-text-heading': tenantTheme['primary-color'],
                        fontSize: isMobile ? '14px' : '16px',
                      }}
                    >
                      {t(item?.title)}
                    </Title>
                    <Text className={isMobile ? 'fz-12' : 'fz-14'} style={{ color: tenantTheme['base-color'] }}>
                      {t(item?.description)}
                    </Text>
                  </div>
                </Flex>
              </Card>
            ))}
          </Group>
        </>
      </Modal>
    </>
  );
};
export default LicenseValidationGuide;
