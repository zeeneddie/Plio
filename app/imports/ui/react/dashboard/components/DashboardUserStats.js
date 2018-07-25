import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';
import { onlyUpdateForKeys } from 'recompose';
import { joinIds } from 'plio-util';

import { DashboardStatsExpandable, PlusButton } from '../../components';
import DashboardStatsUserList from './DashboardStatsUserList';

const enhance = onlyUpdateForKeys(['users', 'usersPerRow', 'canInviteUsers']);

export const DashboardUserStats = ({
  users,
  usersPerRow,
  onInvite,
  canInviteUsers,
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
    {!!canInviteUsers && <PlusButton size="1" onClick={onInvite} />}
    {pluralize('user', users.length, true)} online
  </DashboardStatsExpandable>
);

DashboardUserStats.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersPerRow: PropTypes.number.isRequired,
  onInvite: PropTypes.func.isRequired,
  canInviteUsers: PropTypes.bool,
};

export default enhance(DashboardUserStats);
