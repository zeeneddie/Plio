export default async ({ deletedBy }, _, { collections: { Users } }) =>
  Users.findOne({ _id: deletedBy });
