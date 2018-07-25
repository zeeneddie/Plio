import { Meteor } from 'meteor/meteor';
import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (root, args, context) => {
  const { organizationId, limit, isCompletedOrDeleted = false } = args;
  const { collections: { Goals } } = context;
  const query = { organizationId };
  const goalsRawCollection = Goals.rawCollection();
  const aggregate = Meteor.wrapAsync(goalsRawCollection.aggregate, goalsRawCollection);
  const pipeline = [{ $match: query }];

  if (isCompletedOrDeleted) {
    Object.assign(query, {
      $or: [
        { isDeleted: true },
        { isCompleted: true },
      ],
    });

    pipeline.push(
      {
        $addFields: {
          completedOrDeletedDate: {
            $cond: ['$isCompleted', '$completedAt', '$deletedAt'],
          },
        },
      },
      {
        $sort: { completedOrDeletedDate: -1 },
      },
    );
  } else {
    Object.assign(query, {
      isDeleted: false,
      isCompleted: false,
    });

    pipeline.push({
      $sort: {
        priority: 1,
        endDate: 1,
      },
    });
  }

  if (limit) pipeline.push({ $limit: limit });

  const goals = await aggregate(...pipeline);
  const totalCount = await Goals.find(query).count();

  return {
    goals,
    totalCount,
  };
};

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
