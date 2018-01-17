export default {
  Action: {
    createdBy: async ({ createdBy }, _, { loaders: { User: { byId } } }) => byId.load(createdBy),
    updatedBy: async ({ updatedBy }, _, { loaders: { User: { byId } } }) => byId.load(updatedBy),
    completedBy: async ({ completedBy }, _, { loaders: { User: { byId } } }) =>
      byId.load(completedBy),
  },
};
