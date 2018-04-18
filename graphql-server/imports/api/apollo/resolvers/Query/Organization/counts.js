import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';
import { getJoinUserToOrganizationDate } from '../../../../../share/utils';
import { HomeScreenTitlesTypes } from '../../../../../share/constants';

export const resolver = async (root, { organizationId }, { collections, userId }) => {
  const {
    Standards,
    Risks,
    NonConformities,
    WorkItems,
  } = collections;
  const joinedAt = getJoinUserToOrganizationDate({ organizationId, userId });
  const getCounts = (collection) => {
    const query = { organizationId, isDeleted: false };
    const notViewedQuery = {
      ...query,
      viewedBy: { $ne: userId },
      isCompleted: { $ne: true },
    };

    if (joinedAt) Object.assign(query, { createdAt: { $gt: joinedAt } });

    return {
      totalCount: collection.find(query).count(),
      notViewedCount: collection.find(notViewedQuery).count(),
    };
  };

  return {
    [HomeScreenTitlesTypes.STANDARDS]: getCounts(Standards),
    [HomeScreenTitlesTypes.RISKS]: getCounts(Risks),
    [HomeScreenTitlesTypes.NON_CONFORMITIES]: getCounts(NonConformities),
    [HomeScreenTitlesTypes.WORK_INBOX]: getCounts(WorkItems),
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
