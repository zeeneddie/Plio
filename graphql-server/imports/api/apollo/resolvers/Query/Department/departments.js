import { applyMiddleware } from 'plio-util';
import { flattenInput, checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (root, { organizationId }, { collections: { Departments } }) => {
  const cursor = Departments.find({ organizationId });

  return {
    totalCount: cursor.count(),
    departments: cursor.fetch(),
  };
};

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
