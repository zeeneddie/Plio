import { Organizations } from '/imports/share/collections/organizations.js';

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
