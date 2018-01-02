import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';

import { DashboardStats } from '../../components';
import DashboardStatsUserList from './DashboardStatsUserList';

export const DashboardUserStats = ({
  messages,
  count,
}) => !!messages.length && (
  <DashboardStats>
    <DashboardStats.Title>
      {count}
      
    </DashboardStats.Title>
  </DashboardStats>
);

DashboardUserStats.propTypes = {

};

export default DashboardUserStats;
