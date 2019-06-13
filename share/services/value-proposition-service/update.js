export default async function updateValueProposition(args, context) {
  const {
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
  } = args;
  const { userId, collections: { ValuePropositions } } = context;
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

  return ValuePropositions.update(query, modifier);
}
