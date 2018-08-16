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
  async update({
    _id,
    title,
    originatorId,
    color,
    percentOfTotalCost,
    notes,
  }, { userId, collections: { CostLines } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        percentOfTotalCost,
        notes,
        updatedBy: userId,
      },
    };

    return CostLines.update(query, modifier);
  },
};
