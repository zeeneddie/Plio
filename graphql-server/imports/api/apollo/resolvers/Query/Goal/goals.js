import { Meteor } from 'meteor/meteor';
import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

const getGoals = async ({ organizationId, limit }, GoalsCollection) => {
  const query = {
    organizationId,
    isDeleted: false,
    isCompleted: false,
  };
  const options = { limit };
  const totalCount = await GoalsCollection.find(query).count();
  const goals = await GoalsCollection.find(query, options).fetch();

  return {
    totalCount,
    goals,
  };
};

const getCompletedDeletedGoals = async ({ organizationId, limit }, GoalsCollection) => {
  const query = {
    organizationId,
    $or: [
      { isDeleted: true },
      { isCompleted: true },
    ],
  };

  const totalCount = await GoalsCollection.find(query).count();
  const goalsRawCollection = GoalsCollection.rawCollection();
  const aggregate = Meteor.wrapAsync(goalsRawCollection.aggregate, goalsRawCollection);
  const goals = await aggregate(
    { $match: query },
    {
      $addFields: {
        completedOrDeletedDate: {
          $cond: ['$isCompleted', '$completedAt', '$deletedAt'],
        },
      },
    },
    { $sort: { completedOrDeletedDate: -1 } },
    { $limit: limit },
  );
  return {
    totalCount,
    goals,
  };
};

export const resolver = async (
  root,
  { isCompletedOrDeleted = false, ...restVariables },
  { collections: { Goals } },
) => {
  if (isCompletedOrDeleted) {
    return getCompletedDeletedGoals(restVariables, Goals);
  }
  return getGoals(restVariables, Goals);
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
