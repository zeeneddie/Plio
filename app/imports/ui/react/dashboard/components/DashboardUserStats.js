import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'ramda';
import pluralize from 'pluralize';

import { DashboardStats } from '../../components';
import { getFullNameOrEmail } from '../../../../api/users/helpers';

const DashboardUserStats = ({ users }) => !!users.length && (
  <DashboardStats>
    <DashboardStats.Title>
      {pluralize('user', users.length, true)} online
    </DashboardStats.Title>
    {map(user => (
      <DashboardStats.User key={user._id} status={user.status}>
        {getFullNameOrEmail(user)}
      </DashboardStats.User>
    ), users)}
  </DashboardStats>
);

DashboardUserStats.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

export default DashboardUserStats;
