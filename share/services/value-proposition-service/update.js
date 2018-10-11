export default async function updateValueProposition(args, context) {
  const {
    _id,
    title,
    originatorId,
    color,
    notes,
    fileIds,
    notify,
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
      updatedBy: userId,
    },
  };

  return ValuePropositions.update(query, modifier);
}
