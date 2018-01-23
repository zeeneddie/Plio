// needs protection
export default async (rootValue, { organizationId, limit }, { collections: { Goals } }) => {
  const query = { organizationId };
  const options = { limit };
  const goals = Goals.find(query, options).fetch();
  const totalCount = Goals.find(query).count();

  return {
    totalCount,
    goals,
  };
};
