export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    matchedTo,
    color,
    notes,
  }, { userId, collections: { ValuePropositions } }) => ValuePropositions.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    matchedTo,
    createdBy: userId,
  }),
};
