export default (getId = (root, args) => args._id) => async (next, root, args, context) => {
  const _id = await getId(root, args, context);
  const { collections: { Milestones } } = context;

  await next(root, args, context);

  const milestone = await Milestones.findOne({ _id });

  return { milestone };
};
