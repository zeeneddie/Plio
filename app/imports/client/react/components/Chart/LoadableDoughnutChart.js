/* eslint-disable react/prop-types */

import React from 'react';
import Loadable from 'react-loadable';
import { pure } from 'recompose';

import { PreloaderPage } from '../';
import { Styles } from '../../../../api/constants';

const LoadableDoughnutChart = Loadable({
  loader: () => import('react-chartjs-2'),
  loading: () => <PreloaderPage />,
  render: ({ default: Doughnut }, {
    title,
    options,
    valueLabel = title,
    ...props
  }) => (
    <Doughnut
      options={{
        title: {
          display: !!title,
          fontSize: 20,
          fontColor: Styles.color.darkGrey,
          text: title,
        },
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
          },
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title(tooltipItem, data) {
              const itemIndex = tooltipItem[0].index;
              return data.labels[itemIndex];
            },
            label(tooltipItem, data) {
              const chartData = data.datasets[0].data;
              return `${chartData[tooltipItem.index]}${valueLabel || ''}`;
            },
          },
        },
        ...options,
      }}
      {...props}
    />
  ),
});

export default pure(LoadableDoughnutChart);
