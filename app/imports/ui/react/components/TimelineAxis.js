import React from 'react';
import { VictoryAxis } from 'victory';

const TimelineAxis = () => (
  <VictoryAxis
    style={{
      axis: {
        stroke: 'none',
      },
      tickLabels: {
        angle: 0,
        padding: 30,
        border: 1,
      },
    }}
  />
);

export default TimelineAxis;
