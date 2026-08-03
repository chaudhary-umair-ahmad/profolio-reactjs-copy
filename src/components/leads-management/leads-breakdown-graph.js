import tenantConstants from '@constants';
import tenantTheme from '@theme';
import { Badge, Radio, Row, Typography } from 'antd';
import cx from 'clsx';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getVariousDates } from '../../utility/date';
import { isNoGraph } from '../../utility/utility';
import { ChartjsAreaChart } from '../charts/chartjs';
import { Card, DateFilter, EmptyState, Flex, Group, Popover, ProductTag, Segmented, Select } from '../common';
import { RadioPill } from '../common/radio-button/styled';
import Statistic from '../common/statistic';
import { AnalyticsPlaceholder } from '../svg';
import { PerformanceChartWrapper } from '../widgets/styled';
import { getGraphOptions } from './leads-breakdown-graph-configs';
import LeadsBreakdownGraphSkeleton from './leads-breakdown-graph-skeleton';

const CardWithFullWidthTabs = styled(Card)`
  ${(props) =>
    props.fullWidthTabs &&
    `
    .ant-tabs-nav-wrap {
      width: 100% !important;
    }
    .ant-tabs-nav-list {
      width: 100% !important;
    }
    .ant-tabs-tab {
      flex: 1;
    }
  `}
`;

const { Text, Title } = Typography;

