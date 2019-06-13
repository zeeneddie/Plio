import { cleanupCanvas } from './util/cleanup';

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
    goalIds,
    standardsIds,
    riskIds,
    nonconformityIds,
    potentialGainIds,
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
        goalIds,
        standardsIds,
        riskIds,
        nonconformityIds,
        potentialGainIds,
        updatedBy: userId,
      },
    };

    return KeyResources.update(query, modifier);
  },
  async delete({ _id }, context) {
    const { keyResource, collections: { KeyResources } } = context;
    const [res] = await Promise.all([
      KeyResources.remove({ _id }),
      cleanupCanvas(keyResource, context),
    ]);
    return res;
  },
};
