import PropTypes from 'prop-types';
import React from 'react';

const Wrapper = ({ children, ...other }) => (
  <div {...other}>
    {children}
  </div>
);

Wrapper.propTypes = {
  children: PropTypes.node,
};

export default Wrapper;
