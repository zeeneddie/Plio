export default {
  async insert({
    organizationId,
    title,
    originatorId,
    color,
    criticality,
    levelOfSpend,
    notes,
  }, { userId, collections: { KeyPartners } }) {
    return KeyPartners.insert({
      organizationId,
      title,
      originatorId,
      color,
      criticality,
      levelOfSpend,
      notes,
      createdBy: userId,
    });
  },
};
