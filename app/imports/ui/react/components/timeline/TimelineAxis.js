import React from 'react';
import { VictoryChart, VictoryAxis } from 'victory';
import moment from 'moment';

const TimelineAxis = props => (
  <VictoryChart {...props}>
    <VictoryAxis
      style={{
        axis: {
          stroke: 'none',
        },
        tickLabels: {
          angle: 0,
          padding: -12,
          border: 1,
          fill: '#999',
        },
      }}
      tickFormat={x => moment(x).format('MMM')}
    />
  </VictoryChart>
);

export default TimelineAxis;
