import PropTypes from 'prop-types';
import React from 'react';

import { Icon } from '../../components';

const DashboardStatsMessage = ({
  url,
  extension,
  fullName,
  text,
  timeString,
}) => (
  <a
    className="dashboard-stats-message"
    href={url}
  >
    {extension ? (
      <Icon name={`file-${extension}-o`} />
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
};

export default DashboardStatsMessage;
