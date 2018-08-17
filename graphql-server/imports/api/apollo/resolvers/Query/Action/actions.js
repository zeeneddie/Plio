import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership, flattenInput } from '../../../../../share/middleware';

export const resolver = async (
  root,
  {
    organizationId,
    isDeleted = false,
    type,
  },
  {
    collections: { Actions },
  }) => {
  const query = { organizationId, isDeleted };

  if (type) Object.assign(query, { type });

  const cursor = Actions.find(query);

  return {
    totalCount: cursor.count(),
    actions: cursor.fetch(),
  };
};

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
