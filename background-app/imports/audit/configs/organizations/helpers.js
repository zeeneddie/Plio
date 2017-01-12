import { _ } from 'meteor/underscore';

import { UserMembership } from '/imports/share/constants';
import { getUserId } from '../../utils/helpers';


export const getReceivers = function (doc, user) {
  const executorId = getUserId(user);

  const orgOwners = doc.users.filter((userData) => {
    const { userId, role, isRemoved } = userData;

    return _.every([
      executorId !== userId,
      role === UserMembership.ORG_OWNER,
      isRemoved === false,
    ]);
  });

  return _.pluck(orgOwners, 'userId');
};
