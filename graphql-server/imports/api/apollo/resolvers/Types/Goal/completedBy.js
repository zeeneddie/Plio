export default async ({ completedBy }, _, { collections: { Users } }) =>
  Users.findOne({ _id: completedBy });
