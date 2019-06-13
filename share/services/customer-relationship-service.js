import { cleanupCanvas } from './util/cleanup';

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
    fileIds,
    notify,
    goalIds,
    standardsIds,
    riskIds,
    nonconformityIds,
    potentialGainIds,
  }, { userId, collections: { CustomerRelationships } }) {
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

    return CustomerRelationships.update(query, modifier);
  },
  async delete({ _id }, context) {
    const { customerRelationship, collections: { CustomerRelationships } } = context;
    const [res] = await Promise.all([
      CustomerRelationships.remove({ _id }),
      cleanupCanvas(customerRelationship, context),
    ]);
    return res;
  },
};
