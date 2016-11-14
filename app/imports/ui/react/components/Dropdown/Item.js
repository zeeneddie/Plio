import React, { PropTypes } from 'react';
import cx from 'classnames';

export const Item = ({ pointer = false, active = false, children, ...other }) => (
  <a className={cx('dropdown-item', { pointer, active })} {...other}>
    {children}
  </a>
);

Item.propTypes = {
  pointer: PropTypes.bool,
  active: PropTypes.bool,
  children: PropTypes.array,
  onClick: PropTypes.func,
};
