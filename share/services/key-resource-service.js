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
    fileIds,
    notify,
  }, { userId, collections: { KeyResources } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        notes,
        fileIds,
        notify,
        updatedBy: userId,
      },
    };

    return KeyResources.update(query, modifier);
  },
  async delete({ _id }, { collections: { KeyResources } }) {
    return KeyResources.remove({ _id });
  },
};
