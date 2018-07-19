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
};
