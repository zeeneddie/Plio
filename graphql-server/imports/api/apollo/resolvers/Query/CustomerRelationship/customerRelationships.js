import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  { organizationId },
  { collections: { CustomerRelationships } },
) => {
  const cursor = CustomerRelationships.find({ organizationId });

  return {
    totalCount: cursor.count(),
    customerRelationships: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
