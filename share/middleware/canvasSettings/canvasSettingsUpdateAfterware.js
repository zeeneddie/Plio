export default (getOrganizationId = (root, args) => args.organizationId) => (
  async (next, root, args, context) => {
    const organizationId = await getOrganizationId(root, args, context);
    const { collections: { CanvasSettings } } = context;

    await next(root, args, context);

    return CanvasSettings.findOne({ organizationId });
  }
);
