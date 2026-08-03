import tenantData from '@data';
import tenantConstants from '@constants';
import { Row, Space } from 'antd';
import cx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import reportsApis from '../../apis/reports';
import { strings } from '../../constants/strings';
import { getVariousDates } from '../../utility/date';
import { Card, DateFilter, EmptyState, Group, Number, Popover, Segmented, Select } from '../common';
import Statistic from '../common/statistic';
import TextWithIcon from '../common/textWithIcon/textWithIcon';
import { SkeletonBody as Skeleton } from '../skeleton/Skeleton';
import LeadsStatsGraphWidget from './LeadsStatsGraphWidget';
import LeadsViewsWidget from './LeadsViewsWidget';
import { AnalyticsStyled, PerformanceChartWrapper } from './styled';
import { switchChartViewClickEvent, changeDateClickEvent } from '../../services/analyticsService';
import usePlatformReports from '../../hooks/usePlatformReports';

const ReportsLeadsSectionSkeleton = () => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const tabList = useMemo(
    () => [
      { key: 'skt-1', tab: <Skeleton active={false} /> },
      { key: 'skt-2', tab: <Skeleton active={false} /> },
      { key: 'skt-3', tab: <Skeleton active={false} /> },
    ],
    [],
  );

  return (
    <div>
      <Skeleton
        type="button"
        className={cx(isMobile ? 'px-16' : 'px-2', 'mb-4')}
        style={{ minWidth: 120, height: 28 }}
      />
      <PerformanceChartWrapper style={{ minHeight: 350, height: 'calc(100% - 18px)' }}>
        <Card
          tabList={tabList}
          tabProps={{ size: 'middle', type: 'card', tabBarGutter: '0px', animated: false, disabled: true }}
          bodyStyle={{ padding: 24 }}
          loading
        />
      </PerformanceChartWrapper>
    </div>
  );
};

