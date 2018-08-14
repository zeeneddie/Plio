export default {
  async insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
  }, { userId, collections: { KeyResources } }) {
    return KeyResources.insert({
      organizationId,
      title,
      originatorId,
      color,
      notes,
      createdBy: userId,
    });
  },
  async update({
    _id,
    title,
    originatorId,
    color,
    notes,
  }, { userId, collections: { KeyResources } }) {
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

    return KeyResources.update(query, modifier);
  },
};
