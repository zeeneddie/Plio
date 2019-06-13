export default async function updateCustomerSegment(args, context) {
  const {
    _id,
    title,
    originatorId,
    color,
    percentOfMarketSize,
    notes,
    fileIds,
    notify,
    goalIds,
    standardsIds,
    riskIds,
    nonconformityIds,
    potentialGainIds,
  } = args;
  const { userId, collections: { CustomerSegments } } = context;
  const query = { _id };
  const modifier = {
    $set: {
      title,
      originatorId,
      color,
      percentOfMarketSize,
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

  return CustomerSegments.update(query, modifier);
}
