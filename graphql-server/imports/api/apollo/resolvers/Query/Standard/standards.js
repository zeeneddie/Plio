import { applyMiddleware } from 'plio-util';
import { flattenInput, checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  {
    organizationId,
    isDeleted = false,
  },
  {
    collections: { Standards },
  },
) => {
  const cursor = Standards.find({ organizationId, isDeleted });

  return {
    totalCount: cursor.count(),
    standards: cursor.fetch(),
  };
};

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
