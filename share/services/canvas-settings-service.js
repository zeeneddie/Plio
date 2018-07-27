export default {
  async reorderItems(
    { organizationId, sectionName, newOrder },
    { collections: { CanvasSettings } },
  ) {
    const fieldPath = `${sectionName}.order`;

    return CanvasSettings.update(
      { organizationId },
      { $set: { [fieldPath]: newOrder } },
      { upsert: true },
    );
  },
};
