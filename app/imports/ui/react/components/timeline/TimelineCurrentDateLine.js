import PropTypes from 'prop-types';
import React from 'react';
import { VictoryLabel, VictoryLine } from 'victory';

const TimelineCurrentDateLine = ({ label = 'Today', height }) => (
  <VictoryLine
    style={{
      data: { stroke: '#d5d5d5', strokeWidth: 2 },
      labels: { fill: '#999' },
    }}
    data={[
      { x: new Date(), y: 0, label },
      { x: new Date(), y: height },
    ]}
    labelComponent={<VictoryLabel dy={30} />}
  />
);

TimelineCurrentDateLine.propTypes = {
  label: PropTypes.string,
  height: PropTypes.number.isRequired,
};

export default TimelineCurrentDateLine;
