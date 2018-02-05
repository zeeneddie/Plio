import PropTypes from 'prop-types';
import React from 'react';
import { VictoryLabel, VictoryLine } from 'victory';

const TimelineCurrentDateLine = ({ label = 'today', height }) => (
  <VictoryLine
    style={{
      data: { stroke: '#888', strokeWidth: 1 },
      labels: { fill: '#888' },
    }}
    data={[
      { x: new Date(), y: 0, label },
      { x: new Date(), y: height },
    ]}
    labelComponent={<VictoryLabel dy={35} />}
  />
);

TimelineCurrentDateLine.propTypes = {
  label: PropTypes.string,
  height: PropTypes.number.isRequired,
};

export default TimelineCurrentDateLine;
