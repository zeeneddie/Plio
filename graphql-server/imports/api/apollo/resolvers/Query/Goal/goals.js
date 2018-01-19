// needs protection
export default async (rootValue, { organizationId, limit }, { collections: { Goals } }) =>
  Goals.find({ organizationId }, { limit }).fetch();
