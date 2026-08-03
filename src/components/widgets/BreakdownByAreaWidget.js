import tenantTheme from '@theme';
import { Badge, Row } from 'antd';
import cx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ChartjsDonutChart } from '../charts/chartjs';
import { Card, EmptyState, Group, LoaderWrapper, TextWithIcon } from '../common';
import { SkeletonBody } from '../skeleton/Skeleton';
import { SessionChartWrapper } from './styled';
import parentApi from '../../store/parentApi';
import { strings } from '../../constants/strings';

function BreakdownByAreaWidget(props) {
  const { t } = useTranslation();
  const { icon, user, platform, fluidReportsLayout = false } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const chartDimension = isMobile ? (fluidReportsLayout ? 100 : 114) : fluidReportsLayout ? 128 : 160;

  const hookName = `useGetListingReportsWidgetSummaryFor${platform}Query`;
  const useHook = parentApi?.[hookName];
  const {
    data,
    isLoading: loading,
    isFetching,
    error,
    refetch,
  } = useHook?.(
    { user: user },
    {
      skip: !user?.id || !platform,
      refetchOnMountOrArgChange: true,
    },
  ) || {};

  const renderBreakDownCardTitle = () => {
    return (
      <TextWithIcon
        className={cx(isMobile ? 'fz-14' : 'fz-16')}
        fontWeight={700}
        icon={icon || data?.area_breakdown?.icon_data?.icon}
        iconProps={data?.area_breakdown?.icon_data?.icon_props}
        title={t(data?.area_breakdown?.title)}
        textColor="#272b41"
        loading={loading}
        loadingProps={{ rectSize: 'small' }}
      />
    );
  };

  return (
    <>
      <Card
        className="flex-grow"
        bodyStyle={{
          minHeight: 'inherit',
          padding: isMobile
            ? '16px 24px'
            : fluidReportsLayout
              ? 'clamp(10px, 2cqw, 16px) clamp(12px, 2.8cqw, 24px)'
              : '16px 24px',
        }}
        style={{
          minHeight: 'calc(100% - 42px)',
          '--card-align': 'start',
          '--flex-direction': 'row',
          '--title-padding': '0px',
        }}
        headStyle={{
          borderBottom: 'none',
        }}
        title={renderBreakDownCardTitle()}
      >
        {loading ? (
          <Group
            className={cx(!isMobile && 'py-16')}
            template={
              fluidReportsLayout
                ? 'repeat(auto-fit, minmax(0, 1fr))'
                : 'repeat(auto-fill, minmax(min(42ch, 100%), 1fr))'
            }
            gap={isMobile ? '24px' : fluidReportsLayout ? 'clamp(12px, 3cqw, 48px)' : '48px'}
            style={{ alignItems: 'start' }}
          >
            <Row
              align="middle"
              {...(fluidReportsLayout ? { wrap: false } : {})}
              style={{
                gap: isMobile ? 16 : fluidReportsLayout ? 'clamp(8px, 2.5cqw, 32px)' : 32,
                ...(fluidReportsLayout ? { minWidth: 0 } : {}),
              }}
            >
              <SkeletonBody type="avatar" size={chartDimension} />
              <SkeletonBody size={chartDimension} />
            </Row>
            <Row
              align="middle"
              {...(fluidReportsLayout ? { wrap: false } : {})}
              style={{
                gap: isMobile ? 16 : fluidReportsLayout ? 'clamp(8px, 2.5cqw, 32px)' : 32,
                ...(fluidReportsLayout ? { minWidth: 0 } : {}),
              }}
            >
              <SkeletonBody type="avatar" size={chartDimension} />
              <SkeletonBody size={chartDimension} />
            </Row>
          </Group>
        ) : error ? (
          <EmptyState title={strings.error_} message={error} buttonLoading={loading} onClick={refetch} />
        ) : data?.area_breakdown ? (
          <LoaderWrapper loading={!loading && isFetching}>
            <SessionChartWrapper style={{ fontSize: isMobile && 12 }}>
              <>
                <div className="session-chart-inner">
                  <Group
                    className={cx(!isMobile && 'py-16')}
                    template={
                      fluidReportsLayout
                        ? 'repeat(auto-fit, minmax(0, 1fr))'
                        : 'repeat(auto-fill, minmax(min(42ch, 100%), 1fr))'
                    }
                    gap={isMobile ? '24px' : fluidReportsLayout ? 'clamp(12px, 3cqw, 48px)' : '48px'}
                    style={{ alignItems: 'start' }}
                  >
                    {data?.area_breakdown?.types?.map((item) => {
                      const isZero = data?.area_breakdown?.data[item?.key]?.total === 0;

                      return (
                        <Row
                          key={item?.key}
                          {...(fluidReportsLayout ? { align: 'middle', wrap: false } : {})}
                          style={{
                            gap: isMobile ? 16 : fluidReportsLayout ? 'clamp(8px, 2.5cqw, 32px)' : 32,
                            ...(fluidReportsLayout ? { minWidth: 0 } : {}),
                          }}
                        >
                          <div>
                            <ChartjsDonutChart
                              labels={data?.area_breakdown?.data[item?.key]?.chart.labels}
                              innerLabel={t(item.label)}
                              showTotalInnerLable
                              datasets={[
                                {
                                  data: isZero ? [100] : data?.area_breakdown?.data[item?.key]?.chart.dataset,
                                  backgroundColor: isZero
                                    ? tenantTheme.gray200
                                    : data?.area_breakdown?.data[item?.key]?.backgroundColor,
                                  total: data?.area_breakdown?.data[item?.key]?.total,
                                  borderWidth: 1,
                                },
                              ]}
                              width={chartDimension}
                              height={chartDimension}
                              options={{
                                cutoutPercentage: 82,
                                legend: { display: false },
                                animation: { duration: isZero ? 0 : 1000 },
                                tooltips: { enabled: !isZero },
                              }}
                            />
                          </div>
                          <div
                            className="flex flex-col flex-grow"
                            style={fluidReportsLayout ? { minWidth: 0 } : undefined}
                          >
                            {data?.area_breakdown?.data[item?.key]?.locations?.length ? (
                              <Group template="initial" gap="0px" style={{ height: '100%', placeContent: 'center' }}>
                                {data?.area_breakdown?.data[item?.key]?.locations?.map((item2, index) => (
                                  <Row
                                    justify="space-between"
                                    {...(fluidReportsLayout ? { wrap: false } : {})}
                                    style={{
                                      alignItems: 'baseline',
                                      gap: fluidReportsLayout ? 'clamp(4px, 1.2cqw, 16px)' : '16px',
                                      ...(fluidReportsLayout ? { minWidth: 0 } : {}),
                                    }}
                                    key={index}
                                  >
                                    <Badge
                                      color={data?.area_breakdown?.data[item?.key]?.backgroundColor[index] || '#e5e5e5'}
                                      text={item2?.label}
                                      style={{
                                        color: '#5a5f7d',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        flex: fluidReportsLayout ? '1 1 auto' : 1,
                                        ...(fluidReportsLayout ? { minWidth: 0 } : {}),
                                      }}
                                    />
                                    <div
                                      style={{
                                        fontSize: fluidReportsLayout ? '1em' : 16,
                                        ...(fluidReportsLayout ? { whiteSpace: 'nowrap', flexShrink: 0 } : {}),
                                      }}
                                    >
                                      <span>{item2.data}</span>{' '}
                                      <small style={{ paddingInlineStart: 5, color: '#868eae' }}>
                                        {((item2.data / data?.area_breakdown?.data[item?.key]?.total) * 100).toFixed(1)}
                                        %
                                      </small>
                                    </div>
                                  </Row>
                                ))}
                              </Group>
                            ) : (
                              <Group style={{ height: '100%', placeContent: 'center' }}>
                                <Badge
                                  color={tenantTheme.gray400}
                                  text={t('Not enough data')}
                                  style={{
                                    color: '#5a5f7d',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    flex: 1,
                                  }}
                                />
                              </Group>
                            )}
                          </div>
                        </Row>
                      );
                    })}
                  </Group>
                </div>
              </>
            </SessionChartWrapper>
          </LoaderWrapper>
        ) : null}
      </Card>
    </>
  );
}

export default BreakdownByAreaWidget;
