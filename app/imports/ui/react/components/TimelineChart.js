import PropTypes from 'prop-types';
import React from 'react';
import { VictoryChart } from 'victory';

import HiddenAxis from './HiddenAxis';

const TimelineChart = ({
  scale = { x: 'time', y: 'linear' },
  domainPadding = { x: [20, 20] },
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
    {HiddenAxis()}
    {children}
  </VictoryChart>
);

TimelineChart.propTypes = {
  ...VictoryChart.propTypes,
  children: PropTypes.node.isRequired,
};

export default TimelineChart;
