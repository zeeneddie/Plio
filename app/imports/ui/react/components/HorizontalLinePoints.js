import PropTypes from 'prop-types';
import React from 'react';
import { VictoryScatter, VictoryTooltip } from 'victory';
import TimelinePoint from './TimelinePoint';

const HorizontalLinePoints = ({
  color,
  onClick,
  renderPopoverContent,
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
    events={onClick && [{
      target: 'data',
      eventHandlers: { onClick },
    }]}
    labelComponent={<VictoryTooltip />}
    dataComponent={<TimelinePoint id={entityId} {...{ renderPopoverContent }} />}
  />
);

HorizontalLinePoints.propTypes = {
  color: PropTypes.string,
  entityId: PropTypes.string,
  onClick: PropTypes.func,
  renderPopoverContent: PropTypes.func,
};

export default HorizontalLinePoints;
