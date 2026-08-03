import { Bar, Doughnut, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { ChartContainer } from '../widgets/styled';
import { Number } from '../common';
import { customTooltips } from '../utilities/utilities';
import { useChartData } from '../../hooks';
import { useSelector } from 'react-redux';

const ChartjsBarChart = (props) => {
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets = [
      { data: [], backgroundColor: '#001737', barPercentage: 0.6 },
      { data: [], backgroundColor: '#1ce1ac', barPercentage: 0.6 },
    ],
    options = {
      maintainAspectRatio: true,
      responsive: true,
      legend: { display: false, labels: { display: false } },
      scales: {
        yAxes: [
          {
            gridLines: { color: '#e5e9f2' },
            ticks: { beginAtZero: true, fontSize: 10, fontColor: '#182b49', max: 80 },
          },
        ],
        xAxes: [{ gridLines: { display: false }, ticks: { beginAtZero: true, fontSize: 11, fontColor: '#182b49' } }],
      },
    },
    height = 200,
  } = props;
  const data = {
    datasets,
    labels,
  };
  return <Bar data={data} height={height} options={options} />;
};

ChartjsBarChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number,
  datasets: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
};

const ChartjsHorizontalChart = (props) => {
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets = [
      {
        data: [],
        backgroundColor: '#001737',
        barPercentage: 0.6,
      },
      {
        data: [],
        backgroundColor: '#1ce1ac',
        barPercentage: 0.6,
      },
    ],
    options = {
      maintainAspectRatio: true,
      responsive: true,
      legend: {
        display: false,
        labels: {
          display: false,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
              fontSize: 10,
              fontColor: '#182b49',
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              color: '#e5e9f2',
            },

            ticks: {
              beginAtZero: true,
              fontSize: 11,
              fontColor: '#182b49',
              max: 100,
            },
          },
        ],
      },
    },
    height = 200,
  } = props;
  const data = {
    datasets,
    labels,
  };
  return <HorizontalBar data={data} height={height} options={options} />;
};

ChartjsHorizontalChart.propTypes = {
  height: PropTypes.number,
  labels: PropTypes.arrayOf(PropTypes.string),
  datasets: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
};

const ChartjsStackedChart = (props) => {
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets = [
      {
        data: [],
        backgroundColor: '#001737',
        barPercentage: 0.6,
      },
      {
        data: [],
        backgroundColor: '#1ce1ac',
        barPercentage: 0.6,
      },
    ],
    options = {
      maintainAspectRatio: true,
      responsive: true,
      legend: {
        display: false,
        labels: {
          display: false,
        },
      },
      scales: {
        yAxes: [
          {
            stacked: true,
            gridLines: {
              color: '#e5e9f2',
            },
            ticks: {
              beginAtZero: true,
              fontSize: 10,
              fontColor: '#182b49',
            },
          },
        ],
        xAxes: [
          {
            stacked: true,
            gridLines: {
              display: false,
            },

            ticks: {
              beginAtZero: true,
              fontSize: 11,
              fontColor: '#182b49',
            },
          },
        ],
      },
    },
    height = 200,
  } = props;
  const data = {
    datasets,
    labels,
  };
  return <Bar data={data} height={height} options={options} />;
};

ChartjsStackedChart.propTypes = {
  height: PropTypes.number,
  labels: PropTypes.arrayOf(PropTypes.string),
  datasets: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
};

const ChartjsLineChart = (props) => {
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets = [
      {
        data: [],
        borderColor: '#001737',
        borderWidth: 2,
        fill: false,
      },
      {
        data: [],
        borderColor: '#1ce1ac',
        borderWidth: 2,
        fill: false,
      },
    ],
    options = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: '-10',
          right: 0,
          top: 0,
          bottom: '-10',
        },
      },
      legend: {
        display: false,
        labels: {
          display: false,
        },
      },
    },
    height = 479,
    layout,
    width = null,
    id,
  } = props;
  const data = {
    labels,
    datasets,
  };
  return (
    <ChartContainer className="parentContainer">
      <Line
        id={id && id}
        width={width}
        data={data}
        height={height}
        options={{
          ...options,
          ...layout,
        }}
      />
    </ChartContainer>
  );
};

