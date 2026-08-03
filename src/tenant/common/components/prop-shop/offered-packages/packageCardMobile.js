import tenantData from '@data';
import tenantTheme from '@theme';
import tenantUtils from '@utils';
import tenantConstants from '@constants';
import { Card, Typography } from 'antd';
import cx from 'clsx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IconStyled } from '../../../../../components/common/icon/IconStyled.js';
import { Button, Flex, Heading, Icon, IconWithSubtext, Tag } from '../../../../../components/common/index.js';
import RenderTextLtr from '../../../../../components/render-text/render-text.js';
import { formatPrice } from '../../../../../utility/utility.js';
import UpgradePackageModal from './package-upgrade-modal.js';

const { Text } = Typography;

export const PackageCardMobile = ({ packageData, onGetPackageClick, refundable_amount }) => {
  const { isMobile, rtl } = useSelector((state) => state.app.AppConfig);

  const { t } = useTranslation();

  const [buttonLoading, setButtonLoading] = useState();
  const type = tenantData.slugToType?.[packageData?.slug];
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const isMemberArea = useSelector((state) => state.app.AppConfig.isMemberArea);
  const { user } = useSelector((state) => state.app.loginUser);

  const handleGetPackage = (packageData) => {
    if (isMemberArea || !user?.package || !tenantConstants.ALLOW_PACKAGE_UPGRADE) {
      setButtonLoading(true);
      onGetPackageClick(packageData?.id, () => setButtonLoading(false), packageData?.name , packageData?.total_credits);
    } else {
      setUpgradeModalVisible(true);
    }
  };

  return (
    <Card
      style={{ borderWidth: 1 }}
      className={cx('pos-rel  w-100 text-center', type === 'titanium' ? 'titanium-card' : 'package-list')}
      disabled={user?.package?.slug == packageData.slug || !packageData?.is_applicable}
    >
      <Flex justify="space-between" vertical>
        <Flex className="mb-16" justify="space-between" gap="20px" style={{ paddingBlockStart: '28px' }}>
          <Flex gap="8px">
            <IconStyled
              className="mb-8"
              style={{
                '--icon-bg-color': tenantData.packages?.[type]?.packageColor || 'default-color',
                '--icon-styled-width': '32px',
              }}
            >
              <Icon
                size={18}
                icon={tenantData.packages?.[type]?.icon}
                iconProps={tenantData.packages?.[type]?.iconProps}
              />
            </IconStyled>
            <Flex vertical align="start">
              <Heading as="h6" className="mb-0" style={{ fontSize: '16px' }}>
                {<RenderTextLtr text={packageData?.name} />}
              </Heading>
              <div
                className={!isMemberArea && user?.package && packageData?.is_applicable ? 'text-left' : null}
                style={!isMemberArea && user?.package && packageData?.is_applicable ? { fontStyle: 'italic' } : {}}
              >
                <Text type="secondary" className="fz-12">
                  {isMemberArea ||
                  !user?.package ||
                  user?.package?.slug == packageData?.slug ||
                  !packageData?.is_applicable ? (
                    tenantConstants.CURRENCY_SYMBOL()
                  ) : (
                    <>
                      <span className="fw-500" style={{ color: '#222' }}>
                        {t('Pay')}
                      </span>{' '}
                      <span className="fw-700 base-color">{tenantConstants.CURRENCY_SYMBOL()}</span>
                    </>
                  )}
                </Text>
                <span className="fw-700 fz-12" style={{ marginInlineStart: '4px' }}>
                  {isMemberArea ||
                  !user?.package ||
                  user?.package?.slug === packageData?.slug ||
                  !packageData?.is_applicable ||
                  !tenantConstants.ALLOW_PACKAGE_UPGRADE ? (
                    formatPrice(packageData.net_amount)
                  ) : (
                    <>
                      {refundable_amount
                        ? formatPrice(packageData.net_amount - refundable_amount)
                        : formatPrice(packageData.net_amount)}{' '}
                      <span className="fw-400">{t(' to Upgrade')}</span>
                    </>
                  )}
                </span>
              </div>
            </Flex>
          </Flex>

          <IconWithSubtext
            vertical={true}
            title={formatPrice(packageData.credits_per_month)}
            subText={t('credits')}
            textSize="20px"
            justify="center"
            style={{ lineHeight: isMobile && 1.2 }}
          />
        </Flex>

        {packageData?.isMultiPlatform && (
          <Flex align="center" gap="4px" className="mb-16">
            {tenantData?.platformList?.map((item, index) => (
              <Card
                className="w-100"
                key={index}
                style={{
                  '--ant-padding-lg': '8px',
                  borderColor: tenantTheme['primary-light-1'] + 'aa',
                  borderRadius: '6px',
                }}
              >
                <Flex align="center" justify="center" gap="4px">
                  <Icon size={28} icon={item.icon} iconProps={item.iconProps || { width: '18px', height: '18px' }} />
                  <Text className="text-primary fw-700" style={index != 0 ? { marginLeft: '-2px' } : {}}>
                    {packageData?.platforms?.[item?.slug]?.credits_per_month}
                  </Text>
                  <Icon size={14} icon={'IconTotalCredit'} />
                </Flex>
              </Card>
            ))}
          </Flex>
        )}
        <div className="mb-16">
          {Object.entries(packageData.additional_info?.options).map(([key, value], index) => (
            <Flex justify="space-between" align="center" key={index}>
              <Text className="mb-12 fz-12" type="secondary">
                {tenantUtils.getLocalisedString(value, 'name')}
              </Text>
              {value.value == 'no' ? (
                <Icon icon="RxCross2" size="18px" color="#F73131" />
              ) : value.value == 'yes' ? (
                <Icon icon="GiCheckMark" className="text-primary" />
              ) : (
                <Text className="mb-12 fz-12" type="secondary">
                  {tenantUtils.getLocalisedString(value, 'value')}
                </Text>
              )}
            </Flex>
          ))}
        </div>
      </Flex>
      <Button
        loading={buttonLoading}
        className="w-100"
        type={type == 'titanium' ? 'primary' : 'primaryOutlined'}
        onClick={() => {
          handleGetPackage(packageData);
        }}
      >
        {user?.package?.slug == packageData.slug ? (
          t('Current Package')
        ) : !packageData?.is_applicable ? (
          t('Downgrade Unavailable')
        ) : (
          <RenderTextLtr text={`${t('Get')}  ${packageData.name}`} />
        )}
      </Button>
      <UpgradePackageModal
        upgradeModalVisible={upgradeModalVisible}
        setUpgradeModalVisible={setUpgradeModalVisible}
        packageData={packageData}
        onGetPackageClick={onGetPackageClick}
        refundable_amount={refundable_amount}
      />
      <Tag
        color={type == 'titanium' ? '#F3D9FF4F' : '#F2FAFA'}
        style={{ color: type == 'titanium' ? '#B58DFF' : tenantTheme['primary-color'] }}
        className={cx('listing-tag')}
        size="12px"
      >
        {t('Save')} {rtl && '%'}
        {packageData.additional_info?.discount}
        {!rtl && '%'}
      </Tag>
    </Card>
  );
};
