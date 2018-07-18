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
};
