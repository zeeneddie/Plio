import React from 'react';
import PropTypes from 'prop-types';
import { VictoryLabel } from 'victory';
import { compose, withProps, onlyUpdateForKeys } from 'recompose';

const enhance = compose(
  onlyUpdateForKeys(['startDate', 'endDate', 'text']),
  withProps(({ data, datum }) => {
    const startDate = data[0].x.getTime();
    const endDate = data[1].x.getTime();
    return {
      x: new Date(startDate + (endDate - startDate) / 2),
      y: datum.y,
    };
  }),
);

const TimelineTitle = ({
  x,
  y,
  text,
  scale,
}) => (
  <VictoryLabel
    {...{
      scale,
      text,
      datum: {
        x,
        y,
        _x: x,
        _y: y,
      },
      dy: -10,
      textAnchor: 'middle',
      verticalAnchor: 'end',
      style: {
        fill: '#373a3c',
      },
    }}
  />
);

TimelineTitle.propTypes = {
  x: PropTypes.object,
  y: PropTypes.number,
  text: PropTypes.string,
  scale: PropTypes.object,
};

export default enhance(TimelineTitle);
