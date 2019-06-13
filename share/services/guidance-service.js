export default {
  insert: async (args, context) => {
    const { documentType, title, html } = args;
    const { userId, collections: { Guidances } } = context;
    return Guidances.insert({
      documentType,
      title,
      html,
      createdBy: userId,
    });
  },

  update: async (args, context) => {
    const {
      _id,
      html,
      title,
    } = args;
    const { userId, collections: { Guidances } } = context;
    const query = { _id };
    const modifier = {
      $set: {
        title,
        html,
        updatedBy: userId,
      },
    };
    return Guidances.update(query, modifier);
  },

  remove: async ({ _id }, { collections: { Guidances } }) => Guidances.remove({ _id }),
};
