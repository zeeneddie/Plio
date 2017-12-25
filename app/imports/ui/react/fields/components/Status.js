import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { Icon } from '../../components/Icons';

const Status = ({
  color,
  children,
  className,
  ...props
}) => (
  <span className={cx('label text-default doc-status', className)} {...props}>
    <Icon margin="right" name="circle" {...{ color }} />
    {children}
  </span>
);

Status.propTypes = {
  // eslint-disable-next-line react/no-typos
  color: Icon.propTypes.color,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Status;
