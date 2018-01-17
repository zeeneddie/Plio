export default async (rootValue, args, { collections: { Goals } }) =>
  Goals.find().fetch();
