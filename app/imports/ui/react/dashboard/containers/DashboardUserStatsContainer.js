import { Meteor } from 'meteor/meteor';
import { filter, compose, pluck, complement, prop } from 'ramda';

import { DashboardUserStats } from '../components';

import { composeWithTracker } from '../../../../client/util';
import { namedCompose } from '../../helpers';
import { UserPresenceStatuses } from '../../../../api/constants';

const getOrgUserIds = compose(
  pluck('userId'),
  filter(complement(prop)('isRemoved')),
);

export default namedCompose('DashboardUserStatsContainer')(
  composeWithTracker(({ organization }, onData) => {
    const orgUserIds = getOrgUserIds(organization.users);
    const query = {
      _id: { $in: orgUserIds },
      status: {
        $n: [UserPresenceStatuses.ONLINE, UserPresenceStatuses.AWAY],
      },
    };
    const options = { sort: { 'profile.firstName': 1 } };
    const users = Meteor.users.find(query, options).fetch();

    onData(null, { users });
  }),
)(DashboardUserStats);
