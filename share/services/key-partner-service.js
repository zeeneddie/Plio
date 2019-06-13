import { cleanupCanvas } from './util/cleanup';

export default {
  async insert({
    organizationId,
    title,
    originatorId,
    color,
    criticality,
    levelOfSpend,
    notes,
  }, { userId, collections: { KeyPartners } }) {
    return KeyPartners.insert({
      organizationId,
      title,
      originatorId,
      color,
      criticality,
      levelOfSpend,
      notes,
      createdBy: userId,
    });
  },
  async update({
    _id,
    title,
    originatorId,
    color,
    criticality,
    levelOfSpend,
    notes,
    fileIds,
    notify,
    goalIds,
    standardsIds,
    riskIds,
    nonconformityIds,
    potentialGainIds,
  }, { userId, collections: { KeyPartners } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        criticality,
        levelOfSpend,
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

    return KeyPartners.update(query, modifier);
  },
  async delete({ _id }, context) {
    const { keyPartner, collections: { KeyPartners } } = context;
    const [res] = await Promise.all([
      KeyPartners.remove({ _id }),
      cleanupCanvas(keyPartner, context),
    ]);
    return res;
  },
};
