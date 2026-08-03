import { t } from 'i18next';
import { customTooltips } from '../utilities/utilities';

export const getGraphOptions = () => {
  return {
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
          return `${xLabel.replace('-', ', ')}`;
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
            // max: 50,
            // max: getMaxForChart(graphData?.data?.[currentTab]),
            //   stepSize: step,
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
  };
};
