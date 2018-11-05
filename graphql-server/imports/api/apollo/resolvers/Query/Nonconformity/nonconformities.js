import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  { organizationId, type, isDeleted = false },
  { collections: { NonConformities } },
) => {
  const cursor = NonConformities.find({
    organizationId,
    type,
    isDeleted,
  });

  return {
    totalCount: cursor.count(),
    nonconformities: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
