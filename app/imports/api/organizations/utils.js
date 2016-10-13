import { Organizations } from './organizations.js';

/**
 * Get the date of joining the user to the organisation:
 * @param {String} organizationId - the organisation ID;
 * @param {String} userId - the user ID;
*/
export const getJoinUserToOrganizationDate = ({ organizationId, userId }) => {
  const org = Organizations.findOne({ _id: organizationId });

  if (!org) {
    return;
  }

  const orgUsers = org.users;
  const currentUserInOrg = _.find(orgUsers, user => user.userId === userId);

  return currentUserInOrg && currentUserInOrg.joinedAt;
};

export const getUserOrganizations = (userId, orgSelector = {}, options = {}) => {
  const selector = {
    users: {
      $elemMatch: {
        userId,
        isRemoved: false,
        removedBy: { $exists: false },
        removedAt: { $exists: false }
      }
    }
  };

  _.extend(selector, orgSelector);

  return Organizations.find(selector, options);
};
