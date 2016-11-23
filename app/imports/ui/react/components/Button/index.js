import React, { PropTypes } from 'react';
import cx from 'classnames';

const Button = ({ children, type, onClick, className }) => (
  <a
    className={cx(`btn btn-${type}`, className)}
    onClick={onClick}
  >
    {children}  
  </a>
);

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary']),
};

export default Button;
