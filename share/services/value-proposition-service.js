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
  async update({
    _id,
    title,
    originatorId,
    color,
    matchedTo,
    notes,
  }, { userId, collections: { ValuePropositions } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        matchedTo,
        notes,
        updatedBy: userId,
      },
    };

    return ValuePropositions.update(query, modifier);
  },
  async delete({ _id }, { collections: { ValuePropositions } }) {
    return ValuePropositions.remove({ _id });
  },
};
