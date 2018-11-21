import { applyMiddleware } from 'plio-util';
import { flattenInput, checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (root, { organizationId }, { collections: { Projects } }) => {
  const cursor = Projects.find({ organizationId });

  return {
    totalCount: cursor.count(),
    projects: cursor.fetch(),
  };
};

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
