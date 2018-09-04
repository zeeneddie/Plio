import PropTypes from 'prop-types';
import React from 'react';
import { VictoryScatter, VictoryTooltip, VictoryLabel } from 'victory';
import TimelinePoint from './TimelinePoint';

const HorizontalLinePoints = ({
  color,
  onClick,
  entityId,
  ...props
}) => (
  <VictoryScatter
    {...props}
    style={{
      data: {
        stroke: color,
        cursor: 'pointer',
      },
    }}
    labelComponent={
      <VictoryTooltip
        cornerRadius={2}
        style={{
          fill: '#fff',
        }}
        flyoutStyle={{
          stroke: '#000',
          fill: '#000',
        }}
        labelComponent={<VictoryLabel style={{ fill: '#fff' }} />}
      />
    }
    dataComponent={<TimelinePoint id={entityId} {...{ onClick }} />}
  />
);

HorizontalLinePoints.propTypes = {
  color: PropTypes.string,
  entityId: PropTypes.string,
  onClick: PropTypes.func,
};

export default HorizontalLinePoints;
