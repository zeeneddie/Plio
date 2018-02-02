import React from 'react';
import { VictoryAxis } from 'victory';

const HiddenAxis = () => (
  <VictoryAxis
    style={{
      axis: {
        stroke: 'none',
      },
    }}
  />
);

export default HiddenAxis;
