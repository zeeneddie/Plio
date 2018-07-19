import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  { organizationId },
  { collections: { CustomerSegments } },
) => {
  const cursor = CustomerSegments.find({ organizationId });

  return {
    totalCount: cursor.count(),
    customerSegments: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
