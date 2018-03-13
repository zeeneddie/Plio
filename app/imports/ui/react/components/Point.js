import React from 'react';
import PropTypes from 'prop-types';
import { Point as VictoryPoint } from 'victory';

const Point = (props) => {
  switch (props.symbol) {
    case 'arrowLeft': return <text dx="-5" dy="4.5" {...props}>&#9668;</text>;
    case 'arrowRight': return <text dy="4.5" {...props}>&#9658;</text>;
    default: return <VictoryPoint {...props} />;
  }
};

Point.propTypes = {
  symbol: PropTypes.string,
};

export default Point;