ChartjsLineChart.propTypes = {
  height: PropTypes.number,
  labels: PropTypes.arrayOf(PropTypes.string),
  datasets: PropTypes.arrayOf(PropTypes.object),
  layout: PropTypes.object,
  width: PropTypes.number,
  options: PropTypes.object,
  id: PropTypes.string,
};

const ChartjsAreaChart = (props) => {
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets = [
      {
        data: [],
        borderColor: '#001737',
        borderWidth: 1,
        fill: true,
        backgroundColor: '#00173750',
        pointHoverBorderColor: 'transparent',
      },
      {
        data: [],
        borderColor: '#1ce1ac',
        borderWidth: 1,
        fill: true,
        backgroundColor: '#1ce1ac50',
        pointHoverBorderColor: 'transparent',
      },
    ],
    options = {
      maintainAspectRatio: true,
      hover: {
        mode: 'nearest',
        intersect: false,
      },

      layout: {
        padding: {
          left: -10,
          right: 0,
          top: 2,
          bottom: -10,
        },
      },
      legend: {
        display: false,
        labels: {
          display: false,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        yAxes: [
          {
            stacked: true,
            gridLines: {
              display: false,
              color: '#e5e9f2',
            },
            ticks: {
              beginAtZero: true,
              fontSize: 10,
              display: false,
              stepSize: 20,
            },
          },
        ],
        xAxes: [
          {
            stacked: true,
            gridLines: {
              display: false,
            },

            ticks: {
              beginAtZero: true,
              fontSize: 11,
              display: false,
            },
          },
        ],
      },
    },
    height = 250,
    layout,
    id,
    sendRefToParent = () => {},
  } = props;
  const rtl = useSelector((state) => state.app.AppConfig.rtl);

  const data = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      lineTension: 0,
      pointRadius: 2,
      pointBackgroundColor: ds.borderColor,
      pointBorderColor: ds.borderColor,
    })),
  };
  return (
    <div>
      <ChartContainer className="parentContainer">
        <Line
          id={id}
          data={data}
          height={height || 200}
          options={{
            tooltips: {
              mode: 'nearest',
              intersect: false,
              enabled: false,
              custom: customTooltips,
              callbacks: {
                labelColor(tooltipItem, chart) {
                  return {
                    backgroundColor: datasets.map((item) => item.borderColor),
                    borderColor: 'transparent',
                  };
                },
              },
            },
            ...options,
            scales: {
              ...options.scales,
              xAxes: options.scales?.xAxes?.map((axis) => ({
                ...axis,
                ticks: {
                  ...axis.ticks,
                  reverse: rtl,
                },
              })),
              yAxes: options.scales?.yAxes?.map((axis) => ({
                ...axis,
                position: rtl ? 'right' : 'left',
              })),
            },
            ...layout,
          }}
        />
      </ChartContainer>
    </div>
  );
};

ChartjsAreaChart.propTypes = {
  height: PropTypes.number,
  labels: PropTypes.arrayOf(PropTypes.string),
  datasets: PropTypes.arrayOf(PropTypes.object),
  layout: PropTypes.object,
  options: PropTypes.object,
  id: PropTypes.string,
};

