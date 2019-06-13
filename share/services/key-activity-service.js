import { cleanupCanvas } from './util/cleanup';

export default {
  async insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
  }, { userId, collections: { KeyActivities } }) {
    return KeyActivities.insert({
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
  }, { userId, collections: { KeyActivities } }) {
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

    return KeyActivities.update(query, modifier);
  },
  async delete({ _id }, context) {
    const { keyActivity, collections: { KeyActivities } } = context;
    const [res] = await Promise.all([
      KeyActivities.remove({ _id }),
      cleanupCanvas(keyActivity, context),
    ]);
    return res;
  },
};
