import React, { PropTypes } from 'react';
import cx from 'classnames';

export const Title = ({ children, className, ...other }) => (
  <h3 className={cx('card-title', className)} {...other}>
    {children}
  </h3>
);

Title.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
