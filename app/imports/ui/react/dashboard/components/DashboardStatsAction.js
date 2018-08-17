import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

const DashboardStatsAction = ({
  className,
  children,
  time,
  ...props
}) => (
  <a
    target="_blank"
    className={cx('dashboard-stats-action', className)}
    {...props}
  >
    {children}
    <label className="text-danger">
      {time} past due
    </label>
  </a>
);

DashboardStatsAction.propTypes = {
  className: PropTypes.string,
  time: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default DashboardStatsAction;
