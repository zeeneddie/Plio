import { Meteor } from 'meteor/meteor';
import { filter, compose, pluck, complement, prop, allPass, assoc } from 'ramda';
import { shouldUpdate } from 'recompose';
import { Random } from 'meteor/random';

import { DashboardUserStats } from '../components';

import { composeWithTracker, notEqProps } from '../../../../client/util';
import { namedCompose } from '../../helpers';
import { UserPresenceStatuses } from '../../../../api/constants';

const getOrgUserIds = compose(
  pluck('userId'),
  filter(complement(prop)('isRemoved')),
);

export default namedCompose('DashboardUserStatsContainer')(
  shouldUpdate(allPass([
    notEqProps('orgUsers'),
    notEqProps('usersPerRow'),
  ])),
  composeWithTracker(({ orgUsers, ...props }, onData) => {
    const orgUserIds = getOrgUserIds(orgUsers);
    const query = {
      _id: { $in: orgUserIds },
      status: {
        $in: [UserPresenceStatuses.ONLINE, UserPresenceStatuses.AWAY],
      },
    };
    const options = {
      sort: {
        'profile.firstName': 1,
      },
      fields: {
        _id: 1,
        status: 1,
        emails: 1,
        profile: 1,
      },
    };
    const users = Meteor.users.find(query, options).fetch();

    onData(null, { users, ...props });
  }, {
    propsToWatch: ['orgUsers'],
  }),
)(DashboardUserStats);
