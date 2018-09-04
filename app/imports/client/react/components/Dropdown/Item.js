import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

export const Item = ({
  pointer = false, active = false, children, ...other
}) => (
  <a className={cx('dropdown-item', { pointer, active })} {...other}>
    {children}
  </a>
);

Item.propTypes = {
  pointer: PropTypes.bool,
  active: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
};
