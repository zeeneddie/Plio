import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';
import { onlyUpdateForKeys } from 'recompose';

import { DashboardStatsExpandable, PlusButton } from '../../components';
import DashboardStatsUserList from './DashboardStatsUserList';
import { joinIds } from '../../../../client/util';

const enhance = onlyUpdateForKeys(['users', 'usersPerRow']);

export const DashboardUserStats = ({
  users,
  usersPerRow,
  onInvite,
}) => (
  <DashboardStatsExpandable
    items={users}
    itemsPerRow={usersPerRow}
    render={({ items }) => (
      <div key={joinIds(items)}>
        <DashboardStatsUserList users={items} />
      </div>
    )}
  >
    <PlusButton size="1" onClick={onInvite} />
    {pluralize('user', users.length, true)} online
  </DashboardStatsExpandable>
);

DashboardUserStats.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersPerRow: PropTypes.number.isRequired,
  onInvite: PropTypes.func.isRequired,
};

export default enhance(DashboardUserStats);