const ChartjsBarChartTransparent = (props) => {
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets = [
      {
        data: [],
        backgroundColor: 'rgba(0,23,55, .5)',
        label: 'Profit',
        barPercentage: 0.6,
      },
      {
        data: [],
        backgroundColor: 'rgba(28,225,172, .5)',
        label: 'Lose',
        barPercentage: 0.6,
      },
    ],
    options = {
      maintainAspectRatio: true,
      responsive: true,
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
        labels: {
          boxWidth: 6,
          display: true,
          usePointStyle: true,
        },
      },
      layout: {
        padding: {
          left: '0',
          right: 0,
          top: 0,
          bottom: '0',
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              color: '#e5e9f2',
            },
            ticks: {
              beginAtZero: true,
              fontSize: 13,
              fontColor: '#182b49',
              max: 80,
              stepSize: 20,
              callback(value, index, values) {
                return `${value}k`;
              },
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
            },

            ticks: {
              beginAtZero: true,
              fontSize: 13,
              fontColor: '#182b49',
            },
          },
        ],
      },
    },
    height = 176,
    width,
    layout,
  } = props;

  const data = {
    labels,
    datasets,
  };

  return (
    <ChartContainer className="parentContainer">
      <Bar
        data={data}
        height={window.innerWidth <= 575 ? 230 : height}
        width={width}
        options={{
          ...options,
          ...layout,
          tooltips: {
            mode: 'label',
            intersect: false,
            position: 'average',
            enabled: false,
            custom: customTooltips,
            callbacks: {
              label(t, d) {
                const dstLabel = d.datasets[t.datasetIndex].label;
                const { yLabel } = t;
                return `${dstLabel}: ${yLabel}`;
              },
              labelColor(tooltipItem, chart) {
                const dataset = chart.config.data.datasets[tooltipItem.datasetIndex];
                return {
                  backgroundColor: dataset.hoverBackgroundColor,
                  borderColor: 'transparent',
                  usePointStyle: true,
                };
              },
            },
          },
        }}
      />
    </ChartContainer>
  );
};

ChartjsBarChartTransparent.propTypes = {
  height: PropTypes.number,
  labels: PropTypes.arrayOf(PropTypes.string),
  datasets: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
  layout: PropTypes.object,
};

const ChartjsBarChartGrad = (props) => {
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets = [
      {
        data: [],
        backgroundColor: 'rgba(0,23,55, .5)',
        barPercentage: 0.6,
      },
      {
        data: [],
        backgroundColor: 'rgba(28,225,172, .5)',
        barPercentage: 0.6,
      },
    ],
    options = {
      maintainAspectRatio: true,
      responsive: true,
      layout: {
        padding: {
          left: '0',
          right: 0,
          top: 0,
          bottom: '0',
        },
      },
      legend: {
        display: false,
        labels: {
          display: false,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              color: '#e5e9f2',
            },
            ticks: {
              beginAtZero: true,
              fontSize: 10,
              fontColor: '#182b49',
              max: 80,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
            },

            ticks: {
              beginAtZero: true,
              fontSize: 11,
              fontColor: '#182b49',
            },
          },
        ],
      },
    },
    height,
    layout,
  } = props;
  const data = {
    labels,
    datasets,
  };
  return <Bar data={data} height={height} options={{ ...options, ...layout }} />;
};

ChartjsBarChartGrad.propTypes = {
  height: PropTypes.number,
  labels: PropTypes.arrayOf(PropTypes.string),
  datasets: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
  layout: PropTypes.object,
};

