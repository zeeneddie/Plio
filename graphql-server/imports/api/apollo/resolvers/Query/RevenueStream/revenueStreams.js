import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  { organizationId },
  { collections: { RevenueStreams } },
) => {
  const cursor = RevenueStreams.find({ organizationId });

  return {
    totalCount: cursor.count(),
    revenueStreams: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
