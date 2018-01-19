export default async (rootValue, { organizationId }, { collections: { Goals } }) =>
  Goals.find({ organizationId }).fetch();
