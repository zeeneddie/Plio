import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { getActiveOrgUserIds } from 'plio-util';

import { getUsersCursorByIdsAndOrgId } from '../../../server/helpers/pub-helpers';
import { isOrgMember } from '../../checkers';
import { publishWithMiddleware } from '../../helpers/server';
import { checkLoggedIn, checkOrgMembership } from '../../../share/middleware';
import { Organizations } from '../../../share/collections';
import { UserPresenceStatuses } from '../../constants';

Meteor.publish(null, function publishCurrentUser() {
  const query = { _id: this.userId };
  const options = {
    fields: {
      ...Meteor.users.publicFields,
      preferences: 1,
    },
  };
  return Meteor.users.find(query, options);
});

Meteor.publish('organizationUsers', function publishOrganizationUsers(userIds, organizationId) {
  check(userIds, [String]);
  check(organizationId, String);

  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) return this.ready();

  return getUsersCursorByIdsAndOrgId(userIds, organizationId);
});

publishWithMiddleware(
  ({ organizationId }) => {
    check(organizationId, String);

    const { users = [] } = Organizations.findOne({ _id: organizationId }, {
      fields: {
        'users.userId': 1,
        'users.isRemoved': 1,
      },
    });
    const userIds = getActiveOrgUserIds(users);
    const query = {
      _id: {
        $in: userIds,
      },
      status: {
        $in: [UserPresenceStatuses.ONLINE, UserPresenceStatuses.AWAY],
      },
    };
    const options = {
      fields: {
        _id: 1,
        status: 1,
        'emails[0].address': 1,
        'profile.firstName': 1,
        'profile.lastName': 1,
      },
    };

    return Meteor.users.find(query, options);
  },
  {
    name: 'Users.online',
    middleware: [checkLoggedIn(), checkOrgMembership()],
  },
);
