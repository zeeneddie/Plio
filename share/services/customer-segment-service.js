export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    matchedTo,
    percentOfMarketSize,
    color,
    notes,
  }, { userId, collections: { CustomerSegments } }) => CustomerSegments.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    percentOfMarketSize,
    matchedTo,
    createdBy: userId,
  }),
  async update({
    _id,
    title,
    originatorId,
    color,
    matchedTo,
    percentOfMarketSize,
    notes,
  }, { userId, collections: { CustomerSegments } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        matchedTo,
        percentOfMarketSize,
        notes,
        updatedBy: userId,
      },
    };

    return CustomerSegments.update(query, modifier);
  },
};
