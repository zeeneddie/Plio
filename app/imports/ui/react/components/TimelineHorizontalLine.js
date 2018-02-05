import PropTypes from 'prop-types';
import React from 'react';
import { VictoryLabel, VictoryLine } from 'victory';

const TimelineHorizontalLine = ({
  color,
  onClick,
  data,
  ...props
}) => (
  <VictoryLine
    animate={{ duration: 500 }}
    style={{
      data: {
        stroke: color,
        strokeWidth: 4,
        cursor: 'pointer',
      },
      labels: {
        fill: '#888',
        fontWeight: 'lighter',
        textAnchor: 'start',
      },
    }}
    events={[{
      target: 'data',
      eventHandlers: { onClick },
    }]}
    scale={{ x: 'time', y: 'linear' }}
    labelComponent={<VictoryLabel dx={20} />}
    {...{ data, ...props }}
  />
);

TimelineHorizontalLine.propTypes = {
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  // eslint-disable-next-line react/no-typos
  data: VictoryLine.propTypes.data,
};

export default TimelineHorizontalLine;
