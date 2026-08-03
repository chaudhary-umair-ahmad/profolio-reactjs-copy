import React, { useMemo } from 'react';
import { SkeletonBody as Skeleton } from '../skeleton/Skeleton';
import { PerformanceChartWrapper } from '../widgets/styled';
import { Card } from '../common';
import { useSelector } from 'react-redux';
import cx from 'clsx';

const LeadsBreakdownGraphSkeleton = () => {
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

export default LeadsBreakdownGraphSkeleton;
