import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { IconUser } from '../../components';

const DashboardStatsUser = ({
  tag: Tag = 'span',
  className,
  children,
  status,
  ...props
}) => (
  <Tag className={cx('dashboard-stats-user', className)} {...props}>
    <IconUser className={cx(status)} />
    {children}
  </Tag>
);

DashboardStatsUser.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  children: PropTypes.node,
  status: PropTypes.string,
};

export default DashboardStatsUser;
