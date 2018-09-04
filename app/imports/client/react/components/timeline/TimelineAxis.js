import PropTypes from 'prop-types';
import React from 'react';
import { VictoryChart, VictoryAxis } from 'victory';

import { Timeline } from '../../../../api/constants';

const TimelineAxis = ({ height, offsetY, ...props }) => (
  <VictoryChart {...{ ...props, height }}>
    <VictoryAxis
      {...{ height, offsetY }}
      style={{
        axis: {
          stroke: 'none',
        },
        tickLabels: {
          angle: 0,
          border: 1,
          fill: '#999',
        },
      }}
    />
  </VictoryChart>
);

TimelineAxis.defaultProps = {
  offsetY: Timeline.AXIS_OFFSET_Y,
};

TimelineAxis.propTypes = {
  height: PropTypes.number,
  offsetY: PropTypes.number,
};

export default TimelineAxis;
