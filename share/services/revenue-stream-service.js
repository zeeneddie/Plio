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
  async update({
    _id,
    title,
    originatorId,
    color,
    percentOfRevenue,
    percentOfProfit,
    notes,
  }, { userId, collections: { RevenueStreams } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        percentOfRevenue,
        percentOfProfit,
        notes,
        updatedBy: userId,
      },
    };

    return RevenueStreams.update(query, modifier);
  },
};