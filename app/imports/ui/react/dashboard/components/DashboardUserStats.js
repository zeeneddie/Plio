import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';
import { compose, join, pluck } from 'ramda';

import { DashboardStatsExpandable } from '../../components';
import DashboardStatsUserList from './DashboardStatsUserList';

export const DashboardUserStats = ({
  users,
  usersPerRow,
}) => (
  <DashboardStatsExpandable
    items={users}
    itemsPerRow={usersPerRow}
    render={({ items }) => (
      <div key={compose(join(' '), pluck('_id'))(items)}>
        <DashboardStatsUserList users={items} />
      </div>
    )}
  >
    {pluralize('user', users.length, true)} online
  </DashboardStatsExpandable>
);

DashboardUserStats.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersPerRow: PropTypes.number.isRequired,
};

export default DashboardUserStats;
