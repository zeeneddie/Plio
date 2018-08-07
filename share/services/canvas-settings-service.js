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
};
