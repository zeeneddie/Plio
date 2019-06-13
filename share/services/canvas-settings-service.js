export default {
  async reorderItems(
    { organizationId, sectionName, order },
    { userId, collections: { CanvasSettings } },
  ) {
    const fieldPath = `${sectionName}.order`;

    return CanvasSettings.update(
      { organizationId },
      {
        $set: {
          [fieldPath]: order,
          updatedBy: userId,
        },
      },
    );
  },

  async update(args, context) {
    const { organizationId, notify } = args;
    const { userId, collections: { CanvasSettings } } = context;
    const query = { organizationId };
    const modifier = {
      $set: {
        notify,
        updatedBy: userId,
      },
    };

    return CanvasSettings.update(query, modifier);
  },
};
