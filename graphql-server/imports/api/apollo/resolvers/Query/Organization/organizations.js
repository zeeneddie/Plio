import { applyMiddleware } from 'plio-util';

import { createOrgQueryWhereUserIsMember } from '../../../../../share/mongo';
import { checkLoggedIn } from '../../../../../share/middleware';
import { CustomerTypes } from '../../../../../share/constants';

export const resolver = async (
  root,
  { customerType },
  { collections: { Organizations }, userId },
) => {
  let query;

  if (customerType === CustomerTypes.TEMPLATE) {
    query = {
      customerType,
    };
  } else {
    query = createOrgQueryWhereUserIsMember(userId);
  }

  const cursor = Organizations.find(query);

  return {
    totalCount: cursor.count(),
    organizations: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
)(resolver);
