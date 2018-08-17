import PropTypes from 'prop-types';
import React from 'react';

const Title = props => (
  <span className="navbar-title">
    {props.children}
  </span>
);

Title.propTypes = {
  children: PropTypes.node,
};

export default Title;