const LeadsBreakdownGraph = (props) => {
  const { graphData, widgetData, loading, onFilterChange, filterObj } = props;
  const [currentTab, setCurrentTab] = useState('calls');
  const [productType, setProductType] = useState('all');
  const [purposeTab, setPurposeTab] = useState('all');
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [dateRange, setDateRange]=useState(filterObj?.date_between || getVariousDates(29))

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

  const SKELETON_LOADING = !!(loading && !graphData && !widgetData);
  const dataset = useMemo(() => {
    let newDataset;
    const selectedTabData = graphData?.data?.[currentTab];
    newDataset = selectedTabData
      ? Object.keys(selectedTabData)?.map((key) => {
          const item = selectedTabData?.[key];
          return {
            label: item?.label,
            borderColor: item.borderColor,
            key: key,
            borderWidth: 2,
            pointRadius: '0',
            pointBorderColor: '#fff',
            pointBackgroundColor: item?.borderColor,
            hidden: false,
            clip: false,
            fill: false,
            data: item?.[productType] ? [...item?.[productType]] : [],
            // backgroundColor: chroma.mix('#fff', productColors?.[item?.key]?.borderColor, 0.16),
          };
        })
      : [];
    return newDataset;
  }, [productType, currentTab, graphData]);

  const renderFilters = () => {
    return (
      <Group template="repeat(1, 2fr)" style={{ gap: 16, alignItems: 'center' }}>
        {/* {renderPurposeFilter()} */}
        {renderDateFilter()}
      </Group>
    );
  };

  const renderPurposeFilter = () => {
    return isMobile ? (
      <Select
        size="small"
        placeholder={t('Select Purpose')}
        defaultValue={purposeTab}
        options={btnList}
        onChange={(e) => {
          setPurposeTab(e);
          onFilterChange({ ...filterObj, purpose: e });
        }}
        horizontal={!isMobile}
        disabled={loading}
      />
    ) : (
      <Segmented
        value={purposeTab}
        options={btnList}
        onChange={(e) => {
          setPurposeTab(e);
          onFilterChange({ ...filterObj, purpose: e });
        }}
        disabled={loading}
      />
    );
  };

  const renderDateFilter = () => {
    return (
      <DateFilter
        queryStartDate={dateRange[0]}
        queryEndDate={dateRange[1]}
        onSelect={(startDate, endDate) => {
          if (startDate && endDate) {
            onFilterChange({ ...filterObj, start_date: startDate, end_date: endDate });
            setDateRange([startDate, endDate]);
          }
        }}
        onClear={() => {}}
        minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 2))}
        disabled={loading}
        loading={loading}
        fieldSize={isMobile && 'small'}
        reportsStaticRanges
      />
    );
  };

  const renderTabContent = () => {
    return (
      <>
        <ChartjsAreaChart
          labels={graphData?.labels}
          datasets={dataset}
          options={getGraphOptions()}
          height={window.screen.width <= 575 ? 200 : 64}
        />
      </>
    );
  };

  const onTypeChange = (e) => {
    setProductType(e.target.value);
  };

  const renderChildTabs = () => {
    return (
      <Row justify="end" className="mb-16" align="middle" style={{ gap: '8px', width: '100%' }}>
        {/* <div className="radio-size-wrap">
          <Radio.Group
            defaultValue="all"
            value={productType}
            onChange={onTypeChange}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: isMobile && 'wrap',
              '--radio-pill-font-size': isMobile && '12px',
            }}
          >
            {graphData?.productTypes.map((item) => (
              <RadioPill value={item?.key} key={item?.key} shape="round" size="small" style={{ '--padding-x': '6px' }}>
                {item?.key == 'all' ? (
                  <Badge color={item?.color} text={t(item?.title)} style={{ '--font-size': '14px' }} />
                ) : (
                  <>
                    <ProductTag icon={item?.icon} iconProps={item?.iconProps} shape="circle" />
                    {t(item?.title)}
                  </>
                )}
              </RadioPill>
            ))}
          </Radio.Group>
        </div> */}

        <Flex gap={isMobile ? '0 14px' : '30px'} wrap={isMobile && true}>
          {Object.keys(graphData?.data?.[currentTab]).map((key) => {
            const item = graphData?.data?.[currentTab]?.[key];
            return (
              <div key={key}>
                <Badge
                  color={item?.borderColor}
                  text={t(item?.label)}
                  style={{ '--ant-font-size': isMobile && '12px', '--ant-color-text': tenantTheme['gray700'] }}
                />
                <strong className={isMobile ? 'fz-12' : ''} style={{ marginInlineStart: '6px' }}>
                  {item?.total || 0}
                </strong>
              </div>
            );
          })}
        </Flex>
      </Row>
    );
  };

  const onTabChange = (key) => {
    setCurrentTab(key);
  };

  const iconSizes = { size: isMobile ? '1.2em' : '1.6em', iconContainerSize: isMobile ? '32px' : '40px' };

  const renderTabTitle = (item) => (
    <>
      <Popover
        getPopupContainer={() => document.body}
        content={item?.popoverContent}
        action={item?.popoverContent ? 'hover' : null}
      >
        <Statistic
          key={item?.title}
          icon={item?.icon}
          iconProps={{
            hasBackground: true,
            ...iconSizes,
            color: item.iconColor || tenantTheme['primary-color'] + 'aa',
            ...item?.iconProps,
          }}
          title={t(item?.title)}
          formatter={<Number value={item?.value ? item.value : 0} compact={false} />}
          value={item?.value ? item.value : 0}
          // suffix={
          //   item?.suffix?.value ? (
          //     <div className="fz-12 text-muted">
          //       ({item?.suffix?.value}
          //       {t(item?.suffix?.text)})
          //     </div>
          //   ) : null
          // }
          // lead={!isMobile && item?.lead}
          direction={isMobile ? 'vertical' : null}
          // percentage={item.percentage}
          // growth={item.growth}
          // since_when={item.since_when}
          // inline={item.inline}
          inlineTrends
          trends={false}
          titleColor="#4F4F4F"
          titleFontWeight={500}
          fontSize="24px"
        />
      </Popover>
    </>
  );

  const renderCardTitle = () => {
    return (
      <Row
        className={cx('px-16')}
        justify="space-between"
        style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: isMobile ? '14px' : '10px'}}
      >
        <div>
          <Text style={{ fontSize: isMobile ? '14px' : '18px', fontWeight: '600', color: '#222222' }}>
            {t('Leads Trends')}
          </Text>
        </div>

        {renderFilters()}
      </Row>
    );
  };

  const renderTotalLeads = () => {
    return (
      <div className="fw-700 fz-16">
        <Text type="secondary" className="fw-400 fz-14" style={{ paddingInlineEnd: '8px' }}>
          {t('Total Leads')}:
        </Text>
        {widgetData?.find((e) => e.key === 'leads')?.value}
      </div>
    );
  };

  return (
    <>
      <PerformanceChartWrapper
        blurEffect={false}
        gradientBackground="linear-gradient(180deg, #F2FAFA 0%, #FFFFFF 80.5%)"
        style={{
          ...(loading && { pointerEvents: 'none', opacity: 0.6 }),
          '--height': 'auto',
          '--bottom-border': 0,
          '--mx-width': isMobile && '100%',
          '--margin-left': 'auto',
          'overflow': 'auto',
          backgroundColor: '#fff',
        }}
      >
        <CardWithFullWidthTabs
          fullWidthTabs
          title={!SKELETON_LOADING && renderCardTitle()}
          tabList={widgetData
            ?.filter((e) => e.key !== 'leads')
            .map((e) => {
              return {
                key: e.key,
                title: e.title,
                tab: renderTabTitle(e),
              };
            })}
          onTabChange={onTabChange}
          bodyStyle={{
            padding: 16,
            overflow: isMobile ? 'hidden' : 'unset',
          }}
          style={{ width: '100%', paddingTop: 0 }}
          tabProps={{
            size: 'middle',
            type: 'card',
            tabBarGutter: '0px',
            animated: false,
            activeKey: currentTab,
          }}
          defaultActiveTabKey={currentTab}
          tabBarExtraContent={!isMobile && !tenantConstants.LMS_ENABLED.IS_TOTAL_LEADS_ENABLED && renderTotalLeads()}
          // tabBarExtraContent={
          //   !isMobile && (
          //     <>
          //       <Space size="large">
          //         {widgetData
          //           ?.find((e) => e.key == currentTab)
          //           ?.subList?.map((e, i) => (
          //             <>
          //               {i > 1 && <Divider type="vertical" style={{ marginInline: 0, height: 40 }} />}
          //               {renderTabTitle(e)}
          //             </>
          //           ))}
          //       </Space>
          //     </>
          //   )
          // }
        >
          {SKELETON_LOADING ? (
            <LeadsBreakdownGraphSkeleton />
          ) : isNoGraph(graphData?.data?.[currentTab]) ? (
            <EmptyState
              className={isMobile ? 'fz-12' : ''}
              illustration={<AnalyticsPlaceholder color={tenantTheme['primary-light-2']} />}
              title={t('View In-Depth Insights')}
              message={t('See the number of views, clicks and leads that your listing has received.')}
              hideRetryButton
            />
          ) : (
            <>
              {renderChildTabs()}
              {renderTabContent()}
            </>
          )}
        </CardWithFullWidthTabs>
      </PerformanceChartWrapper>
    </>
  );
};

export default LeadsBreakdownGraph;
