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
      updatedBy: userId,
    },
  };

  return CustomerSegments.update(query, modifier);
}
