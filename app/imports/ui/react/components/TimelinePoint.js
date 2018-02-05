import PropTypes from 'prop-types';
import React from 'react';
import { VictoryScatter, VictoryTooltip } from 'victory';

const TimelinePoint = ({ color, onClick, ...props }) => (
  <VictoryScatter
    style={{
      data: {
        stroke: color,
        cursor: 'pointer',
      },
    }}
    events={[{
      target: 'data',
      eventHandlers: { onClick },
    }]}
    labelComponent={<VictoryTooltip />}
    {...props}
  />
);

TimelinePoint.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default TimelinePoint;
