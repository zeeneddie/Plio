import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  { organizationId },
  { collections: { ValuePropositions } },
) => {
  const cursor = ValuePropositions.find({ organizationId });

  return {
    totalCount: cursor.count(),
    valuePropositions: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
