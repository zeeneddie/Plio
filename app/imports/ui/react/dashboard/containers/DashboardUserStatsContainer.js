import React from 'react';
import { Meteor } from 'meteor/meteor';
import { filter, compose, pluck, complement, prop, eqProps } from 'ramda';
import { shouldUpdate } from 'recompose';

import { DashboardUserStats, PreloaderPage } from '../components';

import { composeWithTracker } from '../../../../client/util';
import { namedCompose } from '../../helpers';
import { UserPresenceStatuses } from '../../../../api/constants';

const getOrgUserIds = compose(
  pluck('userId'),
  filter(complement(prop)('isRemoved')),
);

export default namedCompose('DashboardUserStatsContainer')(
  shouldUpdate(complement(eqProps)('orgUsers')),
  composeWithTracker(({ orgUsers }, onData) => {
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

    onData(null, { users });
  }, {
    propsToWatch: ['orgUsers'],
    loadingHandler: () => <PreloaderPage size={2} />,
  }),
)(DashboardUserStats);
