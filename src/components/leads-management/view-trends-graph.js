import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Icon, Modal, Text } from '../common';
import { ChartjsLineChart } from '../charts/chartjs';
import { getVariousDates } from '../../utility/date';
import { DateFilter } from '../common';
import { BottomSheetDrawer } from '../common/drawerPopover/styled';
import { t } from 'i18next';
import { formatNumberString } from '../../utility/utility';

const ViewTrendsGraph = ({
  visible,
  onCancel,
  title,
  labels,
  callResponseRates,
  whatsappResponseRates,
  callAvgResponseTime,
  whatsappAvgResponseTime,
  isViewTrendModalOpen,
  callsData,
  callStats,
  onDateRangeChange,
  summaryData,
}) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const [callDateRange, setCallDateRange] = useState(() => getVariousDates(29));
  const [whatsappDateRange, setWhatsappDateRange] = useState(() => getVariousDates(29));

  const selectedDateRange = isViewTrendModalOpen === 'call' ? callDateRange : whatsappDateRange;

  const currentSummary = isViewTrendModalOpen === 'call' ? summaryData?.calls : summaryData?.whatsapp;
  const avgResponseRate = Math.round(currentSummary?.avg_response_rate || 0);
  const avgResponseTime = currentSummary?.avg_response_time || 0;

  const handleDateChange = (startDate, endDate) => {
    if (startDate && endDate) {
      if (isViewTrendModalOpen === 'call') {
        setCallDateRange([startDate, endDate]);
      } else if (isViewTrendModalOpen === 'whatsapp') {
        setWhatsappDateRange([startDate, endDate]);
      }
      if (onDateRangeChange) {
        onDateRangeChange(startDate, endDate);
      }
    }
  };

  const handleDateClear = () => {
    const defaultRange = getVariousDates(29);
    if (isViewTrendModalOpen === 'call') {
      setCallDateRange(defaultRange);
    } else if (isViewTrendModalOpen === 'whatsapp') {
      setWhatsappDateRange(defaultRange);
    }
    if (onDateRangeChange) {
      onDateRangeChange(defaultRange[0], defaultRange[1]);
    }
  };

  const chartContent = (
    <div style={{ padding: '20px', border: '1px solid #EBEBEB', borderRadius: '8px' }}>
      {/* Chart Section */}
      <div>
        {/* Legend and Filter */}
        <Flex justify="space-between" align="center" style={{ marginBottom: '20px' }}>
          {/* Legend */}
          <Flex gap="24px" align="center">
            <Flex align="center" gap="8px">
              <div
                style={{
                  width: '15px',
                  height: '2px',
                  backgroundColor: '#58C1CA',
                  borderRadius: '2px',
                }}
              ></div>
              <span style={{ fontSize: '12px', color: '#707070' }}>{t('Response Rate')} <span style={{ fontWeight: '700' }}>{avgResponseRate}%</span></span>
            </Flex>
            <Flex align="center" gap="8px">
              <div
                style={{
                  width: '15px',
                  height: '2px',
                  backgroundColor: '#17407B',
                  borderRadius: '2px',
                }}
              ></div>
              <span style={{ fontSize: '12px', color: '#707070' }}>{t('Avg Response Time')} <span style={{ fontWeight: '700' }}>{avgResponseTime}</span></span>
            </Flex>
          </Flex>

          {/* Filter */}
          <div style={{ minWidth: '200px' }}>
            <DateFilter
              queryStartDate={selectedDateRange[0]}
              queryEndDate={selectedDateRange[1]}
              onSelect={handleDateChange}
              onClear={handleDateClear}
              minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 2))}
              fieldSize={isMobile && 'small'}
              reportsStaticRanges
            />
          </div>
        </Flex>

        <ChartjsLineChart
          labels={labels}
          datasets={[
            {
              data: isViewTrendModalOpen === 'call' ? callResponseRates : whatsappResponseRates,
              borderColor: '#58C1CA',
              borderWidth: 2,
              fill: false,
              label: t('Response Rate'),
              pointRadius: 3,
              pointBackgroundColor: '#58C1CA',
              pointBorderColor: '#58C1CA',
              pointHoverRadius: 6,
              tension: 0.1,
              yAxisID: 'y-axis-1',
            },
            {
              data: isViewTrendModalOpen === 'call' ? callAvgResponseTime : whatsappAvgResponseTime,
              borderColor: '#17407B',
              borderWidth: 2,
              fill: false,
              label: t('Avg Response Time'),
              pointRadius: 3,
              pointBackgroundColor: '#17407B',
              pointBorderColor: '#17407B',
              pointHoverRadius: 6,
              tension: 0.1,
              yAxisID: 'y-axis-2',
            },
          ]}
          height={350}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 20,
                bottom: 0,
                left: 0,
                right: 20,
              },
            },
            legend: {
              display: false,
            },
            scales: {
              yAxes: [
                {
                  id: 'y-axis-1',
                  type: 'linear',
                  position: 'left',
                  gridLines: {
                    color: '#F0F0F0',
                    drawBorder: true,
                    borderColor: '#F0F0F0',
                    zeroLineColor: '#F0F0F0',
                    zeroLineWidth: 1,
                  },
                  ticks: {
                    callback: function (value) {
                      return value + '%';
                    },
                    fontColor: '#A7A7A7',
                    fontSize: 12,
                    fontFamily: 'Figtree',
                    fontStyle: '500',
                    stepSize: 20,
                    beginAtZero: true,
                    padding: 12,
                  },
                  scaleLabel: {
                    display: false,
                  },
                },
                {
                  id: 'y-axis-2',
                  type: 'linear',
                  position: 'right',
                  gridLines: {
                    color: '#F0F0F0',
                    drawBorder: true,
                    borderColor: '#F0F0F0',
                    zeroLineColor: '#F0F0F0',
                    zeroLineWidth: 1,
                    drawOnChartArea: false,
                  },
                  ticks: {
                    callback: function (value) {
                      if (value === null || value === 0) return '0m';
                      const hours = Math.floor(value / 60);
                      const minutes = Math.floor(value % 60);
                      if (hours > 0) {
                        return hours + 'h ' + minutes + 'm';
                      }
                      return minutes + 'm';
                    },
                    fontColor: '#A7A7A7',
                    fontSize: 12,
                    fontFamily: 'Figtree',
                    fontStyle: '500',
                    beginAtZero: true,
                    padding: 12,
                  },
                  scaleLabel: {
                    display: false,
                  },
                },
              ],
              xAxes: [
                {
                  offset: false,
                  bounds: 'ticks',
                  gridLines: {
                    display: false,
                    offsetGridLines: false,
                  },
                  ticks: {
                    fontColor: '#A7A7A7',
                    fontSize: 12,
                    fontFamily: 'Figtree',
                    fontStyle: '500',
                    padding: 12,
                  },
                },
              ],
            },
          }}
        />
      </div>
    </div>
  );

  const renderMetricItem = (item, index) => (
    <div
      key={index}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '50%',
        marginLeft: index === 1 ? '30px' : '0px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Icon icon={item.icon} size="14px" />
        <Text style={{ fontSize: '12px', color: '#222222', fontWeight: '500' }}>{item.title}</Text>
      </div>
      <Text style={{ fontSize: '16px', fontWeight: '700', color: '#222222' }}>
        {item?.value}
        {item?.suffix || ''}
      </Text>
    </div>
  );

  const content = (
    <div style={{ gap: '8px', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F2FAFA80',
          height: '140px',
          width: '100%',
          padding: '16px 12px 16px 12px',
          borderRadius: '8px',
          border: '1px solid #E1F2F0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          {callsData?.slice(0, 2).map((item, index) => (
            <React.Fragment key={index}>
              {renderMetricItem(item, index)}
              {index === 0 && (
                <div
                  style={{
                    width: '1px',
                    height: '30px',
                    backgroundColor: '#DEDEDE',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          {callsData?.slice(2, 4).map((item, index) => (
            <React.Fragment key={index}>
              {renderMetricItem(item, index)}
              {index === 0 && (
                <div
                  style={{
                    width: '1px',
                    height: '30px',
                    backgroundColor: '#DEDEDE',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div
        style={{
          gap: '12px',
          flexDirection: 'row',
          justifyContent: 'space-between',
          display: 'flex',
        }}
      >
        {callStats?.map((item, index) => (
          <Flex
            key={index}
            align="center"
            style={{
              padding: '8px 12px 8px 12px',
              display: 'flex',
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #F5F5F5',
            }}
          >
            <div
              style={{
                placeContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                flexShrink: 0,
              }}
            >
              <Icon icon={item?.icon} size="16px" />
            </div>
            <Flex vertical gap="2px">
              <Text style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>{item.title}</Text>
              <Text style={{ fontSize: '12px', fontWeight: '600', color: '#222' }}>{item.value}</Text>
            </Flex>
          </Flex>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#E8F5FB66',
          borderRadius: '8px',
          minHeight: '341px',
          width: '100%',
          padding: '12px',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ marginBottom: '16px', width: '200px' }}>
          <DateFilter
            queryStartDate={selectedDateRange[0]}
            queryEndDate={selectedDateRange[1]}
            onSelect={handleDateChange}
            onClear={handleDateClear}
            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 2))}
            fieldSize={isMobile && 'small'}
            reportsStaticRanges
          />
        </div>

        <div
          style={{
            minWidth: '319px',
            width: '100%',
            minHeight: '241px',
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            border: '1px solid #F5F5F5',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              width: '100%',
              height: 17,
              fontSize: '14px',
              fontWeight: '700',
              fontStyle: 'bold',
              marginBottom: '25px',
            }}
          >
            {t('Response Rate and Time Graph')}
          </span>
          <ChartjsLineChart
            labels={labels}
            datasets={[
              {
                data: isViewTrendModalOpen === 'call' ? callResponseRates : whatsappResponseRates,
                borderColor: '#58C1CA',
                borderWidth: 2,
                fill: false,
                label: t('Response Rate'),
                pointRadius: 2,
                pointBackgroundColor: '#58C1CA',
                pointBorderColor: '#58C1CA',
                pointHoverRadius: 6,
                tension: 0.1,
                yAxisID: 'y-axis-1',
              },
              {
                data: isViewTrendModalOpen === 'call' ? callAvgResponseTime : whatsappAvgResponseTime,
                borderColor: '#17407B',
                borderWidth: 2,
                fill: false,
                label: t('Avg Response Time'),
                pointRadius: 2,
                pointBackgroundColor: '#17407B',
                pointBorderColor: '#17407B',
                pointHoverRadius: 6,
                tension: 0.1,
                yAxisID: 'y-axis-2',
              },
            ]}
            height={241}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
              },
              scales: {
                yAxes: [
                  {
                    id: 'y-axis-1',
                    type: 'linear',
                    position: 'left',
                    gridLines: {
                      color: '#F0F0F0',
                      drawBorder: true,
                      borderColor: '#F0F0F0',
                      zeroLineColor: '#F0F0F0',
                      zeroLineWidth: 1,
                    },
                    ticks: {
                      callback: function (value) {
                        return value + '%';
                      },
                      fontColor: '#A7A7A7',
                      fontSize: 10,
                      fontFamily: 'Figtree',
                      fontStyle: '500',
                      stepSize: 20,
                      beginAtZero: true,
                      padding: 10,
                    },
                  },
                  {
                    id: 'y-axis-2',
                    type: 'linear',
                    position: 'right',
                    gridLines: {
                      color: '#F0F0F0',
                      drawBorder: true,
                      borderColor: '#F0F0F0',
                      zeroLineColor: '#F0F0F0',
                      zeroLineWidth: 1,
                      drawOnChartArea: false,
                    },
                    ticks: {
                      callback: function (value) {
                        if (value === null || value === 0) return '0m';
                        const hours = Math.floor(value / 60);
                        const minutes = Math.floor(value % 60);
                        if (hours > 0) {
                          return hours + 'h ' + minutes + 'm';
                        }
                        return minutes + 'm';
                      },
                      fontColor: '#A7A7A7',
                      fontSize: 10,
                      fontFamily: 'Figtree',
                      fontStyle: '500',
                      beginAtZero: true,
                      padding: 10,
                    },
                  },
                ],
                xAxes: [
                  {
                    offset: false,
                    bounds: 'ticks',
                    gridLines: {
                      display: false,
                      offsetGridLines: false,
                    },
                    ticks: {
                      fontColor: '#A7A7A7',
                      fontSize: 12,
                      fontFamily: 'Figtree',
                      fontStyle: '500',
                      padding: 5,
                    },
                  },
                ],
              },
            }}
          />
        </div>

        <Flex gap="24px" align="center" style={{ marginTop: '20px' }}>
          <Flex align="center" gap="8px">
            <div
              style={{
                width: '15px',
                height: '2px',
                backgroundColor: '#58C1CA',
                borderRadius: '2px',
              }}
            ></div>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {t('Response Rate')} <span style={{ fontWeight: '700' }}>{avgResponseRate}%</span>
            </span>
          </Flex>
          <Flex align="center" gap="8px">
            <div
              style={{
                width: '15px',
                height: '2px',
                backgroundColor: '#17407B',
                borderRadius: '2px',
              }}
            ></div>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {t('Avg Response Time')} <span style={{ fontWeight: '700' }}>{avgResponseTime}</span>
            </span>
          </Flex>
        </Flex>
      </div>
    </div>
  );

  // Mobile: Show Bottom Sheet
  if (isMobile) {
    return (
      <BottomSheetDrawer
        title={title}
        onCloseDrawer={onCancel}
        placement="bottom"
        height="80vh"
        className="drawer-container"
        rootClassName="bottom-sheet"
        open={visible}
        bodyStyle={{ padding: '10px 16px 10px 16px' }}
        footer={null}
      >
        {content}
      </BottomSheetDrawer>
    );
  }

  // Web: Show Modal
  return (
    <Modal title={title} visible={visible} onCancel={onCancel} width={900} footer={null}>
      {chartContent}
    </Modal>
  );
};

export default ViewTrendsGraph;
