import tenantData from '@data';
import tenantTheme from '@theme';
import tenantConstants from '@constants';
import TenantComponents from '@components';
import tenantUtils from '@utils';
import { Divider } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Card, Flex, Group, IconWithSubtext, TextWithIcon } from '../../../../components/common';
import Statistic from '../../../../components/common/statistic';
import QuotaCreditsStatsWidget from '../../../../components/widgets/QuotaCreditsStatWidget';
import { DATE_FORMAT } from '../../../../constants/formats';
import { getTimeDateString } from '../../../../utility/date';
import { formatPrice } from '../../../../utility/utility';
import { useGetQuotaCreditsWidgetDataQuery } from '../../../../apis/quotaCredits';
import MultiPlatform from '../../../../components/common/multiplatform';

const PackageHeader = () => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.app.loginUser);

  const {
    data: quotaCreditsData,
    isLoading: loading,
    isFetching: fetching,
    error,
    refetch,
  } = useGetQuotaCreditsWidgetDataQuery(
    {
      ...(user?.id != -1 && { ['q[user_id_eq]']: user?.id }),
      platform_id: [1, 2],
      combineCredits: true,
    },
    { skip: !user?.id, refetchOnMountOrArgChange: true },
  );

  const platformColor = tenantData.platformList[0]?.brandColor;
  const platformSlug = tenantData.platformList[0]?.slug;
  const slugType = tenantData.slugToType?.[user?.package?.slug];
  const creditDrawerRef = useRef();

  const renderMultiPlatformsLabel = () => {
    return (
      <MultiPlatform
        iconSize={isMobile && '50px'}
        style={{ marginTop: isMobile ? '0px' : '4px', height: isMobile ? '15px' : '24px' }}
        subClass={isMobile ? 'fs12' : 'fs14'}
      />
    );
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
    <Card style={{ border: 0 }}>
      <Group template={isMobile ? 'initial' : 'repeat(2, minmax(0, 1fr))'} gap="8px">
        <Card style={{ borderWidth: 1, borderRadius: '6px' }}>
          <Flex gap="25px" justify="space-between">
            <TextWithIcon
              title={t('Current Package')}
              value={
                <Flex vertical={isMobile} align={isMobile ? 'start' : 'center'} gap={isMobile ? '4px' : '8px'}>
                  <div className={isMobile ? 'fz-14' : 'fz-16'} style={{ color: '#222' }}>
                    {tenantUtils.getLocalisedString(quotaCreditsData?.[platformSlug]?.current_package_details, 'name')}
                    <span className="fz-12 color-gray-dark fw-400">
                      {` (${getPackageDurationLabel(quotaCreditsData?.[platformSlug]?.current_package_details?.duration_in_months)}) `}
                    </span>
                  </div>
                  <div>
                    {' '}
                    {quotaCreditsData?.[platformSlug]?.current_package_details?.is_multi_platform &&
                      renderMultiPlatformsLabel()}
                  </div>
                </Flex>
              }
              icon={tenantData.packages?.[slugType]?.icon}
              iconProps={{
                hasBackground: true,
                size: '24px',
                iconContainerSize: '30px',
                color: tenantTheme['primary-color'],
                iconBackgroundColor: tenantData.packages?.[slugType]?.packageColor,
                marginTop: '6px',
              }}
              fontWeight="700"
              className="color-gray-dark"
              textColor="#767676"
              textSize="12px"
              iconStyle={{ marginTop: '6px' }}
              loading={loading}
            />

            <IconWithSubtext
              vertical={isMobile && true}
              title={quotaCreditsData?.[platformSlug]?.current_package_details?.credits_per_month?.toString() ?? ''}
              subText={t('credits')}
              textSize="20px"
              justify="center"
              style={{ lineHeight: isMobile && 1.2 }}
              loading={loading}
            />
          </Flex>
          <Divider type="horizontal" className="span-all" style={{ marginBlock: '12px' }} />
          <Flex vertical={isMobile && true} gap={isMobile ? '15px' : '40px'} justify="space-between">
            {tenantConstants?.MONTHLY_CREDIT_PURCHASE && (
              <Statistic
                title={t('Next Credit Disbursement')}
                value={getTimeDateString(
                  quotaCreditsData?.[platformSlug]?.current_package_details?.next_disbursement_date,
                  DATE_FORMAT,
                  true,
                )}
                icon="FiCalendar"
                iconProps={{
                  hasBackground: true,
                  size: '16px',
                  iconContainerSize: '28px',
                  color: tenantTheme['primary-color'],
                }}
                spaceProps={{ align: 'center' }}
                trends={false}
                fontSize="14px"
                titleFontSize="12px"
                loading={loading}
              />
            )}
            <Statistic
              icon="PiClockClockwiseFill"
              iconProps={{
                hasBackground: true,
                size: '16px',
                iconContainerSize: '28px',
                color: tenantTheme['primary-color'],
              }}
              spaceProps={{ align: 'center' }}
              title={t('Package End Date')}
              value={getTimeDateString(
                quotaCreditsData?.[platformSlug]?.current_package_details?.end_date,
                DATE_FORMAT,
                true,
              )}
              trends={false}
              fontSize="14px"
              titleFontSize="12px"
              loading={loading}
            />
            {tenantConstants?.ALLOW_CREDITS_TOPTUP && (
              <Statistic
                icon="TransactionIcon"
                iconProps={{
                  hasBackground: true,
                  size: '16px',
                  iconContainerSize: '28px',
                  color: tenantTheme['primary-color'],
                }}
                spaceProps={{ align: 'center' }}
                title={t('Top-ups Purchased ')}
                value={quotaCreditsData?.[platformSlug]?.current_package_details?.top_up_credits}
                trends={false}
                fontSize="14px"
                titleFontSize="12px"
                loading={loading}
              />
            )}
          </Flex>
        </Card>
        <Card style={{ borderWidth: 1, borderRadius: '6px' }}>
          <QuotaCreditsStatsWidget
            available={quotaCreditsData?.[platformSlug]?.products[0]?.available}
            used={quotaCreditsData?.[platformSlug]?.products[0]?.used}
            total={quotaCreditsData?.[platformSlug]?.products[0]?.total}
            loading={loading || fetching}
            currencyType={!!user?.isCurrencyUser ? 'credits' : 'quota'}
            brandColor={platformColor}
            showPackage={false}
          />
          <Flex
            vertical={isMobile && true}
            align={isMobile ? 'start' : 'center'}
            gap={isMobile ? '8px' : null}
            style={{ marginBlockStart: '8px' }}
          >
            <Button
              size={isMobile ? 'small' : ''}
              style={{ textDecoration: 'underline' }}
              className="p-0"
              type="link"
              onClick={() => creditDrawerRef.current && creditDrawerRef.current.openDrawer(true)}
            >
              {t('What are Credits?')}
            </Button>
            <TenantComponents.CreditInfoDrawer ref={creditDrawerRef} />
          </Flex>
        </Card>
      </Group>
    </Card>
  );
};
export default PackageHeader;
