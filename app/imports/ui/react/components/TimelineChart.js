import PropTypes from 'prop-types';
import React from 'react';

import {
  VictoryChart,
  VictoryZoomContainer,
} from 'victory';

const TimelineChart = ({
  scale = { x: 'time' },
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
    containerComponent={(
      <VictoryZoomContainer
        dimension="x"
        // zoomDomain={zoomDomain}
        // onDomainChange={onZoom}
      />
    )}
    {...{
      scale,
      domainPadding,
      padding,
      ...props,
    }}
  >
    {children}
  </VictoryChart>
);

TimelineChart.propTypes = {
  ...VictoryChart.propTypes,
  children: PropTypes.node.isRequired,
};

export default TimelineChart;
