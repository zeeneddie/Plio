import React from 'react';
import PropTypes from 'prop-types';
import { Point as VictoryPoint } from 'victory';

const Point = (props) => {
  switch (props.symbol) {
    case 'arrowLeft': return (
      <text
        {...{
          ...props,
          ...props.events,
          dy: '5',
          dx: '-5',
        }}
      >
        &#9664;
      </text>
    );
    case 'arrowRight': return (
      <text
        {...{
          ...props,
          ...props.events,
          dy: '5',
          dx: '-7',
        }}
      >
        &#9654;
      </text>
    );
    default: return <VictoryPoint {...props} />;
  }
};

Point.propTypes = {
  symbol: PropTypes.string,
  events: PropTypes.object,
};

export default Point;
