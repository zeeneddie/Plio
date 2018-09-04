import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { map } from 'ramda';

import { DashboardStats } from '../../components';
import { getFullNameOrEmail } from '../../../../api/users/helpers';

const DashboardStatsUserList = ({ users }) => (
  <Fragment>
    {map(user => (
      <DashboardStats.User key={user._id} status={user.status}>
        {getFullNameOrEmail(user)}
      </DashboardStats.User>
    ), users)}
  </Fragment>
);

DashboardStatsUserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DashboardStatsUserList;
