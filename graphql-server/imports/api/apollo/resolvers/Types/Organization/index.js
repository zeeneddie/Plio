export default {
  OrganizationUser: {
    user: async ({ userId }, _, { loaders: { User: { byId } } }) => byId.load(userId),
  },
};
