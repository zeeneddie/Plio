import PropTypes from 'prop-types';
import React from 'react';
import { VictoryChart } from 'victory';

import TimelineAxis from './TimelineAxis';

const TimelineChart = ({
  scale = { x: 'time', y: 'linear' },
  domainPadding = { x: [15, 15] },
  padding = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  children,
  ...props
}) => (
  <VictoryChart
    {...{
      scale,
      domainPadding,
      padding,
      ...props,
    }}
  >
    {TimelineAxis()}
    {children}
  </VictoryChart>
);

TimelineChart.propTypes = {
  ...VictoryChart.propTypes,
  children: PropTypes.node.isRequired,
};

export default TimelineChart;
