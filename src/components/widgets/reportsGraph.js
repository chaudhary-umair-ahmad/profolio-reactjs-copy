import { useSelector } from 'react-redux';
import { strings } from '../../constants/strings';
import { Card, EmptyState, Group, Skeleton } from '../common';
import { useMemo } from 'react';
import { AnalyticsStyled, PerformanceChartWrapper } from './styled';
import LeadsStatsGraphWidget from './LeadsStatsGraphWidget';

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

const ReportsGraph = (props) => {
  const { data, error, loading, skeltonLoading, user, id } = props;
  return error ? (
    <EmptyState
      title={strings.error_}
      message={error}
      buttonLoading={loading}
      onClick={() => {
        // fetchWidgetData(dateRange, platform.slug);
      }}
    />
  ) : skeltonLoading ? (
    <ReportsLeadsSectionSkeleton />
  ) : (
    <AnalyticsStyled>
      <Group className="analytics-styled" template="repeat(2, minmax(0, 20%)) 1fr" gap="16px">
        <div className="span-all">
          <LeadsStatsGraphWidget
            id={id}
            data={item?.data_breakdown}
            platform={platform.slug}
            key={`data_breakdown_${item?.id}`}
            chartTitle={chartTitle}
            fetchWidgetData={fetchWidgetData}
            platformKey={platform.slug}
            purpose={purposeTab}
            performance={peformanceTab}
            onFilterChange={onFilterChange}
            accentColor={platform.brandColor}
            reloadDataSet={loading}
            item={item}
            renderTabTitle={renderTabTitle}
            disabled={!!loading && !!data}
            showLeadDetails={!(isDashboard && isMultiPlatform)}
            isDashboard={isDashboard}
            skeltonLoading={loading}
            loading={platformLoading}
            renderCardTitle={() => renderCardTitle(item, purposeTab, platform, platformLoading, dateRange)}
          />
        </div>
      </Group>
    </AnalyticsStyled>
  );
  return <></>;
};

export default ReportsGraph;
