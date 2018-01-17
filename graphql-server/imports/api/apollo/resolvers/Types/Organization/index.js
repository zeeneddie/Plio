export default {
  OrganizationUser: {
    user: async ({ userId }, _, { collections: { Users } }) =>
      Users.findOne({ _id: userId }),
  },
};
