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
  async update({
    _id,
    title,
    originatorId,
    color,
    notes,
  }, { userId, collections: { CustomerRelationships } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        notes,
        updatedBy: userId,
      },
    };

    return CustomerRelationships.update(query, modifier);
  },
};
