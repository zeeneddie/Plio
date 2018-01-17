export default async ({ updatedBy }, _, { collections: { Users } }) =>
  Users.findOne({ _id: updatedBy });
