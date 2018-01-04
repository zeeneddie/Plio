import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Title from './Title';
import User from './User';

const DashboardStats = ({ className, children, ...props }) => (
  <div className={cx('dashboard-stats', className)} {...props}>
    {children}
  </div>
);

DashboardStats.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

DashboardStats.Title = Title;
DashboardStats.User = User;

export default DashboardStats;
