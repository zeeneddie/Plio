export default {
  File: {
    organization: async ({ organizationId }, _, { collections: { Organizations } }) =>
      Organizations.findOne({ _id: organizationId }),
  },
};