const ChartjsPieChart = (props) => {
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets = [
      {
        data: [],
        backgroundColor: ['#560bd0', '#007bff', '#00cccc', '#cbe0e3', '#74de00'],
      },
    ],
    options = {
      maintainAspectRatio: true,
      responsive: true,
      legend: {
        display: false,
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
    height = 200,
  } = props;
  const data = {
    labels,
    datasets,
  };
  return <Pie data={data} height={height} options={options} />;
};

ChartjsPieChart.propTypes = {
  height: PropTypes.number,
  labels: PropTypes.arrayOf(PropTypes.string),
  datasets: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
};
/**
 *
 *  {const labels = chart.data.labels.reduce((prev, curent, i) => {
        return `${prev}<li><span class="doughnutLabelColor" style="background-color:${chart.data.datasets[0].backgroundColor[i]}"></span><span class="doughnutLabe">${curent}</span></li>`;
      }, '');
      const generatedLegend = `<ul class="${chart.id}-legend">${labels}</ul>`;

      return generatedLegend;} props
 */

const ChartjsDonutChart = (props) => {
  const { t } = useTranslation();
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets = [
      {
        data: [],
        backgroundColor: ['#560bd0', '#007bff', '#00cccc', '#cbe0e3', '#74de00'],
      },
    ],
    options = {
      cutoutPercentage: 90,
      maintainAspectRatio: true,
      responsive: true,
      legend: {
        display: false,
        position: 'bottom',
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
    width,
    height = 240,
    innerLabel,
    showAvaialbleByTotal,
    showAvailableCredits = true,
    showTotalInnerLable,
  } = props;
  const { ref } = useChartData();
  const data = {
    labels,
    datasets,
  };
  const total = datasets?.[0]?.data?.length ? datasets?.[0]?.data?.reduce((a, b) => a + b) : 0;
  return (
    <div style={{ position: 'relative' }}>
      {showAvaialbleByTotal ? (
        <>
          <div className="value color-gray-lightest">
            <div className="flex justify-content-center align-items-center mb-4 color-dark">
              <Number value={datasets[0].data?.[1]} compact={false} fractionDigits={1} />
              <div className="of">
                <span>{t('Out Of')}</span>
              </div>
              <small>
                <Number value={total} compact={false} fractionDigits={1} />
              </small>
            </div>

            {!!showTotalInnerLable && !!innerLabel ? innerLabel : t('Available')}
          </div>
        </>
      ) : (
        showAvailableCredits && (
          <p>
            <Number value={datasets[0]?.total} compact={false} />
            {!!showTotalInnerLable && !!innerLabel ? innerLabel : t('Available')}
          </p>
        )
      )}
      <Doughnut
        data={data}
        height={height}
        width={width}
        options={{ cutoutPercentage: options.cutoutPercentage, defaultColor: 'red', ...options }}
      />
    </div>
  );
};

ChartjsDonutChart.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  labels: PropTypes.arrayOf(PropTypes.string),
  datasets: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
};

const ChartjsDonutChart2 = (props) => {
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets = [
      {
        data: [],
        backgroundColor: ['#560bd0', '#007bff', '#00cccc', '#cbe0e3', '#74de00'],
      },
    ],
    options = {
      cutoutPercentage: 60,
      maintainAspectRatio: false,
      responsive: false,
      legend: {
        display: false,
        position: 'bottom',
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
    height = 220,
  } = props;
  const { ref } = useChartData();
  const dataInfo = {
    labels,
    datasets,
  };

  return (
    <div>
      <Doughnut ref={ref} data={dataInfo} height={height} options={options} width={200} />

      <div className="align-center-v justify-content-between rd-labels">
        <div className="revenue-chat-label">
          {labels.map((label, key) => {
            return (
              <div key={key + 1} className="chart-label">
                <span className={`label-dot dot-${label}`} />
                {label}
              </div>
            );
          })}
        </div>
        <div className="revenue-chart-data">
          {datasets.map((item, key) => {
            const { data } = item;
            return (
              <div key={key + 1}>
                {data.map((value) => {
                  return (
                    <p key={value}>
                      <strong>${value}</strong>
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="revenue-chat-percentage">
          <span>45%</span>
          <span>45%</span>
          <span>45%</span>
        </div>
      </div>
    </div>
  );
};

ChartjsDonutChart2.propTypes = {
  height: PropTypes.number,
  labels: PropTypes.arrayOf(PropTypes.string),
  datasets: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
};

const ChartjsDonut = (props) => {
  const {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets = [
      {
        data: [],
        backgroundColor: ['#560bd0', '#007bff', '#00cccc', '#cbe0e3', '#74de00'],
      },
    ],
    options = {
      cutoutPercentage: 60,
      maintainAspectRatio: false,
      responsive: false,
      legend: {
        display: false,
        position: 'bottom',
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
    height = 220,
  } = props;
  const { ref } = useChartData();
  const dataInfo = {
    labels,
    datasets,
  };

  return <Doughnut ref={ref} data={dataInfo} height={height} options={options} width={200} />;
};

ChartjsDonut.propTypes = {
  height: PropTypes.number,
  labels: PropTypes.array,
  datasets: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
};

export {
  ChartjsDonutChart,
  ChartjsDonutChart2,
  ChartjsPieChart,
  ChartjsBarChartGrad,
  ChartjsBarChartTransparent,
  ChartjsAreaChart,
  ChartjsLineChart,
  ChartjsStackedChart,
  ChartjsHorizontalChart,
  ChartjsBarChart,
  ChartjsDonut,
};
