import { Badge, Radio, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PerformanceChartWrapper } from './styled';
import { DataTable, Heading, RadioButtons } from '../common';
import { getMaxForChart, getStepForChart } from '../../utility/utility';
import Card from '../common/cards/Card';
import { ChartjsAreaChart } from '../charts/chartjs';
import { RadioPill } from '../common/radio-button/styled';
import { SkeletonBody } from '../skeleton/Skeleton';
import { customTooltips } from '../utilities/utilities';

function LeadsViewsWidget(props) {
  const {
    data,
    loading,
    reloadDataSet,
    accentColor,
    platform,
    purpose,
    performance,
    onFilterChange,
    wrapperRootStyle,
  } = props;
  const [state, setState] = useState({
    productTab: 'all',
    performanceTab: performance || data?.performanceBy[0].key,
    purposeTab: purpose || data?.purposes[0].key,
  });
  const [performanceObj, setPerformanceObj] = useState(
    data?.performanceBy.find((stat) => stat.key === performance) || data?.performanceBy[0],
  );

  const makeDatasets = (data, performanceTab, purposeTab) => {
    const datasets = data?.types?.map((item) => {
      return {
        key: item?.key,
        value: item?.value,
        data: JSON.parse(JSON.stringify(data.data[purposeTab][performanceTab][item?.value])),
        borderColor: item?.borderColor,
        borderWidth: 2,
        fill: false,
        backgroundColor: item?.backgroundColor,
        label: item?.label,
        pointRadius: '0',
        pointBorderColor: '#fff',
        pointBackgroundColor: item.borderColor,
        hidden: false,
      };
    });
    setDataset(datasets);
    setMax(getMaxForChart(data?.data?.[purposeTab]?.[performanceTab]));
    setStep(getStepForChart(data?.data?.[purposeTab]?.[performanceTab]));
  };
  const { performanceTab, purposeTab, productTab } = state;

  const [dataset, setDataset] = useState([]);
  const [max, setMax] = useState(null);
  const [step, setStep] = useState(null);
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  useEffect(() => {
    data && !reloadDataSet && makeDatasets(data, performanceTab, purposeTab);
  }, [data, reloadDataSet, state.performanceTab, state.purposeTab]);

  const onPerformanceTab = (value) => {
    setState({
      ...state,
      performanceTab: value,
    });

    const hit = !!data?.performanceBy?.find((e) => e.key === value)?.hit;
    onFilterChange({ stat: value }, platform, !hit);
    const newPerformanceObj = data?.performanceBy?.find((item) => {
      return item.key === value;
    });
    setPerformanceObj(newPerformanceObj);
  };

  const onPurposeChange = (e) => {
    const { value } = e.target;
    setState((prev) => ({ ...prev, purposeTab: value }));
    const hit = !!data?.purposes?.find((e) => e.key === value).hit;
    // 4th arg set to true when only filterUpdation is required.
    onFilterChange({ purpose: value }, platform, !hit);
  };

  const onTypeChange = (e) => {
    setState({
      ...state,
      productTab: e.target.value,
    });
  };

  const datasetsToShow = (dataset, productTab) => {
    let newDataset = [...dataset.map((e) => ({ ...e, fill: false }))];
    if (productTab !== 'all') {
      newDataset = newDataset.map((e) => {
        if (e.key !== productTab) {
          return { ...e, hidden: true };
        }
        return { ...e, hidden: false };
      });
    }
    return newDataset;
  };
  const { t } = useTranslation();
  return (
    <PerformanceChartWrapper style={{ ...wrapperRootStyle }}>
      <Card
        accentColor={accentColor}
        title={
          props.chartTitle ? (
            <Row justify="space-between">
              {loading ? (
                <SkeletonBody type="button" />
              ) : (
                <Heading className="mb-0 py-4" as="h4">
                  {t(props.chartTitle)}
                </Heading>
              )}
            </Row>
          ) : null
        }
        tabList={data?.performanceBy.map((e) => {
          return {
            key: e.key,
            tab: t(e.label),
          };
        })}
        tabBarExtraContent={
          loading ? (
            <SkeletonBody type="input" />
          ) : (
            <RadioButtons
              btnSize="small"
              value={purposeTab}
              buttonList={data?.purposes}
              handleChange={onPurposeChange}
              isButton
              radioGroupGap="0px"
              color={accentColor}
            />
          )
        }
        defaultActiveTabKey={performance}
        onTabChange={(key) => onPerformanceTab(key)}
        bodyStyle={{ padding: 24, overflow: isMobile ? 'hidden' : 'unset' }}
      >
        <div className="radio-size-wrap">
          <>
            {loading ? (
              <SkeletonBody type="input" />
            ) : (
              <Radio.Group defaultValue="all" onChange={onTypeChange}>
                {data && (
                  <RadioPill value="all" shape="round" size="small" color={accentColor}>
                    <Badge key="cyan" color={accentColor} text={t('All')} />
                  </RadioPill>
                )}
                {data?.types?.map((item) => (
                  <RadioPill value={item?.key} key={item?.key} shape="round" size="small" color={accentColor}>
                    <Badge key={item?.borderColor} color={item?.borderColor} text={t(item?.label)} />
                  </RadioPill>
                ))}
              </Radio.Group>
            )}
          </>
        </div>
        <div className="performance-lineChart">
          {loading ? (
            <DataTable loading={loading} columns={[]} data={[]} />
          ) : data ? (
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
                      return `${t(performanceObj.value)} - ${xLabel}`;
                    },
                    label(ta, d) {
                      const { yLabel, datasetIndex } = ta;
                      return `${t(d?.datasets[datasetIndex]?.label)}: ${yLabel}`;
                    },
                  },
                },
                scales: {
                  yAxes: [
                    {
                      gridLines: {
                        display: true,
                        color: 'transparent',
                        borderDash: [3, 3],
                        zeroLineColor: '#e5e9f2',
                        zeroLineWidth: 1,
                      },
                      ticks: {
                        beginAtZero: true,
                        fontSize: 13,
                        fontColor: '#182b49',
                        min: 0,
                        max: max || 1,
                        stepSize: step,
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
                        zeroLineColor: '#e5e9f2',
                        zeroLineWidth: 1,
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
              height={window.innerWidth <= 575 ? 200 : 86}
            />
          ) : null}
        </div>
      </Card>
    </PerformanceChartWrapper>
  );
}

export default LeadsViewsWidget;
