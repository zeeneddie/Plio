import React, { PropTypes } from 'react';

const Title = (props) => (
  <span className="navbar-title">
    {props.children}
  </span>
);

Title.propTypes = {
  text: PropTypes.string,
};

export default Title;
