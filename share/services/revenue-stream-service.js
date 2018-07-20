export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    percentOfRevenue,
    percentOfProfit,
    color,
    notes,
  }, { userId, collections: { RevenueStreams } }) => RevenueStreams.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    percentOfRevenue,
    percentOfProfit,
    createdBy: userId,
  }),
};
