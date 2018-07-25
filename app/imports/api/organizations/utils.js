import { Organizations } from '../../share/collections';
import { createOrgQueryWhereUserIsMember } from '../../share/mongo/queries';

export { getJoinUserToOrganizationDate } from '../../share/utils';

export const getUserOrganizations = (userId, orgSelector = {}, options = {}) => {
  const selector = {
    ...createOrgQueryWhereUserIsMember(userId),
    ...orgSelector,
  };

  return Organizations.find(selector, options);
};
