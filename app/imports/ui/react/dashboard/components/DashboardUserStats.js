import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';
import { branch } from 'recompose';
import { converge, gt, prop, identity } from 'ramda';

import { getUsersLength } from '../../../../client/util';
import { DashboardStats, Collapse, Button, Icon } from '../../components';
import DashboardStatsUserList from './DashboardStatsUserList';
import { withStateToggle, namedCompose } from '../../helpers';

const usersExceedLimit = converge(gt, [
  getUsersLength,
  prop('usersPerRow'),
]);

const enhance = namedCompose('DashboardUserStats')(
  branch(
    usersExceedLimit,
    withStateToggle(false, 'isOpen', 'toggle'),
    identity,
  ),
);

const DashboardUserStats = enhance(({
  users,
  isOpen,
  toggle,
  usersPerRow,
}) => !!users.length && (
  <DashboardStats>
    <DashboardStats.Title>
      {!!toggle && (
        <Button size="1" color="secondary add" onClick={toggle}>
          <Icon name="plus" />
        </Button>
      )}
      {pluralize('user', users.length, true)} online
    </DashboardStats.Title>
    <DashboardStatsUserList users={users.slice(0, usersPerRow)} />

    {!!toggle && (
      <Collapse {...{ isOpen }}>
        <DashboardStatsUserList users={users.slice(usersPerRow)} />
      </Collapse>
    )}
  </DashboardStats>
));

DashboardUserStats.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersPerRow: PropTypes.number.isRequired,
};

export default DashboardUserStats;
