import React from 'react';
import PropTypes from 'prop-types';
import { VictoryLabel } from 'victory';
import { compose, withProps, onlyUpdateForKeys } from 'recompose';
import { getTitleDX, getLineCenter } from './helpers';

const enhance = compose(
  onlyUpdateForKeys(['startDate', 'endDate', 'text', 'textAnchor']),
  withProps(({ data, datum: { y, textAnchor } }) => {
    const start = new Date(data[0].x).getTime();
    const end = new Date(data[1].x).getTime();
    return {
      x: getLineCenter(start, end),
      dx: getTitleDX(textAnchor),
      y,
      textAnchor,
    };
  }),
);

const TimelineTitle = ({
  x,
  y,
  dx,
  text,
  scale,
  textAnchor,
}) => (
  <VictoryLabel
    {...{
      scale,
      text,
      textAnchor,
      dx,
      datum: {
        x,
        y,
        _x: x,
        _y: y,
      },
      dy: -10,
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
  dx: PropTypes.number,
  text: PropTypes.string,
  scale: PropTypes.object,
  textAnchor: PropTypes.string,
};

export default enhance(TimelineTitle);
