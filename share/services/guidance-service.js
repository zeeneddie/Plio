export default {
  update: async ({ documentType, html }, { userId, collections: { Guidances } }) =>
    Guidances.update({ documentType }, {
      $set: {
        html,
        updatedBy: userId,
        createdBy: userId,
      },
    }, { upsert: true }),
};
