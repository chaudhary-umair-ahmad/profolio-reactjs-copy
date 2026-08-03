import tenantConstants from '@constants';
import tenantData from '@data';
import React, { useState } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, DrawerModal, Flex, Group, IconWithSubtext, TextWithIcon } from '../../../../../components/common';
import { upgradePackageConfirmClickEvent } from '../../../../../services/analyticsService';
import { formatNumberString, formatPrice } from '../../../../../utility/utility';
const { Text } = Typography;

const UpgradePackageModal = ({
  upgradeModalVisible,
  setUpgradeModalVisible,
  packageData,
  onGetPackageClick,
  refundable_amount,
  packageDuration,
}) => {
  const [upgradeButtonLoading, setUpgradeButtonLoading] = useState(false);
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.app.loginUser);
  const type = tenantData.slugToType?.[packageData?.slug];

  const handlePackageUpgrade = (packageData) => {
    setUpgradeButtonLoading(true);
    onGetPackageClick(packageData?.id, () => setUpgradeButtonLoading(false), packageData?.name , packageData?.total_credits);
  };

  return (
    <DrawerModal
      titleClassName
      title={<div className="fw-700">{`${t('Upgrade to ')}${packageData?.name}`}</div>}
      visible={upgradeModalVisible}
      bodyStyle={{ padding: '24px' }}
      width={475}
      onCancel={() => setUpgradeModalVisible(false)}
      footer={
        <Group template="1fr 120px" className="align-items-center" gap="5px">
          <Text className="text-left fz-18 lhn">
            <span className="color-gray-dark fz-12">{t('Amount to Pay')}</span>
            <div className="fz-20 fw-700">
              <span className="fw-400 fz-16">{tenantConstants.CURRENCY_SYMBOL()} </span>
              {formatNumberString(packageData?.price, false)}
            </div>
          </Text>
          <Button
            type={'primary'}
            key="submit"
            loading={upgradeButtonLoading}
            onClick={() => {
              handlePackageUpgrade(packageData);
              upgradePackageConfirmClickEvent(user);
            }}
            size="large"
          >
            {t('Upgrade')}
          </Button>
        </Group>
      }
    >
      <Flex gap="10px" justify="space-between" className="mb-20">
        <TextWithIcon
          title={packageData?.name}
          icon={packageData?.icon}
          iconProps={{
            ...packageData?.iconProps,
            hasBackground: true,
            iconBackgroundColor: tenantData.packages?.[type]?.packageColor,
          }}
        />
        <IconWithSubtext
          className="mb-8"
          title={formatPrice(packageData?.credits_per_month)}
          subText={t("credits")}
          textSize="20px"
          gap={'4px'}
          justify="center"
        />
      </Flex>
      <div className="mb-8">
        <Flex justify="space-between" gap="20px">
          <Text type="secondary">{t('Package Price')}</Text>
          <Text className="fw-700">
            <span className="fw-400 color-gray-dark fz-12">{tenantConstants.CURRENCY_SYMBOL()} </span>
            {formatNumberString(packageData?.price, false)}
          </Text>
        </Flex>
      </div>
      {refundable_amount && (
        <div>
          <Flex justify="space-between" gap="20px">
            <Text type="secondary">{t('Adjustments from the current package')}</Text>
            <Text className="fw-700" style={{ whiteSpace: 'nowrap' }}>
              <span className="fw-400 color-gray-dark fz-12">{tenantConstants.CURRENCY_SYMBOL()} </span>
              {'-' + formatNumberString(refundable_amount, false)}
            </Text>
          </Flex>
        </div>
      )}
    </DrawerModal>
  );
};
export default UpgradePackageModal;
