import tenantTheme from '@theme';
import { Badge, Divider, Radio, Space, Tabs } from 'antd';
import chroma from 'chroma-js';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useGetZiwoStats } from '../../hooks';
import { isNoGraph } from '../../utility/utility';
import { ChartjsAreaChart } from '../charts/chartjs';
import { DataTable, EmptyState, Flex, ProductTag } from '../common';
import Card from '../common/cards/Card';
import { RadioPill } from '../common/radio-button/styled';
import { SkeletonBody } from '../skeleton/Skeleton';
import { AnalyticsPlaceholder } from '../svg';
import { customTooltips } from '../utilities/utilities';
import { PerformanceChartWrapper } from './styled';
import tenantConstants from '@constants';
import { switchChartViewClickEvent } from '../../services/analyticsService';

function LeadsViewsWidget(props) {
  const {
    data,
    skeltonLoading,
    loading,
    reloadDataSet,
    accentColor,
    platform,
    purpose,
    performance,
    onFilterChange,
    wrapperRootStyle,
    item,
    renderTabTitle,
    disabled,
    showLeadDetails = true,
    isDashboard,
    renderCardTitle,
  } = props;
  const { t } = useTranslation();
  const user = useSelector((state) => state.app.loginUser?.user);
  const getTab = () =>
    useMemo(() => {
      const parent = data?.performanceBy.find((e) => e.key === performance)?.key;
      return { parent: parent || 'leads', child: parent ? (platform === 'zameen' ? null : 'leads') : performance };
    }, [performance, data]);

  const [state, setState] = useState({
    productTab: 'all',
    currentTab: getTab().parent,
    purposeTab: purpose || data?.purposes[0].key,
    currentChildTab: getTab().child,
  });

  const [performanceObj, setPerformanceObj] = useState(
    data?.performanceBy.find((stat) => stat.key === performance) || data?.performanceBy[0],
  );
  const { currentTab, purposeTab, productTab, currentChildTab } = state;
  const [dataset, setDataset] = useState([]);
  // const [max, setMax] = useState(null);
  // const [step, setStep] = useState(null);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const isMultiPlatform = useSelector((state) => state.app.AppConfig.isMultiPlatform);

  useEffect(() => {
    data && !reloadDataSet && makeDatasets(data, currentTab, purposeTab);
  }, [data, reloadDataSet, currentTab, purposeTab, currentChildTab]);

  const onTabChange = (tab, childValue) => {
    const childTab = platform === 'zameen' ? childValue || (tab == 'leads' ? 'calls' : null) : childValue || 'leads';
    const hit = !!data?.performanceBy?.find((e) => e.key === tab)?.hit;
    switchChartViewClickEvent(user, tab);
    if (currentTab == 'leads' && tab == currentTab) {
      if (currentChildTab != childTab) {
        setState({ ...state, currentTab: tab, currentChildTab: childTab, productTab: 'all' });
        tenantConstants.PLATFORM_CONFIGS?.[platform]?.refetchStatsOnFilterChange &&
          onFilterChange({ stat: tab === 'leads' ? childTab : tab }, platform, !hit);
      }
    } else {
      setState({ ...state, currentTab: tab, currentChildTab: childTab, productTab: 'all' });
      tenantConstants.PLATFORM_CONFIGS?.[platform]?.refetchStatsOnFilterChange &&
        onFilterChange({ stat: tab === 'leads' ? childTab : tab }, platform, !hit);
    }
    const newPerformanceObj = data?.performanceBy?.find((item) => {
      return item.key === tab;
    });

    setPerformanceObj(newPerformanceObj);
  };

  const onChildTabChange = (value) => {
    switchChartViewClickEvent(user, value);
    setState({ ...state, currentChildTab: value, productTab: 'all' });
    const hit = !!data?.performanceBy?.find((e) => ((e.key === platform) === 'zameen' ? 'leads' : value))?.hit;
    tenantConstants.PLATFORM_CONFIGS?.[platform]?.refetchStatsOnFilterChange &&
      onFilterChange({ stat: value }, platform, !hit);
  };

  const onTypeChange = (e, val) => {
    switchChartViewClickEvent(user, e?.target?.value);
    setState({ ...state, productTab: e.target.value });
  };

  const datasetsToShow = (dataset, productTab) => {
    let newDataset = null;
    if (dataset.some((e) => e.hasBifurcations)) {
      newDataset = dataset?.map((item) => {
        const selectedProduct = item.data.find((item) => item.key === productTab);
        return {
          ...selectedProduct,
          key: item.key,
          hidden: false,
          fill: false,
          label: item.label,
          isBifurcated: true,
          borderColor: item?.borderColor,
          data: selectedProduct?.data ? [...selectedProduct?.data] : [],
        };
      });
    } else {
      newDataset = [...dataset.map((e) => ({ ...e, fill: false }))];
      newDataset = newDataset.map((e) => {
        if (e.key !== productTab) {
          return { ...e, hidden: true, backgroundColor: chroma.mix('#fff', accentColor, 0.16) };
        }
        return { ...e, hidden: false, backgroundColor: chroma.mix('#fff', e?.borderColor, 0.16) };
      });
    }
    return newDataset;
  };

  const makeData = (item, subListKey) => {
    return currentTab == 'leads'
      ? subListKey
        ? JSON.parse(JSON.stringify(data.data[currentTab][currentChildTab]?.[subListKey]?.[item?.value]))
        : JSON.parse(JSON.stringify(data.data[currentTab][currentChildTab]?.[item?.value]))
      : JSON.parse(JSON.stringify(data.data[currentTab]?.[item?.value]));
  };

  const makeDatasets = (data, currentTab, purposeTab) => {
    if (!data) return;
    const getDatasetObject = (item, key = null, borderColor) => ({
      key: item?.key,
      value: item?.value,
      data: makeData(item, key),
      borderColor: item?.borderColor,
      borderWidth: 2,
      fill: false,
      backgroundColor: item?.backgroundColor,
      label: item?.label,
      pointRadius: '0',
      pointBorderColor: '#fff',
      pointBackgroundColor: borderColor || item?.borderColor,
      hidden: false,
      clip: false,
    });

    const isBifurcatedData = (dataObj) => dataObj && Object.keys(dataObj).every((key) => !Array.isArray(dataObj[key]));
    const selectedChildTabData = data?.data?.[currentTab]?.[currentChildTab];
    let datasets;

    if (isBifurcatedData(selectedChildTabData)) {
      datasets = Object.keys(selectedChildTabData).map((key) => ({
        key,
        data: data?.types?.map((item) => getDatasetObject(item, key, selectedChildTabData?.[key]?.borderColor)),
        hasBifurcations: true,
        label: selectedChildTabData?.[key]?.label,
        borderColor: selectedChildTabData?.[key]?.borderColor,
      }));
    } else {
      datasets = data?.types?.map((item) => getDatasetObject(item));
    }

    const currentData = currentTab === 'leads' ? data?.data?.[currentTab]?.[currentChildTab] : data?.data?.[currentTab];
    setDataset(datasets);
    // setMax(getMaxForChart(currentData));
    // setStep(getStepForChart(currentData));
  };

  const renderLegend = () => {
    return (
      <Space align="end">
        {Object.entries(data?.data?.[currentTab]?.[currentChildTab]).map(([key, obj]) => {
          if (!Array.isArray(obj)) {
            return (
              <React.Fragment key={key}>
                <Badge color={obj?.borderColor} text={t(obj?.label)} />
                <strong>{obj?.total || 0}</strong>
              </React.Fragment>
            );
          }
        })}
      </Space>
    );
  };
  const renderTabContent = () => {
    return (
      <>
        <div className="radio-size-wrap">
          <>
            {skeltonLoading ? (
              <SkeletonBody type="input" />
            ) : !isNoGraph(data?.data?.[currentTab]) ? (
              <>
                <Flex direction="horizontal" style={{ marginBottom: '10px' }} justify="space-between">
                  <Radio.Group defaultValue="all" value={state.productTab} onChange={onTypeChange}>
                    {data?.types?.map((item) => (
                      <RadioPill
                        value={item?.key}
                        key={item?.key}
                        shape="round"
                        size="small"
                        icon="MdPlayCircleOutline"
                      >
                        {item?.key == 'all' || !item?.icon ? (
                          <Badge key={item?.borderColor} color={item?.borderColor} text={t(item?.label)} />
                        ) : (
                          <>
                            <ProductTag icon={item?.icon} iconProps={item?.iconProps} shape="circle" />
                            {t(item?.label)}
                          </>
                        )}
                      </RadioPill>
                    ))}
                  </Radio.Group>
                  {currentTab === 'leads' && !isNoGraph(data?.data?.[currentTab]?.[currentChildTab]) && renderLegend()}
                </Flex>
              </>
            ) : null}
          </>
        </div>
        <div className="performance-lineChart">
          {skeltonLoading ? (
            <DataTable loading={skeltonLoading} columns={[]} data={[]} />
          ) : !isNoGraph(data?.data?.[currentTab]) ? (
            <ChartjsAreaChart
              id="performance"
              labels={data?.labels}
              datasets={dataset ? datasetsToShow(dataset, productTab) : []}
              options={{
                maintainAspectRatio: true,
                elements: { z: 9999 },
                legend: { display: false, align: 'start' },
                hover: { mode: 'index', intersect: false },
                tooltips: {
                  mode: 'label',
                  intersect: false,
                  backgroundColor: '#fff',
                  position: 'average',
                  enabled: false,
                  custom: customTooltips,
                  callbacks: {
                    title(ta) {
                      const { xLabel } = ta[0];
                      return `${xLabel?.replace('-', ', ')}`;
                    },
                    label(ta, d) {
                      const { yLabel, datasetIndex } = ta;
                      const metricLabel = d?.datasets[datasetIndex]?.isBifurcated
                        ? t(d?.datasets[datasetIndex]?.label)
                        : t(performanceObj.value);
                      return `${metricLabel}: ${yLabel}`;
                    },
                  },
                },
                scales: {
                  yAxes: [
                    {
                      gridLines: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        borderDash: [3, 3],
                        zeroLineColor: '#e5e9f2',
                        zeroLineWidth: 1,
                      },
                      ticks: {
                        beginAtZero: true,
                        fontSize: 13,
                        fontColor: '#182b49',
                        min: 0,
                        // max: max || 1,
                        // stepSize: step,
                        callback(label) {
                          return `${label} `;
                        },
                      },
                    },
                  ],
                  xAxes: [
                    {
                      gridLines: {
                        display: true,
                        zeroLineWidth: 2,
                        zeroLineColor: '#e5e9f2',
                        color: 'transparent',
                        z: 1,
                        tickMarkLength: 0,
                      },
                      ticks: {
                        padding: 10,
                        callback(tick, index, array) {
                          return array.length > 21 ? (index % 3 ? tick : tick) : tick;
                        },
                      },
                    },
                  ],
                },
              }}
              height={window.screen.width <= 575 ? 200 : isDashboard && isMultiPlatform ? 97 : 64}
            />
          ) : (
            <EmptyState
              className={isMobile ? 'fz-12' : ''}
              illustration={<AnalyticsPlaceholder color={tenantTheme['primary-light-2']} />}
              title={t('View In-Depth Insights')}
              message={t('See the number of views, clicks and leads that your listing has received.')}
              hideRetryButton
            />
          )}
        </div>
      </>
    );
  };

  return (
    <PerformanceChartWrapper
      accentColor={accentColor}
      style={{ ...wrapperRootStyle, pointerEvents: disabled ? 'none' : 'all' }}
    >
      <div style={{ ...(loading && { pointerEvents: 'none', opacity: 0.6 }) }}>
        <Card
          title={renderCardTitle && renderCardTitle()}
          accentColor={accentColor}
          tabList={item?.reach_data.map((e) => ({ key: e.key, tab: renderTabTitle(e) }))}
          tabProps={{
            size: 'middle',
            type: 'card',
            tabBarGutter: '0px',
            animated: false,
            activeKey: currentTab,
            onTabClick: (key) =>
              currentTab === 'leads' && key === currentTab && currentChildTab !== 'leads' && onTabChange(key),
          }}
          defaultActiveTabKey={performance}
          onTabChange={(key) => onTabChange(key)}
          bodyStyle={{ padding: 24, overflow: isMobile ? 'hidden' : 'unset' }}
          tabBarExtraContent={
            showLeadDetails &&
            !skeltonLoading &&
            !isMobile && (
              <>
                {state.currentTab === 'leads' && <div style={{ insetInline: 0 }} />}
                <Space size="large">
                  {item?.data_summary?.map((e, i) =>
                    e.key === 'leads' ? null : (
                      <React.Fragment key={i}>
                        {i > 1 && <Divider type="vertical" style={{ marginInline: 0, height: 40 }} />}
                        {renderTabTitle(e, () => onTabChange('leads', e.key), e.key === currentChildTab)}
                      </React.Fragment>
                    ),
                  )}
                </Space>
              </>
            )
          }
        >
          {state.currentTab === 'leads' && isMobile ? (
            <Tabs
              className="performance-chart-tabs"
              items={item?.data_summary.map((e) => ({ key: e.key, label: t(e.title), children: renderTabContent() }))}
              tabBarGutter={24}
              activeKey={currentChildTab}
              onChange={(key) => onChildTabChange(key)}
            />
          ) : (
            renderTabContent()
          )}
        </Card>
      </div>
    </PerformanceChartWrapper>
  );
}

export default LeadsViewsWidget;
