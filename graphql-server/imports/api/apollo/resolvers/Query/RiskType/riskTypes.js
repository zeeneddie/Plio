import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (root, { organizationId }, { collections: { RiskTypes } }) => {
  const cursor = RiskTypes.find({ organizationId });

  return {
    totalCount: cursor.count(),
    riskTypes: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
