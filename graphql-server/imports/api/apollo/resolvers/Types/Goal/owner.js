export default async ({ ownerId }, _, { collections: { Users } }) =>
  Users.findOne({ _id: ownerId });
