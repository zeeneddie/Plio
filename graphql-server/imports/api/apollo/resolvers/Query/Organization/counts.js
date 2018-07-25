import { Meteor } from 'meteor/meteor';
import { applyMiddleware } from 'plio-util';
import { reduce, merge, defaultTo } from 'ramda';

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
  const getCounts = async (collection) => {
    const rawCollection = collection.rawCollection();
    const aggregate = Meteor.wrapAsync(rawCollection.aggregate, rawCollection);

    const aggregationResult = aggregate([
      {
        $match: {
          organizationId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          notViewedCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $not: { $in: [userId, '$viewedBy'] } },
                    { $ne: ['$isCompleted', true] },
                    { $gt: ['$createdAt', joinedAt] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    return defaultTo({ totalCount: 0, notViewedCount: 0 }, aggregationResult[0]);
  };

  return Promise.all(
    [
      [Standards, HomeScreenTitlesTypes.STANDARDS],
      [Risks, HomeScreenTitlesTypes.RISKS],
      [NonConformities, HomeScreenTitlesTypes.NON_CONFORMITIES],
      [WorkItems, HomeScreenTitlesTypes.WORK_INBOX],
    ].map(async ([collection, key]) => ({ [key]: await getCounts(collection) })),
  ).then(reduce(merge, {}));
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
