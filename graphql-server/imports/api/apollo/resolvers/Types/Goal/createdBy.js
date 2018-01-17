export default async ({ createdBy }, _, { collections: { Users } }) =>
  Users.findOne({ _id: createdBy });
