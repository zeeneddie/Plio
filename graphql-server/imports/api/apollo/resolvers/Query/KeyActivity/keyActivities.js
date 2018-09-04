import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  { organizationId },
  { collections: { KeyActivities } },
) => {
  const cursor = KeyActivities.find({ organizationId });

  return {
    totalCount: cursor.count(),
    keyActivities: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
