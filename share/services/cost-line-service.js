import { cleanupCanvas } from './util/cleanup';

export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    percentOfTotalCost,
    color,
    notes,
  }, { userId, collections: { CostLines } }) => CostLines.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    percentOfTotalCost,
    createdBy: userId,
  }),
  async update({
    _id,
    title,
    originatorId,
    color,
    percentOfTotalCost,
    notes,
    fileIds,
    notify,
    goalIds,
    standardsIds,
    riskIds,
    nonconformityIds,
    potentialGainIds,
  }, { userId, collections: { CostLines } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        percentOfTotalCost,
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

    return CostLines.update(query, modifier);
  },
  async delete({ _id }, context) {
    const { costLine, collections: { CostLines } } = context;
    const [res] = await Promise.all([
      CostLines.remove({ _id }),
      cleanupCanvas(costLine, context),
    ]);
    return res;
  },
};
