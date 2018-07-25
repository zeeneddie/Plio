import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { Icon, IconFile } from '../../components';

const DashboardStatsMessage = ({
  url,
  extension,
  fullName,
  text,
  timeString,
  className,
}) => (
  <a
    className={cx('dashboard-stats-message', className)}
    href={url}
  >
    {extension ? (
      <IconFile {...{ extension }} />
    ) : (
      <Icon name="comment" />
    )}
    <strong>{fullName}: </strong>
    {text}
    <span className="text-muted">{timeString} ago</span>
  </a>
);

DashboardStatsMessage.propTypes = {
  url: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  timeString: PropTypes.string.isRequired,
  extension: PropTypes.string,
  className: PropTypes.string,
};

export default DashboardStatsMessage;
