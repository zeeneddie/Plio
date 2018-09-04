import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const DashboardStatsTitle = ({
  tag: Tag = 'h4',
  className,
  children,
  ...props
}) => (
  <Tag className={cx('dashboard-stats-title', className)} {...props}>
    {children}
  </Tag>
);

DashboardStatsTitle.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default DashboardStatsTitle;
