import PropTypes from 'prop-types';
import React from 'react';
import { VictoryScatter, VictoryTooltip, Point } from 'victory';
import PopoverPoint from './PopoverPoint';

const TimelinePoint = ({
  color,
  onClick,
  renderPopoverContent,
  entityId,
  ...props
}) => (
  <VictoryScatter
    style={{
      data: {
        stroke: color,
        cursor: 'pointer',
      },
    }}
    events={onClick && [{
      target: 'data',
      eventHandlers: { onClick },
    }]}
    labelComponent={<VictoryTooltip />}
    dataComponent={
      renderPopoverContent ?
        <PopoverPoint id={entityId} {...{ renderPopoverContent }} /> : <Point />
    }
    {...props}
  />
);

TimelinePoint.propTypes = {
  color: PropTypes.string,
  entityId: PropTypes.string,
  onClick: PropTypes.func,
  renderPopoverContent: PropTypes.func,
};

export default TimelinePoint;
