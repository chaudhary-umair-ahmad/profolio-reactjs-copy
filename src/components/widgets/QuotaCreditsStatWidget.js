import tenantData from '@data';
import tenantUtils from '@utils';
import { Divider, Progress, Typography } from 'antd';
import cx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Flex, Group, TextWithIcon } from '../common';
import MultiPlatform from '../common/multiplatform';
import Statistic from '../common/statistic';
import { TENANT_KEY } from '../../utility/env';

const { Text } = Typography;

const QuotaCreditsStatsWidget = ({ available, used, total, loading, currencyType, brandColor, showPackage, platform, currentPackageDetails}) => {
  const { user } = useSelector((state) => state.app.loginUser);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const locale = useSelector((state) => state.app.AppConfig.locale);

  const pwidth = (available / total) * 100;
  const vDiv = <Divider type="vertical" style={{ height: 40, margin: 0 }} />;
  const { t } = useTranslation();
  const packageData = currentPackageDetails || user?.package;
  const slugType = tenantData.slugToType?.[packageData?.slug];
  const statsFw = 700;
  const shouldHideCurrentPlan = platform?.slug === 'olx' && !user?.is_shifted_to_olx_quota;

  const renderMultiPlatformsLabel = () => {
    return <MultiPlatform style={{ height: '20px' }} />;
  };

  const getPackageDurationLabel = (duration = 12) => {
    switch (duration) {
      case 12:
        return t('Yearly');
      case 6:
        return t('Half Yearly');
    }
  };

  return (
    <React.Fragment>
      <Group
        template="repeat(6, auto) 1fr"
        justify="start"
        gap={isMobile ? '12px 24px' : '32px'}
        style={{ justifySelf: 'start' }}
        className={'w-100'}
      >
        <Statistic
          fontWeight={statsFw}
          title={currencyType == 'quota' ? t('Available Quota') : t('Available Credits')}
          value={available}
          loading={loading}
          lead={!isMobile}
          trends={false}
          precision={available && available % 1 != 0 && 2}
        />
        {vDiv}
        <Statistic
          fontWeight={statsFw}
          title={t('Used')}
          value={used}
          loading={loading}
          lead={!isMobile}
          trends={false}
          precision={used && used % 1 != 0 && 2}
        />

        {vDiv}

        <Statistic
          fontWeight={statsFw}
          title={t('Total')}
          value={total || 0}
          lead={!isMobile}
          loading={loading}
          trends={false}
          precision={total && total % 1 != 0 && 2}
        />
        
        {vDiv}

        {(!!user?.isCurrencyUser || TENANT_KEY == 'zameen') && !!showPackage && packageData && !shouldHideCurrentPlan && (
          <Flex
            vertical={!isMobile}
            className={cx(isMobile && 'span-all w-100')}
            gap="4px"
            style={{ justifySelf: !isMobile && 'end', gridRow: isMobile && 1 }}
            align={'center'}
            justify={isMobile ? 'space-between' : null}
          >
            <div>
              <Text className={cx('fw-400', !isMobile && 'text-right')} type="secondary">
                {t('Current Plan')}
              </Text>

              <Flex align="center" gap="4px" className='mt-4'>
                <TextWithIcon
                  icon={tenantData.packages?.[slugType]?.icon}
                  iconProps={{
                    hasBackground: true,
                    size: 18,
                    iconBackgroundColor: tenantData.packages?.[slugType]?.packageColor,
                  }}
                  title={tenantUtils.getLocalisedString(packageData, 'name') ?? "-"}
                  fontWeight="700"
                  style={{ '--icon-styled-width': '30px' }}
                />
              </Flex>
            </div>
            {packageData?.is_multi_platform && renderMultiPlatformsLabel()}
          </Flex>
        )}
      </Group>
      <Progress percent={pwidth} showInfo={false} strokeColor={brandColor} />
    </React.Fragment>
  );
};
export default QuotaCreditsStatsWidget;
