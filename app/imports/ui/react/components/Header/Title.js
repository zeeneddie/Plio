import React, { PropTypes } from 'react';

const Title = props => (
  <span className="navbar-title">
    {props.children}
  </span>
);

Title.propTypes = {
  children: PropTypes.node,
};

export default Title;
