export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    percentOfTotalCost,
    color,
    notes,
  }, { userId, collections: { CostLines } }) => CostLines.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    percentOfTotalCost,
    createdBy: userId,
  }),
};
