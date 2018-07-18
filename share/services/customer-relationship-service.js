export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    color,
    notes,
  }, { userId, collections: { CustomerRelationships } }) => CustomerRelationships.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    createdBy: userId,
  }),
};