function ReportsLeadsSection(props) {
  const { t } = useTranslation();
  const { chartTitle, loading, isDashboard, user, section } = props;
  const selectedPlatform = useSelector((state) => state.app.sectionPlatform?.[section]);
  const loggedInUser = useSelector((state) => state.app.loginUser.user);
  const platforms = useMemo(
    () => (user ? user?.platforms : loggedInUser?.platforms || []),
    [user?.platforms, loggedInUser?.platforms],
  );
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const isMultiPlatform = useMemo(() => platforms?.length > 1, [platforms?.length]);
  const [filters, setFilters] = useState({});
  const defaultPlatform = tenantData?.platformList?.[0];

  useEffect(() => {
    let tempFilters = {};
    platforms.forEach((e) => {
      tempFilters[e.slug] = {
        purpose: 'all',
        peformanceTab: 'views',
        start_date: getVariousDates(29)?.[0],
        end_date: getVariousDates(29)?.[1],
      };
    });
    setFilters(tempFilters);
  }, [platforms]);

  const getPlatformData = (platform) => {
    const hookName = `useGetListingReportsGraphFor${platform?.slug || defaultPlatform?.slug}Query`;
    const useHook = reportsApis[hookName];
    if (!useHook) {
      return { platform: platform?.slug, error: 'Hook not found' };
    }
    const hookResult = useHook(
      { user: user ? user : loggedInUser, ...filters?.[platform?.slug] },
      { skip: !filters?.[platform?.slug], refetchOnMountOrArgChange: true },
    );
    return { platform: platform?.slug, ...hookResult };
  };

  const platformResults = usePlatformReports(tenantData.platformList, filters, user, loggedInUser);

  const btnList = useMemo(() => {
    const defaultPurposeList = [
      { key: 'all', id: 'all', value: 'all', label: t('All'), title: t('All'), hit: true },
      { key: 'sale', id: 'sale', value: 'sale', label: t('For Sale'), title: t('For Sale'), hit: true },
      { key: 'rent', id: 'rent', value: 'rent', label: t('For Rent'), title: t('For Rent'), hit: true },
    ];

    const dailyRentalPurposeList = tenantConstants.DAILY_RENTAL_ENABLED
      ? {
          key: 'dailyrental',
          id: 'dailyrental',
          value: 'dailyrental',
          label: t('Daily Rentals'),
          title: t('Daily Rentals'),
          hit: true,
        }
      : null;

    return dailyRentalPurposeList ? [...defaultPurposeList, dailyRentalPurposeList] : defaultPurposeList;
  }, []);

  const iconSizes = { size: isMobile ? '1.2em' : '1.6em', iconContainerSize: isMobile ? '32px' : '40px' };

  const onFilterChange = (e, platform) => {
    setFilters((prev) => ({ ...prev, [platform]: { ...prev?.[platform], ...e } }));
  };

  const renderTabTitle = (item, onClick, selected) => {
    return (
      <Popover
        getPopupContainer={() => document.body}
        content={item?.popoverContent}
        action={item?.popoverContent ? 'hover' : null}
      >
        <Statistic
          key={item?.title}
          icon={item?.icon}
          iconProps={{ hasBackground: true, ...iconSizes, ...item?.iconProps }}
          title={t(item?.title)}
          formatter={<Number value={item?.value ? item.value : 0} compact={false} />}
          value={item?.value ? item.value : 0}
          lead={!isMobile && item?.lead}
          direction={isMobile ? 'vertical' : null}
          percentage={item.percentage}
          growth={item.growth}
          since_when={item.since_when}
          inline={item.inline}
          onClick={onClick}
          inlineTrends
          rootClassName={selected && "ant-tabs-tab-active"}
        />
      </Popover>
    );
  };

  const renderCardTitle = (item, purposeTab, platform, platformLoading, dateRange, datePlaceholder) => {
    const platformKey = platform?.slug;
    return (
      <Row
        className={cx('px-16', isMobile ? 'mb-16' : 'mb-16')}
        justify="space-between"
        gutter={[8, 8]}
        style={{ alignItems: 'start' }}
      >
        <Space.Compact className="mb-4" style={{ gap: 16, alignItems: 'baseline' }}>
          <TextWithIcon
            className={cx(isMobile ? 'fz-14' : 'fz-16')}
            fontWeight={700}
            title={t(item?.title)}
            // icon={(isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW && platform.icon) || null}
            loadingProps={{ avatarSize: 32, rectSize: 'small' }}
            iconProps={{ iconBackgroundColor: '#fff', hasBackground: true }}
          />
        </Space.Compact>
        <Group template="repeat(2, 1fr)" style={{ gap: 16, alignItems: 'center' }}>
          {isMobile || (isDashboard && isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW) ? (
            <Select
              size="small"
              placeholder={t('Select Purpose')}
              defaultValue={purposeTab}
              options={btnList}
              onChange={(e) => {
                switchChartViewClickEvent(user, e);
                onFilterChange({ purpose: e }, platformKey);
              }}
              accentColor={platform?.brandColor}
              horizontal={!isMobile}
              disabled={platformLoading}
              getPopupContainer={false}
              style={{ justifyContent: 'end' }}
            />
          ) : (
            <Segmented
              value={purposeTab}
              options={btnList}
              onChange={(e, val) => {
                switchChartViewClickEvent(user, e);
                onFilterChange({ purpose: e }, platformKey);
              }}
              accentColor={platform?.brandColor}
              disabled={platformLoading}
            />
          )}
          <DateFilter
            queryStartDate={dateRange?.[0]}
            queryEndDate={dateRange?.[1]}
            onSelect={(startDate, endDate, label) => {
              if (startDate && endDate) {
                changeDateClickEvent(user, startDate, endDate);
                onFilterChange({ start_date: startDate, end_date: endDate, date_placeholder: label }, platformKey);
              }
            }}
            inputPlaceholder={datePlaceholder}
            onClear={() => {}}
            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 2))}
            reportsStaticRanges
            disabled={platformLoading}
            loading={platformLoading}
            fieldSize={(isMobile || (isDashboard && isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW)) && 'small'}
            accentColor={platform?.brandColor}
          />
        </Group>
      </Row>
    );
  };

  const renderContent = (platform) => {
    const platformData = platformResults?.length ? platformResults?.find((e) => e?.platform == platform?.slug) : {};
    const item = platformData?.data;
    const platformError = platformData?.error;
    const platformLoading = platformData?.isFetching || platformData?.isLoading || user?.isLoading;
    const purposeTab = filters?.[platform?.slug]?.purpose;
    const peformanceTab = filters?.[platform?.slug]?.peformanceTab;
    const dateRange = [filters?.[platform?.slug]?.start_date, filters?.[platform?.slug]?.end_date];
    const datePlaceholder = filters?.[platform?.slug]?.date_placeholder;

    return platformError ? (
      <EmptyState
        title={strings.error_}
        message={platformError}
        buttonLoading={platformLoading}
        onClick={platformData?.refetch}
        accentColor={platform?.brandColor}
      />
    ) : (platformLoading && !item) || loading ? (
      <ReportsLeadsSectionSkeleton key={platform?.slug} />
    ) : (
      item && (
        <AnalyticsStyled key={platform?.slug}>
          <Group className="analytics-styled" template="repeat(2, minmax(0, 20%)) 1fr" gap="16px">
            <div className="span-all">
              {platformError ? (
                <EmptyState
                  title={strings.error_}
                  message={platformError}
                  buttonLoading={loading}
                  type="analytics-dashboard"
                  onClick={() => {
                    onFilterChange({ date_between: dateRange }, platform);
                  }}
                  accentColor={platform?.brandColor}
                />
              ) : loading && !item ? (
                <LeadsViewsWidget skeltonLoading />
              ) : (
                <LeadsStatsGraphWidget
                  id={item.id}
                  data={item?.data_breakdown}
                  platform={platform.slug}
                  key={`data_breakdown_${item?.id}`}
                  chartTitle={chartTitle}
                  fetchWidgetData={platformData?.refetch}
                  platformKey={platform.slug}
                  purpose={purposeTab}
                  performance={peformanceTab || 'views'} //TODO
                  onFilterChange={onFilterChange}
                  accentColor={platform.brandColor}
                  reloadDataSet={loading}
                  item={item}
                  renderTabTitle={renderTabTitle}
                  disabled={!!loading && !!data}
                  showLeadDetails={!(isDashboard && isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW)}
                  isDashboard={isDashboard}
                  skeltonLoading={loading}
                  loading={platformLoading}
                  renderCardTitle={() =>
                    renderCardTitle(item, purposeTab, platform, platformLoading, dateRange, datePlaceholder)
                  }
                />
              )}
            </div>
          </Group>
        </AnalyticsStyled>
      )
    );
  };

  return (
    <>
      <Group
        {...(isDashboard && isMultiPlatform && tenantConstants.MULTIPLATFROM_VIEW && !isMobile
          ? { template: isMobile ? 'initial' : 'repeat(2, minmax(0, 1fr))', gap: '16px' }
          : {})}
      >
        {tenantConstants.MULTIPLATFROM_VIEW
          ? platforms.map((platform) => renderContent(platform))
          : renderContent(selectedPlatform)}
      </Group>
    </>
  );
}

export default ReportsLeadsSection;
