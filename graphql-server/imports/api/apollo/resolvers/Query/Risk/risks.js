import {
  applyMiddleware,
} from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  {
    organizationId,
    isDeleted = false,
  },
  {
    collections: { Risks },
  }) => {
  const cursor = Risks.find({ organizationId, isDeleted });

  return {
    totalCount: cursor.count(),
    risks: cursor.fetch(),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
