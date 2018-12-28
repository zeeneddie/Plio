import { cleanupCanvas } from './util/cleanup';

export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    color,
    notes,
  }, { userId, collections: { Channels } }) => Channels.insert({
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
    fileIds,
    notify,
    goalIds,
    standardsIds,
    riskIds,
    nonconformityIds,
    potentialGainIds,
  }, { userId, collections: { Channels } }) {
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

    return Channels.update(query, modifier);
  },
  async delete({ _id }, context) {
    const { channel, collections: { Channels } } = context;
    const [res] = await Promise.all([
      Channels.remove({ _id }),
      cleanupCanvas(channel, context),
    ]);

    return res;
  },
};
