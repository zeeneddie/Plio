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
        fill: '#373a3c',
        textAnchor: 'start',
      },
    }}
    events={[{
      target: 'data',
      eventHandlers: { onClick },
    }]}
    labelComponent={<VictoryLabel dx={5} />}
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
