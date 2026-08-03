import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { Typography } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, DrawerModal, Flex, Group, Icon, notification, TextWithIcon, Alert } from '../../components/common';
import { CardCompact } from '../../components/common/cards/styled';
import { useLazyGetTruPointsCriteriaDataQuery } from '../../apis/user';
const { Title, Text } = Typography;

const TruPointsCriteriaPopUp = forwardRef((props, ref) => {
  const [truPointsCriteriaModalVisible, setTruPointsCriteriaModalVisible] = useState(false);
  const [truPointsCriteriaDetails, setTruPointsCriteriaDetails] = useState([]);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [getTruPointsCriteriaData, { isLoading: truPointsCriteriaLoading }] = useLazyGetTruPointsCriteriaDataQuery();

  const { t } = useTranslation();

  const showTruPointsCriteriaPopUp = () => {
    setTruPointsCriteriaModalVisible(true);
  };

  useImperativeHandle(ref, () => ({ showTruPointsCriteriaPopUp }));

  const fetchTruPointsCriteriaDetails = async () => {
    const response = await getTruPointsCriteriaData();
    if (response) {
      if (response?.error) {
        notification.error(response?.error);
      } else {
        setTruPointsCriteriaDetails(response?.data?.tru_points);
      }
    }
  };

  useEffect(() => {
    fetchTruPointsCriteriaDetails();
  }, []);

  return (
    <DrawerModal
      title={
        <div>
          <Title level={5} className="mb-0">
            {t('Get more visibility with TruPoints™')}
          </Title>
          <Text type="secondary" className="fw-400">
            {t('Earn TruPoints™ to boost your rank and stand out among other agents')}
          </Text>
        </div>
      }
      visible={truPointsCriteriaModalVisible}
      footer={null}
      width={!isMobile && '700'}
      onCancel={() => {
        setTruPointsCriteriaModalVisible(false);
      }}
      style={{
        '--ant-modal-header-bg':
          'linear-gradient(180deg, rgba(40, 177, 109, 0.15) 0%, rgba(76, 162, 205, 0.07) 108.09%)',
      }}
    >
      <Group
        className={'amenitiesModal'}
        template={`repeat(${isMobile ? 1 : 2}, minmax(min(20ch, 100%), 1fr))`}
        gap={'12px'}
      >
        {truPointsCriteriaDetails?.map((data, i) => (
          <Card
            key={i}
            compactCardPadding="12px 16px"
            bodyStyle={{ padding: '12px 16px', borderRadius: '8px' }}
            style={{ borderWidth: 1 }}
          >
            <Flex vertical={true} gap="4px">
              <TextWithIcon
                gap="10px"
                icon={tenantData?.truBrokerCriteriaIcons[data?.slug]?.icon}
                value={'+' + data?.points + ' ' + t('Points')}
                iconProps={{
                  color:
                    tenantData?.truBrokerCriteriaIcons[data?.slug]?.iconColor || tenantTheme['primary-color'] + 'aa',
                }}
                textColor={tenantTheme['primary-color'] + 'aa'}
                fontWeight="700"
                justify="space-between"
              />

              <Flex justify="space-between" align="center">
                <span>{tenantUtils.getLocalisedString(data, 'title')}</span>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Group>
      <div className="mb-16">
        <Alert
          style={{ '--ant-color-text-heading': tenantTheme['gray900'] }}
          showIcon
          icon={<Icon icon="InfoIcon" size={18} style={{ marginTop: '2px' }} />}
          type=""
          message={t('TruPoints older than 90 days will automatically expire')}
        />
      </div>
    </DrawerModal>
  );
});
export default TruPointsCriteriaPopUp;
