export default async ({ notify }, _, { collections: { Users } }) =>
  Users.find({ _id: { $in: notify } }).fetch();
