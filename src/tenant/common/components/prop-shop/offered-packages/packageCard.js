import tenantData from '@data';
import tenantTheme from '@theme';
import tenantConstants from '@constants';

import tenantUtils from '@utils';
import { Typography } from 'antd';
import cx from 'clsx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IconStyled } from '../../../../../components/common/icon/IconStyled.js';
import { Button, Card, Flex, Heading, Icon, IconWithSubtext, Tag } from '../../../../../components/common/index.js';
import RenderTextLtr from '../../../../../components/render-text/render-text.js';
import { packageSelectEvent } from '../../../../../services/analyticsService/index.js';
import { formatPrice } from '../../../../../utility/utility.js';
import UpgradePackageModal from './package-upgrade-modal.js';
const { Text } = Typography;

export const PackageCard = ({ packageData, onGetPackageClick, refundable_amount, packageDuration }) => {
  const { rtl, isMemberArea } = useSelector((state) => state.app.AppConfig);
  const [buttonLoading, setButtonLoading] = useState();
  const { t } = useTranslation();
  const type = tenantData.slugToType?.[packageData?.slug];
  const { user } = useSelector((state) => state.app.loginUser);
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);

  const handleGetPackage = (packageData) => {
    if (isMemberArea || !user?.package || !tenantConstants.ALLOW_PACKAGE_UPGRADE) {
      setButtonLoading(true);
      onGetPackageClick(packageData?.id, () => setButtonLoading(false), packageData?.name , packageData?.total_credits);
    } else {
      setUpgradeModalVisible(true);
    }
  };

  const renderPackagePrice = () => {
    return (
      <div style={!isMemberArea && user?.package && packageData?.is_applicable ? { fontStyle: 'italic' } : {}}>
        <Text type="secondary" className="fz-12">
          {isMemberArea ||
          !user?.package ||
          user?.package?.slug == packageData?.slug ||
          !packageData?.is_applicable ||
          !tenantConstants.ALLOW_PACKAGE_UPGRADE ? (
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
        <span className="fw-700 fz-16" style={{ marginInlineStart: '4px' }}>
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
    );
  };

  const renderCreditsInfo = () => {
    return (
      <>
        <IconWithSubtext
          className="mb-4"
          title={formatPrice(packageData.credits_per_month)}
          subText={t('credits')}
          textSize="20px"
          gap={'4px'}
          justify="center"
        />

        {packageData?.isMultiPlatform && (
          <Flex align="center" gap="4px">
            {tenantData?.platformList?.map((item, index) => (
              <Card
                key={index}
                className="w-100"
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
      </>
    );
  };

  return (
    <Card
      className={cx('pos-rel  w-100 text-center', type === 'titanium' ? 'titanium-card' : 'package-list')}
      bodyStyle={{ paddingTop: 0 }}
      style={{ borderWidth: 1 }}
      disabled={!packageData?.is_applicable}
    >
      <Flex vertical gap="24px">
        <div className="mb-8">
          <Flex align="center" justify="center" gap="8px" style={{ marginBlockStart: '28px' }}>
            <IconStyled
              style={{
                '--icon-bg-color': tenantData.packages?.[type]?.packageColor || 'default-color',
                '--icon-styled-width': '28px',
              }}
            >
              <Icon
                size={18}
                icon={tenantData.packages?.[type]?.icon}
                iconProps={tenantData.packages?.[type]?.iconProps}
              />
            </IconStyled>
            <Heading as="h5" className="mb-0">
              <RenderTextLtr text={packageData.name} />
            </Heading>
          </Flex>

          {renderPackagePrice()}
        </div>

        <div>{renderCreditsInfo()}</div>
        <div>
          <Button
            className={'mb-24'}
            style={{ paddingInline: 12, width: '100%' }}
            onClick={() => {
              handleGetPackage(packageData);
              packageSelectEvent(user, type, packageDuration);
            }}
            type={type == 'titanium' ? 'primary' : 'primaryOutlined'}
            loading={buttonLoading}
          >
            {user?.package?.slug == packageData.slug ? (
              t('Current Package')
            ) : !packageData?.is_applicable ? (
              t('Downgrade Unavailable')
            ) : (
              <RenderTextLtr text={`${t('Get')}  ${packageData.name}`} />
            )}
          </Button>
        </div>
      </Flex>

      <UpgradePackageModal
        upgradeModalVisible={upgradeModalVisible}
        setUpgradeModalVisible={setUpgradeModalVisible}
        packageData={packageData}
        onGetPackageClick={onGetPackageClick}
        refundable_amount={refundable_amount}
        packageDuration={packageDuration}
      />
      <div className="additional-info">
        {Object.entries(packageData.additional_info.options).map(([key, value]) => (
          <div key={key}>
            <div style={{ height: '33px', color: tenantTheme['gray700'] }}>
              {value.value == 'no' ? (
                <Icon icon="RxCross2" size="18px" color="#F73131" />
              ) : value.value == 'yes' ? (
                <Icon icon="GiCheckMark" className="text-primary" />
              ) : (
                tenantUtils.getLocalisedString(value, 'value')
              )}
            </div>
          </div>
        ))}
      </div>
      <Tag
        color={type == 'titanium' ? '#F3D9FF4F' : '#F2FAFA'}
        style={{ border: 'none', color: type == 'titanium' ? '#B58DFF' : tenantTheme['primary-color'] }}
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
